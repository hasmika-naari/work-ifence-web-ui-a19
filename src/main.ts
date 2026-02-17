import 'zone.js';
import 'zone.js/plugins/task-tracking';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { validateEntitlementGuardRouteData } from './app/utils/route-validation';
import { environment } from './environments/environment';

// Ensure "global" is only defined on the server (SSR)
if (typeof global === 'undefined' && typeof window !== 'undefined') {
    (window as any).global = window;
  }
  
  // Ensure "document" is only mocked in SSR
  if (typeof document === 'undefined') {
    (global as any).document = {
      createElement: () => ({})
    };
  }

const originalWarn = console.warn;
console.warn = function(...args: any[]) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('')) {
    return;
  }
  originalWarn.apply(console, args);
};

// DEV-ONLY: validate routes early so misconfigurations fail fast during local development.
if (!environment.production) {
  validateEntitlementGuardRouteData(routes);
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));