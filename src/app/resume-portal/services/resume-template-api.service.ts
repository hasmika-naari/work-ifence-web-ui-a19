import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map } from 'rxjs';
import { AppConstantsService } from 'src/app/services/app-constants.service';

export interface ResumeTemplateCard {
  title: string;
  templateDocUrl: string;
  tags?: string[];
  category?: string;
  style?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class ResumeTemplateApiService {
  constructor(
    private http: HttpClient,
    private appConstants: AppConstantsService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  getTemplates(): Observable<ResumeTemplateCard[]> {
    let baseUrl = this.appConstants.BASE_API_URL;
    if (isPlatformBrowser(this.platformId)) {
      baseUrl = '';
    }
    const url = `${baseUrl}/api/resume-templates`;

    return this.http.get<any[]>(url).pipe(
      map(items =>
        (Array.isArray(items) ? items : []).map(item => ({
          title: item?.title ?? '',
          templateDocUrl: item?.templateDocUrl ?? '',
          tags: Array.isArray(item?.tags)
            ? item.tags
            : typeof item?.tags === 'string'
              ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
              : [],
          category: item?.category ?? '',
          style: item?.style ?? '',
          status: item?.status ?? '',
        }))
      )
    );
  }
}
