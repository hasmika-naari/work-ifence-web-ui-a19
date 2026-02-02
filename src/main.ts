import 'zone.js';
import 'zone.js/plugins/task-tracking';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

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
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));