import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessMeDto } from './access-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  // Signal for active profile
  activeProfile = signal<string>('');

  // Available profiles
  availableProfiles = signal<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadProfiles();
  }

  private loadProfiles() {
    this.http.get<AccessMeDto>('/api/access/me').subscribe(res => {
      this.activeProfile.set(res.activeProfileKey);
      this.availableProfiles.set(res.profiles || []);
    });
  }

  switchProfile(profileKey: string, router?: any) {
    this.http.post('/api/access/switch-profile', { profileKey }).subscribe(() => {
      this.reloadProfilesAndNavigate(router);
    });
  }

  private reloadProfilesAndNavigate(router?: any) {
    this.http.get<AccessMeDto>('/api/access/me').subscribe(res => {
      this.activeProfile.set(res.activeProfileKey);
      this.availableProfiles.set(res.profiles || []);
      if (router && res.activeProfileKey && res.profiles) {
        const profile = res.profiles.find(p => p.key === res.activeProfileKey);
        if (profile && profile.defaultRoute) {
          router.navigateByUrl(profile.defaultRoute);
        }
      }
    });
    this.http.get('/api/entitlements/me').subscribe();
    this.http.get('/api/access/nav/menu').subscribe();
  }

  private reloadProfiles() {
    // Reload /access/me
    this.http.get<AccessMeDto>('/api/access/me').subscribe(res => {
      this.activeProfile.set(res.activeProfileKey);
      this.availableProfiles.set(res.profiles || []);
    });
    // Reload /entitlements/me
    this.http.get('/api/entitlements/me').subscribe();
    // Reload /access/nav/menu
    this.http.get('/api/access/nav/menu').subscribe();
  }
}
