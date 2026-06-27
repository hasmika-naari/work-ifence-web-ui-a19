import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ENTITLEMENT_KEYS } from '../../entitlements/entitlement-keys';
import { EntitlementService } from '../../services/entitlement.service';
import {
  AiResumeApiService,
  AiResumeJob,
  AiResumeMode,
} from '../../services/ai-resume-api.service';

type Tab = 'improve' | 'from-jd' | 'cover-letter' | 'from-upload' | 'draft';

@Component({
  selector: 'app-ai-resume-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="ai-panel" *ngIf="entitled; else upgradeBlock">
      <!-- Tab bar -->
      <div class="ai-tabs">
        <button *ngFor="let t of tabs" class="ai-tab" [class.active]="activeTab === t.id" (click)="selectTab(t.id)">
          <mat-icon>{{ t.icon }}</mat-icon> {{ t.label }}
        </button>
      </div>

      <!-- Improve -->
      <div class="ai-body" *ngIf="activeTab === 'improve'">
        <textarea [(ngModel)]="instructions" rows="3" placeholder="Instructions (e.g. emphasise leadership and cloud skills)…" class="ai-textarea"></textarea>
        <button class="ai-btn primary" (click)="runImprove()" [disabled]="busy">
          <mat-spinner *ngIf="busy && activeMode === 'IMPROVE'" diameter="16"></mat-spinner>
          Improve résumé
        </button>
      </div>

      <!-- From JD -->
      <div class="ai-body" *ngIf="activeTab === 'from-jd'">
        <textarea [(ngModel)]="jdText" rows="5" placeholder="Paste the job description here…" class="ai-textarea"></textarea>
        <button class="ai-btn primary" (click)="runFromJd()" [disabled]="busy">
          <mat-spinner *ngIf="busy && activeMode === 'FROM_JD'" diameter="16"></mat-spinner>
          Tailor to job
        </button>
      </div>

      <!-- Cover letter -->
      <div class="ai-body" *ngIf="activeTab === 'cover-letter'">
        <textarea [(ngModel)]="jdText" rows="5" placeholder="Paste the job description here…" class="ai-textarea"></textarea>
        <button class="ai-btn primary" (click)="runCoverLetter()" [disabled]="busy">
          <mat-spinner *ngIf="busy && activeMode === 'COVER_LETTER'" diameter="16"></mat-spinner>
          Generate cover letter
        </button>
      </div>

      <!-- From upload -->
      <div class="ai-body" *ngIf="activeTab === 'from-upload'">
        <input type="file" accept=".pdf,.doc,.docx" (change)="onFileChange($event)" class="ai-file-input" />
        <button class="ai-btn primary" (click)="runFromUpload()" [disabled]="busy || !uploadFile">
          <mat-spinner *ngIf="busy && activeMode === 'FROM_UPLOAD'" diameter="16"></mat-spinner>
          Parse &amp; import
        </button>
      </div>

      <!-- Draft -->
      <div class="ai-body" *ngIf="activeTab === 'draft'">
        <p class="ai-hint">Generate a fresh draft resume from your profile data.</p>
        <button class="ai-btn primary" (click)="runDraft()" [disabled]="busy">
          <mat-spinner *ngIf="busy && activeMode === 'DRAFT'" diameter="16"></mat-spinner>
          Generate draft
        </button>
      </div>

      <!-- Result / status -->
      <div class="ai-result" *ngIf="job">
        <div class="ai-status" [ngClass]="job.status.toLowerCase()">
          <mat-spinner *ngIf="job.status === 'QUEUED' || job.status === 'RUNNING'" diameter="14"></mat-spinner>
          {{ statusLabel(job.status) }}
          <span *ngIf="job.matchScore != null" class="score-badge">Match {{ job.matchScore }}%</span>
        </div>

        <div *ngIf="job.status === 'SUCCEEDED' && resultJson" class="ai-output">
          <pre class="result-pre">{{ resultJson }}</pre>
          <button class="ai-btn secondary" (click)="copyResult()">
            <mat-icon>content_copy</mat-icon> Copy to clipboard
          </button>
        </div>

        <div *ngIf="job.status === 'FAILED'" class="ai-error">
          {{ job.errorMessage || 'AI job failed. Please try again.' }}
        </div>
      </div>
    </div>

    <ng-template #upgradeBlock>
      <div class="ai-upgrade">
        <mat-icon>auto_awesome</mat-icon>
        <span>AI resume tools require a Pro plan.</span>
      </div>
    </ng-template>
  `,
  styles: [`
    .ai-panel { border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 12px; background: #fafafa; }
    .ai-tabs { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px; }
    .ai-tab { display: flex; align-items: center; gap: 4px; padding: 6px 12px; border: 1px solid #ccc; border-radius: 6px; background: white; cursor: pointer; font-size: 13px; }
    .ai-tab.active { background: #1a73e8; color: white; border-color: #1a73e8; }
    .ai-tab mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .ai-body { display: flex; flex-direction: column; gap: 8px; }
    .ai-textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; resize: vertical; }
    .ai-file-input { font-size: 13px; }
    .ai-hint { font-size: 13px; color: #666; margin: 0; }
    .ai-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; }
    .ai-btn.primary { background: #1a73e8; color: white; }
    .ai-btn.primary:disabled { opacity: 0.55; cursor: default; }
    .ai-btn.secondary { background: #f1f3f4; color: #333; }
    .ai-result { margin-top: 12px; }
    .ai-status { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; padding: 6px 0; }
    .ai-status.queued,.ai-status.running { color: #f57c00; }
    .ai-status.succeeded { color: #2e7d32; }
    .ai-status.failed { color: #c62828; }
    .score-badge { background: #e8f5e9; color: #2e7d32; border-radius: 12px; padding: 2px 8px; font-size: 12px; }
    .ai-output { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .result-pre { background: #f5f5f5; border-radius: 6px; padding: 12px; font-size: 12px; overflow: auto; max-height: 240px; white-space: pre-wrap; word-break: break-word; }
    .ai-error { color: #c62828; font-size: 13px; padding: 6px 0; }
    .ai-upgrade { display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px dashed #ccc; border-radius: 8px; color: #666; font-size: 13px; }
  `],
})
export class AiResumePanelComponent implements OnDestroy {
  @Input() resumeId?: number | string;

  entitled = false;
  activeTab: Tab = 'improve';
  busy = false;
  activeMode: AiResumeMode | null = null;
  job: AiResumeJob | null = null;
  resultJson: string | null = null;

  instructions = '';
  jdText = '';
  uploadFile: File | null = null;

  readonly tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'improve',      label: 'Improve',       icon: 'auto_fix_high' },
    { id: 'from-jd',     label: 'Tailor to JD',  icon: 'work_outline' },
    { id: 'cover-letter',label: 'Cover Letter',   icon: 'description' },
    { id: 'from-upload', label: 'From Upload',    icon: 'upload_file' },
    { id: 'draft',       label: 'Draft',          icon: 'edit_note' },
  ];

  private pollSub: Subscription | null = null;

  constructor(
    private readonly api: AiResumeApiService,
    private readonly entitlements: EntitlementService,
    private readonly snack: MatSnackBar,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.entitled = this.entitlements.canAccess(ENTITLEMENT_KEYS.RESUME_AI);
  }

  selectTab(tab: Tab): void {
    this.activeTab = tab;
    this.resetResult();
  }

  private resetResult(): void {
    this.job = null;
    this.resultJson = null;
  }

  runImprove(): void {
    const id = this.numericResumeId();
    this.submit(
      this.api.improve({ resumeId: id ?? undefined, instructions: this.instructions || undefined }),
      'IMPROVE'
    );
  }

  runFromJd(): void {
    const id = this.numericResumeId();
    this.submit(this.api.fromJd({ resumeId: id ?? undefined, jobDescription: this.jdText || undefined }), 'FROM_JD');
  }

  runCoverLetter(): void {
    const id = this.numericResumeId();
    this.submit(this.api.coverLetter({ resumeId: id ?? undefined, jobDescription: this.jdText || undefined }), 'COVER_LETTER');
  }

  runFromUpload(): void {
    if (!this.uploadFile) return;
    this.submit(this.api.fromUpload(this.uploadFile), 'FROM_UPLOAD');
  }

  runDraft(): void {
    const id = this.numericResumeId();
    this.submit(this.api.draft({ resumeId: id ?? undefined }), 'DRAFT');
  }

  onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.uploadFile = files && files.length > 0 ? files[0] : null;
  }

  copyResult(): void {
    if (!isPlatformBrowser(this.platformId) || !this.resultJson) return;
    navigator.clipboard.writeText(this.resultJson).then(
      () => this.snack.open('Copied to clipboard', '', { duration: 2000 }),
      () => this.snack.open('Copy failed', '', { duration: 2000 })
    );
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      QUEUED: 'Queued…', RUNNING: 'AI is working…', SUCCEEDED: 'Done', FAILED: 'Failed',
    };
    return map[status] ?? status;
  }

  private submit(trigger$: import('rxjs').Observable<AiResumeJob>, mode: AiResumeMode): void {
    this.busy = true;
    this.activeMode = mode;
    this.resetResult();
    this.pollSub?.unsubscribe();

    trigger$.subscribe({
      next: (job) => {
        this.job = job;
        if (job.status === 'SUCCEEDED' || job.status === 'FAILED') {
          this.onJobComplete(job);
          return;
        }
        this.pollSub = this.api.poll(job.id).subscribe({
          next: (updated) => { this.job = updated; },
          complete: () => { if (this.job) this.onJobComplete(this.job); },
          error: () => { this.busy = false; this.activeMode = null; },
        });
      },
      error: (err) => {
        this.busy = false;
        this.activeMode = null;
        this.snack.open(err?.error?.detail ?? 'AI request failed', 'Dismiss', { duration: 4000 });
      },
    });
  }

  private onJobComplete(job: AiResumeJob): void {
    this.busy = false;
    this.activeMode = null;
    if (job.status === 'SUCCEEDED' && job.resultJson) {
      try {
        this.resultJson = JSON.stringify(JSON.parse(job.resultJson), null, 2);
      } catch {
        this.resultJson = job.resultJson;
      }
    }
  }

  private numericResumeId(): number | null {
    const n = Number(this.resumeId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }
}
