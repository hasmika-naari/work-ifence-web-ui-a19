import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Resume } from 'src/app/services/resume.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ResumePortalApiService } from '../services/resume-portal-api.service';
import { ResumeForm3Component } from 'src/app/pages/resume-form3/resume-form3.component';

@Component({
  selector: 'app-resume-builder-shell',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, ResumeForm3Component],
  template: `
    @if (!ready()) {
      <div class="loading">
        <mat-spinner diameter="44" strokeWidth="4"></mat-spinner>
        <div class="text">Loading resume…</div>
      </div>
    } @else {
      <app-resume-form3></app-resume-form3>
    }
  `,
  styles: [
    `
      .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 16px; gap: 12px; }
      .text { color: rgba(0,0,0,.65); font-weight: 600; }
    `,
  ],
})
export class ResumeBuilderShellComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ResumePortalApiService);
  private userStore = inject(UserStoreService);

  readonly ready = signal(false);
  readonly resumeId = computed(() => this.route.snapshot.paramMap.get('resumeId') ?? '');

  async ngOnInit(): Promise<void> {
    const id = this.resumeId();

    // Ensure we have resumes loaded (best-effort).
    if ((this.userStore.state().resumeListItems?.length ?? 0) === 0) {
      try {
        const resumes = await this.api.getMyResumes();
        this.userStore.setResumeDataListItems(resumes);
        this.userStore.setFilteredResumes(resumes);
      } catch {
        // ignore; fallback below
      }
    }

    const item = (this.userStore.state().resumeListItems ?? []).find(r => r.id === id);
    if (item) {
      this.userStore.updateSelectedResumeListItem(item);
      this.userStore.updateSidebar(true);

      let resumeForm: Resume = new Resume();
      try {
        if (item.resumeJson) {
          resumeForm = JSON.parse(item.resumeJson) as Resume;
        }
      } catch {
        resumeForm = new Resume();
      }

      this.userStore.setResumeForm(resumeForm);
      const templateName = resumeForm?.template_details?.template_name;
      if (templateName) {
        this.userStore.setFlagOnTemplateSelected(templateName);
      }
    }

    this.ready.set(true);
  }
}
