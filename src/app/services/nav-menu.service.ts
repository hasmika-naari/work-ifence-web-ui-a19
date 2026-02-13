import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NavApiService } from '../core/nav/nav-api.service';
import { NavApiResponse } from '../core/nav/nav-api.model';
import { NavStore } from '../core/nav/nav.store';

@Injectable({ providedIn: 'root' })
export class NavMenuService {
  constructor(
    private readonly navApi: NavApiService,
    private readonly navStore: NavStore
  ) {}

  /**
   * Loads the current user's (profile-dependent) menu from `/api/access/nav/menu`
   * and applies it to `NavStore` so the sidebar updates reactively.
   */
  loadMenu(): Observable<NavApiResponse> {
    return this.navApi.getMyNav().pipe(tap((resp) => this.navStore.applyBackendResponse(resp)));
  }
}
