import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { ResumeTemplateRecord, ResumeTemplateUpsert } from 'src/app/models/resume-template.model';

@Injectable({ providedIn: 'root' })
export class ResumeTemplateAdminApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  listTemplates(): Observable<ResumeTemplateRecord[]> {
    return this.http.get<ResumeTemplateRecord[]>(`${this.getBaseUrl()}/api/ext/admin/resume-templates`);
  }

  createTemplate(payload: ResumeTemplateUpsert): Observable<ResumeTemplateRecord> {
    return this.http.post<ResumeTemplateRecord>(`${this.getBaseUrl()}/api/ext/admin/resume-templates`, payload);
  }

  updateTemplate(id: string | number, payload: ResumeTemplateUpsert): Observable<ResumeTemplateRecord> {
    return this.http.put<ResumeTemplateRecord>(
      `${this.getBaseUrl()}/api/ext/admin/resume-templates/${encodeURIComponent(String(id))}`,
      payload
    );
  }

  patchTemplate(id: string | number, patch: Partial<ResumeTemplateUpsert>): Observable<ResumeTemplateRecord> {
    return this.http.patch<ResumeTemplateRecord>(
      `${this.getBaseUrl()}/api/ext/admin/resume-templates/${encodeURIComponent(String(id))}`,
      patch
    );
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}
