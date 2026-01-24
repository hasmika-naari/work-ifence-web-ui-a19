import { Injectable, inject } from '@angular/core';
import { WorkIfenceDataService } from 'src/app/services/work-ifence-data.service';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';

@Injectable({ providedIn: 'root' })
export class ResumePortalApiService {
  private dataService = inject(WorkIfenceDataService);

  async getMyResumes(): Promise<ResumeListDataItem[]> {
    // Current app already has resume fetching logic elsewhere; for the portal we use
    // the existing demo-backed method as a safe fallback.
    return await this.dataService.getResumesByUserName();
  }
}
