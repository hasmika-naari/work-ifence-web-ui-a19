import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { ResumeTemplateCard } from 'src/app/models/resume-template-card.model';

@Injectable({ providedIn: 'root' })
export class ResumeTemplateApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  getPublicTemplates(): Observable<ResumeTemplateCard[]> {
    const base = this.getBaseUrl();
    const primaryUrl = `${base}/api/public/resume-templates`;
    const fallbackUrl = `${base}/api/resume-templates`;

    return this.http.get<any[]>(primaryUrl).pipe(
      catchError(() => this.http.get<any[]>(fallbackUrl)),
      map((items) => this.mapItems(items))
    );
  }

  getAvailableTemplates(): Observable<ResumeTemplateCard[]> {
    const base = this.getBaseUrl();
    const primaryUrl = `${base}/api/resume-templates/available`;
    const fallbackUrl = `${base}/api/resume-templates`;

    return this.http.get<any[]>(primaryUrl).pipe(
      catchError(() => this.http.get<any[]>(fallbackUrl)),
      map((items) => this.mapItems(items))
    );
  }

  private mapItems(items: any): ResumeTemplateCard[] {
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
        imageUrl: item?.templateDocUrl ?? '',
        category: item?.category ?? '',
        style: item?.style ?? '',
        tags,
        status: item?.status ?? '',
        templateJson: item?.templateJson ?? undefined,
      } as ResumeTemplateCard;
    });
  }

  private getBaseUrl(): string {
    const base = (environment.backend ?? '').replace(/\/$/, '');
    return isPlatformBrowser(this.platformId) ? '' : base;
  }
}
