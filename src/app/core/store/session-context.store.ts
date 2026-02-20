import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';
import { AccountApi } from '../api/account.api';
import { AccountDTO } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class SessionContextStore {
  private readonly accountApi = inject(AccountApi);
  private readonly router = inject(Router);
  private readonly selectedRoleStorageKey = 'wif.selectedRole';

  private readonly accountSubject = new BehaviorSubject<AccountDTO | null>(null);
  readonly account$ = this.accountSubject.asObservable();

  private readonly availableRolesSubject = new BehaviorSubject<string[]>([]);
  readonly availableRoles$ = this.availableRolesSubject.asObservable();

  private readonly selectedRoleSubject = new BehaviorSubject<string | null>(null);
  readonly selectedRole$ = this.selectedRoleSubject.asObservable();

  private accountLoaded = false;
  private inFlightAccount$: Observable<AccountDTO> | null = null;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  loadAccount(): Observable<AccountDTO> {
    if (this.accountLoaded && this.accountSubject.value) {
      return of(this.accountSubject.value);
    }

    if (this.inFlightAccount$) {
      return this.inFlightAccount$;
    }

    this.inFlightAccount$ = this.accountApi.getAccount().pipe(
      tap((account) => {
        this.accountSubject.next(account);

        const roles = this.normalizeRoles(account.authorities ?? []);
        this.availableRolesSubject.next(roles);

        const selectedRole = this.determineDefaultRole(roles);
        this.selectedRoleSubject.next(selectedRole);
        this.persistSelectedRole(selectedRole);

        this.accountLoaded = true;
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => {
        this.inFlightAccount$ = null;
      }),
      shareReplay(1),
    );

    return this.inFlightAccount$;
  }

  setSelectedRole(role: string | null): void {
    const normalizedRole = this.normalizeRole(role);
    if (!normalizedRole) {
      return;
    }

    if (!this.availableRolesSubject.value.includes(normalizedRole)) {
      return;
    }

    this.selectedRoleSubject.next(normalizedRole);
    this.persistSelectedRole(normalizedRole);
  }

  switchRole(role: string): boolean {
    const normalizedRole = this.normalizeRole(role);
    if (!normalizedRole) {
      return false;
    }

    if (!this.availableRolesSubject.value.includes(normalizedRole)) {
      return false;
    }

    this.selectedRoleSubject.next(normalizedRole);
    this.persistSelectedRole(normalizedRole);
    return true;
  }

  switchRoleAndNavigate(role: string): Promise<boolean> {
    const normalizedRole = this.normalizeRole(role);
    if (!normalizedRole) {
      return Promise.resolve(false);
    }

    const switched = this.switchRole(normalizedRole);
    if (!switched) {
      return Promise.resolve(false);
    }

    return this.router.navigateByUrl(this.dashboardRouteForRole(normalizedRole), { replaceUrl: true });
  }

  isRole(role: string): boolean {
    const normalized = this.normalizeRole(role);
    return !!normalized && this.selectedRoleSubject.value === normalized;
  }

  dashboardRouteForRole(role: string | null): string {
    return this.isAdmin(this.normalizeRole(role)) ? '/user/dashboard-admin' : '/user/dashboard';
  }

  getSelectedRoleValue(): string | null {
    return this.selectedRoleSubject.value;
  }

  private isAdmin(role: string | null): boolean {
    const normalized = (role ?? '').toUpperCase();
    return normalized === 'ROLE_ADMIN' || normalized === 'PLATFORM_ADMIN';
  }

  private normalizeRoles(authorities: string[]): string[] {
    return (authorities ?? [])
      .map((role) => this.normalizeRole(role))
      .filter((role): role is string => !!role);
  }

  private normalizeRole(role: string | null | undefined): string | null {
    const normalized = (role ?? '').toString().trim().toUpperCase();
    if (!normalized) {
      return null;
    }

    if (normalized === 'ENTERPRISE_ADMIN') {
      return 'ROLE_ENTERPRISE_ADMIN';
    }

    if (normalized === 'ENTERPRISE_EMPLOYEE') {
      return 'ROLE_ENTERPRISE_EMPLOYEE';
    }

    return normalized;
  }

  private determineDefaultRole(roles: string[]): string | null {
    const storedRole = this.readStoredRole();
    if (storedRole && roles.includes(storedRole)) {
      return storedRole;
    }

    if (roles.includes('ROLE_ADMIN') && roles.includes('ROLE_USER')) {
      return 'ROLE_USER';
    }

    const priority = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_ENTERPRISE_ADMIN', 'ROLE_ENTERPRISE_EMPLOYEE'];
    const prioritized = priority.find((role) => roles.includes(role));
    if (prioritized) {
      return prioritized;
    }

    return roles[0] ?? null;
  }

  private persistSelectedRole(role: string | null): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!role) {
      localStorage.removeItem(this.selectedRoleStorageKey);
      return;
    }

    localStorage.setItem(this.selectedRoleStorageKey, role);
  }

  private readStoredRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.normalizeRole(localStorage.getItem(this.selectedRoleStorageKey));
  }
}
