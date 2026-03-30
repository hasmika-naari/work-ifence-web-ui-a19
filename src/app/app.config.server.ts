import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SsrHttpBlockInterceptor } from './ssr/ssr-http-block.interceptor';

// provideHttpClient is intentionally NOT repeated here — it is already set up
// (with withInterceptorsFromDi) in appConfig.  Calling it a second time was
// creating a circular-dependency cycle on HTTP_INTERCEPTORS at SSR boot time.
// SsrHttpBlockInterceptor is registered below as a multi-provider so it is
// automatically included in the merged interceptor chain.

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideNoopAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SsrHttpBlockInterceptor,
      multi: true
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
