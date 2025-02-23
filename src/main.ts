import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

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
  bootstrapApplication(AppComponent, {
    ...appConfig,  // Spread appConfig
    providers: [
      ...appConfig.providers!, // Ensure existing providers are included
      typeof window !== 'undefined' ? provideAnimations() : provideNoopAnimations()
    ]
  })
    .catch((err) => console.error(err));