import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import 'zone.js/node';

global['window'] = global['window'] || {};
global['document'] = global['document'] || {
  createElement: () => ({}),
  querySelectorAll: () => ([]),
  querySelector: () => null,
  documentElement: { clientHeight: 0 }
};


const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;