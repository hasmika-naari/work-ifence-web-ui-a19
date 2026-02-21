import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { NavbarResponseDTO, UserMenuPrefDTO } from './navbar.model';

@Injectable({ providedIn: 'root' })
export class NavbarApiService {
  private readonly prefsStorageKey = 'wifence-navbar.prefs';

  constructor(private readonly http: HttpClient) {}

  getMyNavbar(_activeRoleKey?: string): Observable<NavbarResponseDTO> {
    return this.http.get<NavbarResponseDTO>('/api/access/nav/menu');
  }

  getPrefs(): Observable<UserMenuPrefDTO[]> {
    return of(this.readPrefs());
  }

  updatePref(itemKey: string, hidden: boolean): Observable<void> {
    const normalizedItemKey = (itemKey ?? '').toString().trim();
    if (!normalizedItemKey) {
      return of(void 0);
    }

    const current = this.readPrefs();
    const withoutCurrent = current.filter((pref) => pref.itemKey !== normalizedItemKey);
    withoutCurrent.push({ itemKey: normalizedItemKey, isHidden: hidden === true });
    this.writePrefs(withoutCurrent);

    return of(void 0);
  }

  resetPrefs(): Observable<void> {
    this.writePrefs([]);
    return of(void 0);
  }

  private readPrefs(): UserMenuPrefDTO[] {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.prefsStorageKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((entry) => ({
          itemKey: (entry as { itemKey?: unknown }).itemKey?.toString?.().trim?.() ?? '',
          isHidden: (entry as { isHidden?: unknown }).isHidden === true,
        }))
        .filter((entry) => !!entry.itemKey);
    } catch {
      return [];
    }
  }

  private writePrefs(prefs: UserMenuPrefDTO[]): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.prefsStorageKey, JSON.stringify(prefs));
    } catch {
      // ignore storage failures
    }
  }
}
