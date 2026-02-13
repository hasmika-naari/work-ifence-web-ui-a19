import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AccessFacadeService } from '../facades/access-facade.service';

@Injectable({ providedIn: 'root' })
export class ActiveProfileGuard implements CanActivate {
  constructor(private accessFacade: AccessFacadeService, private router: Router) {}

  canActivate(route: any): boolean | UrlTree {
    const me = this.accessFacade.accessMeSignal();
    const activeProfileKey = me?.activeProfileKey;
    const url = route.url.map((segment: any) => segment.path).join('/');

    // Admin routes
    if (url.startsWith('user/dashboard-admin') || url.startsWith('user/admin')) {
      if (activeProfileKey !== 'ADMIN') {
        // Redirect to correct dashboard
        return this.redirectToProfile(me, 'ADMIN');
      }
    }
    // Personal routes
    else if (url.startsWith('user') && !url.startsWith('user/dashboard-admin') && !url.startsWith('user/admin')) {
      if (activeProfileKey !== 'USER') {
        return this.redirectToProfile(me, 'USER');
      }
    }
    // Add more profile types as needed
    return true;
  }

  private redirectToProfile(me: any, requiredKey: string): UrlTree {
    // Find correct profile and route
    const profiles = me?.profiles || [];
    const profile = profiles.find((p: any) => p.key === requiredKey);
    if (profile && profile.defaultRoute) {
      return this.router.parseUrl(profile.defaultRoute);
    }
    // Fallback: redirect to root or show switch dialog
    return this.router.parseUrl('/');
  }
}
