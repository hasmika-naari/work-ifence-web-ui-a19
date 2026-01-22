import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import 'zone.js/node';

global['window'] = global['window'] || {};
global['document'] = global['document'] || {
  createElement: () => ({})
};


const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, {
  ...config,
  providers: [
    provideZoneChangeDetection(),typeof window !== 'undefined' ? provideAnimations() : provideNoopAnimations()
  ]
}, context);

export default bootstrap;