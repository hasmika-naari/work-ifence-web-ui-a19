import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AccessFacadeService } from '../facades/access-facade.service';

@Injectable({ providedIn: 'root' })
export class ActiveProfileGuard implements CanActivate {
  constructor(private accessFacade: AccessFacadeService, private router: Router) {}

  canActivate(route: any): boolean | UrlTree {
    const me = this.accessFacade.accessMeSignal();
    const activeProfileKey = (me?.activeProfileKey ?? '').toString();
    const url = route.url.map((segment: any) => segment.path).join('/');

    // If we don't have a profile key yet, don't block routing.
    if (!activeProfileKey) return true;

    // Admin routes
    if (url.startsWith('user/dashboard-admin') || url.startsWith('user/admin')) {
      if (activeProfileKey !== 'ROLE_ADMIN') {
        return this.redirectToActiveProfileHome(me, activeProfileKey);
      }
    }
    // Personal routes
    else if (url.startsWith('user') && !url.startsWith('user/dashboard-admin') && !url.startsWith('user/admin')) {
      if (activeProfileKey !== 'ROLE_USER') {
        return this.redirectToActiveProfileHome(me, activeProfileKey);
      }
    }
    // Add more profile types as needed
    return true;
  }

  private redirectToActiveProfileHome(me: any, profileKey: string): UrlTree {
    const profiles = (me?.availableProfiles ?? []) as Array<any>;
    const match = profiles.find((p: any) => (p?.key ?? '').toString() === profileKey);
    const homeRoute = (match?.homeRoute ?? '').toString().trim();
    if (homeRoute) return this.router.parseUrl(homeRoute);

    // Fallback based on key
    if (profileKey === 'ROLE_ADMIN') return this.router.parseUrl('/user/dashboard-admin');
    return this.router.parseUrl('/user/dashboard');
  }
}
