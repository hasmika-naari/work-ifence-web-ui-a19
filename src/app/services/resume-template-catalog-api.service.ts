import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { ResumeTemplateRecord } from 'src/app/models/resume-template.model';

@Injectable({ providedIn: 'root' })
export class ResumeTemplateCatalogApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getTemplates(): Observable<ResumeTemplateRecord[]> {
    const base = this.getBaseUrl();
    const primaryUrl = `${base}/api/public/resume-templates`;
    const fallbackUrl = `${base}/api/resume-templates`;

    return this.http.get<ResumeTemplateRecord[]>(primaryUrl).pipe(
      catchError(() => this.http.get<ResumeTemplateRecord[]>(fallbackUrl)),
      map((items) => (Array.isArray(items) ? items : []))
    );
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}
