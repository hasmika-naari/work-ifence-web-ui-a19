import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { AccessApiService } from 'src/app/services/access-api.service';
import { NavMenuService } from 'src/app/services/nav-menu.service';
import { ProfileContextStorageService } from 'src/app/services/profile-context-storage.service';
import type { AccessMeDto, AvailableProfileDto } from 'src/app/models/access-me.model';
import type { NavApiResponse, NavApiSection } from 'src/app/core/nav/nav-api.model';

@Injectable({ providedIn: 'root' })
export class AccessContextStore {
  private readonly accessMeSubject = new BehaviorSubject<AccessMeDto | null>(null);
  readonly accessMe$ = this.accessMeSubject.asObservable();

  private readonly activeProfileKeySubject = new BehaviorSubject<string>('');
  readonly activeProfileKey$ = this.activeProfileKeySubject.asObservable();

  private readonly modeSubject = new BehaviorSubject<string>('');
  readonly mode$ = this.modeSubject.asObservable();

  private readonly homeRouteSubject = new BehaviorSubject<string>('');
  readonly homeRoute$ = this.homeRouteSubject.asObservable();

  private readonly entitlementsMeSubject = new BehaviorSubject<any | null>(null);
  readonly entitlementsMe$ = this.entitlementsMeSubject.asObservable();

  private readonly navMenuSectionsSubject = new BehaviorSubject<NavApiSection[]>([]);
  readonly navMenuSections$ = this.navMenuSectionsSubject.asObservable();

  private initialized = false;
  private inFlightInit$: Observable<void> | null = null;
  private inFlightRefresh$: Observable<void> | null = null;

  get activeProfileKey(): string {
    return this.activeProfileKeySubject.value;
  }

  get mode(): string {
    return this.modeSubject.value;
  }

  get homeRoute(): string {
    return this.homeRouteSubject.value;
  }

  get navMenuSections(): NavApiSection[] {
    return this.navMenuSectionsSubject.value;
  }

  get entitlementsMe(): any | null {
    return this.entitlementsMeSubject.value;
  }

  constructor(
    private readonly accessApi: AccessApiService,
    private readonly http: HttpClient,
    private readonly navMenuService: NavMenuService,
    private readonly profileContextStorage: ProfileContextStorageService,
  ) {}

  init(): Observable<void> {
    if (this.initialized) {
      return of(void 0);
    }

    if (this.inFlightInit$) {
      return this.inFlightInit$;
    }

    this.inFlightInit$ = this.runLoadSequence().pipe(
      tap(() => {
        this.initialized = true;
      }),
      finalize(() => {
        this.inFlightInit$ = null;
      }),
      shareReplay(1),
    );

    return this.inFlightInit$;
  }

  refreshAfterProfileSwitch(): Observable<void> {
    if (this.inFlightRefresh$) {
      return this.inFlightRefresh$;
    }

    this.inFlightRefresh$ = this.runLoadSequence().pipe(
      tap(() => {
        this.initialized = true;
      }),
      finalize(() => {
        this.inFlightRefresh$ = null;
      }),
      shareReplay(1),
    );

    return this.inFlightRefresh$;
  }

  private runLoadSequence(): Observable<void> {
    return this.accessApi.getAccessMe().pipe(
      tap((accessMe) => {
        this.setAccessMeState(accessMe);
      }),
      switchMap(() => this.http.get<any>('/api/entitlements/me')),
      tap((entitlementsMe) => {
        this.entitlementsMeSubject.next(entitlementsMe);
      }),
      switchMap(() => this.navMenuService.loadMenu()),
      tap((navMenu) => {
        this.setNavMenuSections(navMenu);
      }),
      map(() => void 0),
    );
  }

  private setAccessMeState(accessMe: AccessMeDto): void {
    this.accessMeSubject.next(accessMe ?? null);
    this.profileContextStorage.syncFromAccessMe(accessMe ?? null);

    const activeProfileKey = (accessMe?.activeProfileKey ?? '').toString().trim().toUpperCase();
    const mode = (accessMe?.mode ?? '').toString().trim().toUpperCase();
    const homeRoute = this.resolveHomeRoute(accessMe, activeProfileKey);

    this.activeProfileKeySubject.next(activeProfileKey);
    this.modeSubject.next(mode);
    this.homeRouteSubject.next(homeRoute);
  }

  private setNavMenuSections(navMenu: NavApiResponse | null | undefined): void {
    this.navMenuSectionsSubject.next(Array.isArray(navMenu?.sections) ? navMenu.sections : []);
  }

  private resolveHomeRoute(accessMe: AccessMeDto | null | undefined, activeProfileKey: string): string {
    const availableProfiles = (accessMe?.availableProfiles ?? []) as AvailableProfileDto[];
    const normalizedActiveProfileKey = (activeProfileKey ?? '').toString().trim().toUpperCase();

    const match = availableProfiles.find(
      (profile) => (profile?.key ?? '').toString().trim().toUpperCase() === normalizedActiveProfileKey,
    );

    return (match?.homeRoute ?? '').toString().trim();
  }
}
