import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

global['window'] = global['window'] || {};
global['document'] = global['document'] || {
  createElement: () => ({
    setAttribute: () => {},
    removeAttribute: () => {},
    style: {},
  }),
  querySelectorAll: () => ([]),
  querySelector: () => null,
  documentElement: { clientHeight: 0 }
};


const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;