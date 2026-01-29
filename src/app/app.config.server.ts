import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';
import { SsrHttpBlockInterceptor } from './ssr/ssr-http-block.interceptor';

console.info('Server: Angular CDK version', CDK_VERSION.full);
console.info('Server: Angular Material version', MAT_VERSION.full);

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideNoopAnimations()
    ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SsrHttpBlockInterceptor,
      multi: true
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
