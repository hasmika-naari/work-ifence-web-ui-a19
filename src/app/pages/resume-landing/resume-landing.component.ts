import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import { ResumePortalStore, type PortalTemplate } from 'src/app/resume-portal/store/resume-portal.store';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { ResumeTemplateSelectionService } from 'src/app/services/resume-template-selection.service';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';

@Component({
  selector: 'app-resume-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatSnackBarModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent,
  ],
  templateUrl: './resume-landing.component.html',
  styleUrl: './resume-landing.component.scss',
})
export class ResumeLandingComponent {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly portalStore = inject(ResumePortalStore);
  private readonly remoteConfig = inject(RemoteConfigFacadeService);
  private readonly access = inject(AccessFacadeService);
  private readonly selection = inject(ResumeTemplateSelectionService);

  readonly templates = this.portalStore.templates;
  readonly isLoggedIn = computed(() => this.access.isLoggedIn());

  startResume(): void {
    void this.router.navigateByUrl('/resume-manager-intro');
  }

  async browseTemplates(): Promise<void> {
    if (!this.remoteConfig.isFlagEnabled('RESUME_PORTAL')) {
      this.showMessage('Resume templates are temporarily unavailable. Starting Resume Manager instead.');
      void this.router.navigateByUrl('/resume-manager-intro');
      return;
    }

    const ok = await this.router.navigateByUrl('/resume-portal/templates');
    if (!ok) {
      this.showMessage('Resume templates are currently unavailable. Starting Resume Manager instead.');
      void this.router.navigateByUrl('/resume-manager-intro');
    }
  }

  selectTemplate(tpl: PortalTemplate): void {
    const selection = this.toResumeTemplate(tpl);
    this.selection.setSelection(selection);

    const targetUrl = `/user/resumes/resume?templateId=${encodeURIComponent(String(tpl.id))}`;

    if (this.isLoggedIn()) {
      void this.router.navigateByUrl(targetUrl);
      return;
    }

    void this.router.navigate(['/authentication'], {
      queryParams: { returnUrl: targetUrl },
    });
  }

  private toResumeTemplate(tpl: PortalTemplate): ResumeTemplate {
    return {
      id: tpl.id,
      name: tpl.name,
      companyName: '',
      template_name: `TEMPLATE_${tpl.id}`,
      imgPath: tpl.previewImageUrl ?? '',
    };
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3200 });
  }
}
