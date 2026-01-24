import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PortalTemplate, ResumePortalStore } from '../store/resume-portal.store';
import { PlanGateService } from '../services/plan-gate.service';

export type TemplatePreviewDialogData = {
  template: PortalTemplate;
};

@Component({
  selector: 'app-template-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="tpd-shell">
      <button class="tpd-close" type="button" aria-label="Close" (click)="dialogRef.close()">
        <mat-icon aria-hidden="true">close</mat-icon>
      </button>

      <div class="tpd-grid">
        <div class="tpd-preview">
          <img [src]="data.template.previewImageUrl || ''" [alt]="data.template.name" />
        </div>

        <div class="tpd-info">
          <h2 class="tpd-title">{{ data.template.name | uppercase }}</h2>
          <div class="tpd-rule"></div>

          <p class="tpd-desc">
            Each template has been crafted with care to make designing your resume an absolute breeze for you.
          </p>

          <ul class="tpd-list">
            <li>A4 / US-Letter Size</li>
            <li>Editable Text</li>
            <li>Fully customizable</li>
            <li>Print ready format</li>
            <li>Online resume with shareable link</li>
          </ul>

          <div *ngIf="requiresUpgrade" class="tpd-upgrade-note" role="note">
            <mat-icon aria-hidden="true">workspace_premium</mat-icon>
            Premium template — upgrade your account to use this.
          </div>

          <div class="tpd-actions">
            <button
              mat-flat-button
              color="primary"
              class="tpd-cta"
              type="button"
              (click)="useTemplate()">
              {{ requiresUpgrade ? 'Upgrade account' : 'Use this template' }}
            </button>

            <div *ngIf="data.template.isPremium" class="tpd-premium">
              <mat-icon aria-hidden="true">workspace_premium</mat-icon>
              Premium
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .tpd-shell {
        position: relative;
        background: #fff;
        border-radius: 14px;
        overflow: hidden;
      }

      .tpd-close {
        position: absolute;
        top: 10px;
        right: 10px;
        border: 0;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        cursor: pointer;
        z-index: 5;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      }

      .tpd-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
        min-height: 620px;
      }

      .tpd-preview {
        background: #f3f5f7;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }

      .tpd-preview img {
        width: 100%;
        height: 100%;
        max-height: 660px;
        object-fit: contain;
        border-radius: 10px;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }

      .tpd-info {
        padding: 34px 34px 28px;
        display: flex;
        flex-direction: column;
      }

      .tpd-title {
        margin: 0 0 12px;
        font-size: 34px;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: rgba(0, 0, 0, 0.74);
      }

      .tpd-rule {
        height: 1px;
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
        margin-bottom: 16px;
      }

      .tpd-desc {
        margin: 0 0 18px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.5;
        font-weight: 500;
        max-width: 520px;
      }

      .tpd-list {
        margin: 0;
        padding-left: 18px;
        color: rgba(0, 0, 0, 0.68);
        line-height: 1.85;
        font-weight: 500;
      }

      .tpd-actions {
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 16px;
        padding-top: 20px;
      }

      .tpd-cta {
        border-radius: 12px;
        padding: 10px 18px;
        min-width: 170px;
      }

      .tpd-premium {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.6);
      }

      .tpd-upgrade-note {
        margin-top: 16px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 204, 0, 0.12);
        border: 1px solid rgba(0, 0, 0, 0.08);
        color: rgba(0, 0, 0, 0.68);
        font-weight: 700;
        max-width: 520px;
      }
      .tpd-upgrade-note mat-icon { font-size: 18px; width: 18px; height: 18px; }

      @media (max-width: 960px) {
        .tpd-grid { grid-template-columns: 1fr; }
        .tpd-info { padding: 22px 18px 18px; }
        .tpd-title { font-size: 28px; }
      }
    `,
  ],
})
export class TemplatePreviewDialogComponent {
  private router: Router;

  constructor(
    public dialogRef: MatDialogRef<TemplatePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TemplatePreviewDialogData,
    private store: ResumePortalStore,
    private planGate: PlanGateService,
    router: Router
  ) {
    this.router = router;
  }

  get requiresUpgrade(): boolean {
    return Boolean(this.data.template.isPremium) && this.planGate.isFree();
  }

  useTemplate(): void {
    this.dialogRef.close();

    // If this is a premium template and the user is on a free plan,
    // prompt upgrade immediately (do not navigate to the builder).
    if (this.requiresUpgrade) {
      void this.router.navigateByUrl('/pricing');
      return;
    }

    this.store.createResumeDefault();
  }
}
