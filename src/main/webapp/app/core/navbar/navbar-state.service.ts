import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NavbarResponseDTO } from './navbar.model';
import { NavbarRefreshReason, NavbarStoreService } from './navbar-store.service';

@Injectable({ providedIn: 'root' })
export class NavbarStateService {
  readonly navbar$: Observable<NavbarResponseDTO | null>;
  readonly refreshing$: Observable<boolean>;

  constructor(private readonly navbarStore: NavbarStoreService) {
    this.navbar$ = this.navbarStore.navbar$;
    this.refreshing$ = this.navbarStore.loading$;
  }

  initOnce(): void {
    this.navbarStore.initOnce();
  }

  refresh(): void {
    this.navbarStore.refresh();
  }

  refreshNavbar(reason: NavbarRefreshReason): void {
    this.navbarStore.refreshNavbar(reason);
  }

  clear(): void {
    this.navbarStore.clear();
  }
}
