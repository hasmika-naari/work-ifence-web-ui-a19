import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './auth.models';

const DEFAULT_LOGIN_ENDPOINT = '/api/authenticate';
const DEFAULT_E2E_LOGIN_ENDPOINT = '/api/mock/login';

function normalizeEndpoint(endpoint: string): string {
  const trimmed = endpoint.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function isE2EWindow(): boolean {
  return typeof window !== 'undefined' && (window as any).__E2E__ === true;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.getBaseUrl()}${this.getLoginEndpoint()}`;
    // Match existing backend contract used elsewhere: { username, password }
    return this.http.post<LoginResponse>(url, { username: email, password });
  }

  private getLoginEndpoint(): string {
    const configured = normalizeEndpoint(((environment as any).loginEndpoint ?? '') as string);
    if (configured) return configured;

    return isE2EWindow() ? DEFAULT_E2E_LOGIN_ENDPOINT : DEFAULT_LOGIN_ENDPOINT;
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}
