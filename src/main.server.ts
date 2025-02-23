import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

global['window'] = global['window'] || {};
global['document'] = global['document'] || {
  createElement: () => ({})
};


const bootstrap = () => bootstrapApplication(AppComponent, {
  ...config,
  providers: [
    typeof window !== 'undefined' ? provideAnimations() : provideNoopAnimations()
  ]
});

export default bootstrap;