import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';


import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, DetachedRouteHandle, PreloadAllModules, RouteReuseStrategy, provideRouter, 
        withComponentInputBinding, 
        withInMemoryScrolling, withPreloading, withRouterConfig, 
        withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HttpRequestInterceptor, httpInterceptorProviders } from './services/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';


/* eslint-disable no-console */
console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);

export class AppRouteReuseStrategy implements BaseRouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    throw new Error('Method not implemented.');
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.log('Check For Shoudl Reuse Route -- ' + future.routeConfig?.path + '====' + curr.routeConfig?.path + "---" + future.data['reuseComponent']) ;
    return future.data['reuseComponent'];
  }
}


export const appConfig: ApplicationConfig = {
  providers: [ 
    {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy},
    
    provideZoneChangeDetection({ eventCoalescing: true }), 
    providePrimeNG({
        theme: {
            preset: Material
        }
    }),
    provideHttpClient(
    withFetch(),
    withInterceptorsFromDi()),
    {
      provide:HTTP_INTERCEPTORS,
      useClass:HttpRequestInterceptor,
      multi:true
    },
  importProvidersFrom([BrowserModule, BrowserAnimationsModule, MatNativeDateModule,
  ]),
  provideRouter(routes,
    withComponentInputBinding(),
    withRouterConfig({
      onSameUrlNavigation: 'reload',
    }),
    
    withViewTransitions(),
    withPreloading(PreloadAllModules),
    withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    ),
    {
      provide: LOADING_BAR_CONFIG,
      useValue: {
        latencyThreshold: 100, // Delay before showing the bar in ms
        color: '#007bff',      // Loading bar color
        height: '4px',         // Height of the loading bar
      },
    },
  provideClientHydration(
    withHttpTransferCacheOptions({
      includePostRequests: false
    })
  ),
   provideAnimations(), provideAnimationsAsync()]
};












