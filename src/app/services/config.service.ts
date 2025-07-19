// Example: config.service.ts or inside any component/service
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly apiBaseUrl = environment.backend;
  readonly appName = environment.production ? 'Workifence Production' : 'Workifence Development';
  readonly country = environment.country;

  logConfig(): void {
    console.log('Base URL:', this.apiBaseUrl);
    console.log('App Name:', this.appName);
    console.log('Country:', this.country);
  }
}
