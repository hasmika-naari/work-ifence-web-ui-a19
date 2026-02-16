import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccessMeDto, AccessProfileContextDto, SwitchProfileResponseDto } from '../models/access-me.model';

@Injectable({ providedIn: 'root' })
export class AccessApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getAccessMe(): Observable<AccessMeDto> {
    return this.http.get<AccessMeDto>(`${this.getBaseUrl()}/api/access/me`);
  }

  getProfileContext(): Observable<AccessProfileContextDto> {
    return this.http.get<AccessProfileContextDto>(`${this.getBaseUrl()}/api/access/profile/context`);
  }

  /** Optional legacy context refresh hook (best-effort). */
  getAccount(): Observable<unknown> {
    return this.http.get<unknown>(`${this.getBaseUrl()}/api/account`);
  }

  switchProfile(profileKey: string): Observable<SwitchProfileResponseDto> {
    return this.http.post<SwitchProfileResponseDto>(`${this.getBaseUrl()}/api/access/profile/switch`, { profileKey });
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}
