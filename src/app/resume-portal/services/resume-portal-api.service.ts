import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ResumeService } from 'src/app/services/resume.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';

@Injectable({ providedIn: 'root' })
export class ResumePortalApiService {
  private resumeService = inject(ResumeService);
  private userStore = inject(UserStoreService);

  async getMyResumes(): Promise<ResumeListDataItem[]> {
    const ownerId = (this.userStore.state().account?.id ?? '').toString().trim();

    if (!this.userStore.state().isUserLoggedIn || !ownerId) {
      return [];
    }

    return await firstValueFrom(this.resumeService.getResumeListByOwnerId(ownerId));
  }
}
