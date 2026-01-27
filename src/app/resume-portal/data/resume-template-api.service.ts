import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResumeTemplateDto } from './resume-template.dto';

@Injectable({ providedIn: 'root' })
export class ResumeTemplateApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  listPublic(): Observable<ResumeTemplateDto[]> {
    const base = this.getBaseUrl();
    const primaryUrl = `${base}/api/public/resume-templates`;
    const fallbackUrl = `${base}/api/resume-templates`;

    return this.http.get<any[]>(primaryUrl).pipe(
      catchError(() => this.http.get<any[]>(fallbackUrl)),
      map((items) => this.mapItems(items))
    );
  }

  listAvailable(): Observable<ResumeTemplateDto[]> {
    const base = this.getBaseUrl();
    const primaryUrl = `${base}/api/resume-templates/available`;
    const fallbackUrl = `${base}/api/resume-templates`;

    return this.http.get<any[]>(primaryUrl).pipe(
      catchError(() => this.http.get<any[]>(fallbackUrl)),
      map((items) => this.mapItems(items))
    );
  }

  listAll(): Observable<ResumeTemplateDto[]> {
    const base = this.getBaseUrl();
    const url = `${base}/api/resume-templates`;
    return this.http.get<any[]>(url).pipe(map((items) => this.mapItems(items)));
  }

  private mapItems(items: any): ResumeTemplateDto[] {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
      const rawTags = item?.tags;
      const tags = Array.isArray(rawTags)
        ? rawTags.filter(Boolean)
        : typeof rawTags === 'string'
          ? rawTags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [];

      return {
        id: item?.id ?? '',
        title: item?.title ?? '',
        templateKey: item?.templateKey ?? '',
        componentKey: item?.componentKey ?? '',
        version: item?.version ?? '1',
        accessLevel: item?.accessLevel ?? 'BASIC',
        sortOrder: Number.isFinite(Number(item?.sortOrder)) ? Number(item?.sortOrder) : undefined,
        isDefault: !!item?.isDefault,
        templateDocUrl: item?.templateDocUrl ?? '',
        configJson: item?.configJson ?? undefined,
        templateJson: item?.templateJson ?? undefined,
        tags,
        category: item?.category ?? '',
        style: item?.style ?? '',
        status: item?.status ?? 'ACTIVE',
      } as ResumeTemplateDto;
    });
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}
