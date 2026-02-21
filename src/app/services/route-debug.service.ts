import { Injectable, inject } from '@angular/core';
import {
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RouteDebugService {
  private readonly router = inject(Router);

  constructor() {
    if (environment.production) {
      return;
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.debug('[ROUTE_DEBUG] NavigationStart', {
          id: event.id,
          url: event.url,
          navigationTrigger: event.navigationTrigger,
        });
        return;
      }

      if (event instanceof GuardsCheckStart) {
        console.debug('[ROUTE_DEBUG] GuardsCheckStart', {
          id: event.id,
          url: event.url,
        });
        return;
      }

      if (event instanceof GuardsCheckEnd) {
        console.debug('[ROUTE_DEBUG] GuardsCheckEnd', {
          id: event.id,
          url: event.url,
          shouldActivate: event.shouldActivate,
        });
        return;
      }

      if (event instanceof NavigationCancel) {
        console.warn('[ROUTE_DEBUG] NavigationCancel', {
          id: event.id,
          url: event.url,
          reason: event.reason,
        });
        return;
      }

      if (event instanceof NavigationError) {
        console.error('[ROUTE_DEBUG] NavigationError', {
          id: event.id,
          url: event.url,
          error: event.error,
        });
        return;
      }

      if (event instanceof NavigationEnd) {
        console.debug('[ROUTE_DEBUG] NavigationEnd', {
          id: event.id,
          url: event.url,
          urlAfterRedirects: event.urlAfterRedirects,
        });
      }
    });
  }
}
