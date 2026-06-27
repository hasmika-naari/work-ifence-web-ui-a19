import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResumeShareApiService } from '../services/resume-share-api.service';
import {
  RESUME_VISIBILITIES,
  RESUME_VISIBILITY_LABELS,
  ResumeVisibility,
  ShareLinkResponse,
} from '../models/resume-share.model';
import { EntitlementService } from 'src/app/services/entitlement.service';
import { ENTITLEMENT_KEYS } from 'src/app/entitlements/entitlement-keys';

/**
 * R1-E1 visibility + revocable-share panel for the résumé editor (S1.2 / S1.3).
 * Visibility is always editable; the share-link section is gated on the RESUME_SHARE
 * entitlement (defense-in-depth — the backend enforces it authoritatively too).
 *
 * Self-contained so it can drop into the builder shell without touching the large editor form.
 */
@Component({
  selector: 'app-resume-visibility-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="vs" data-testid="visibility-share">
      <div class="vs-row">
        <label class="vs-label" for="vs-visibility">Visibility</label>
        <select
          id="vs-visibility"
          class="vs-select"
          data-testid="visibility-select"
          [ngModel]="visibility()"
          (ngModelChange)="onVisibilityChange($event)"
          [disabled]="busy()"
        >
          <option *ngFor="let v of visibilities" [value]="v">{{ labels[v] }}</option>
        </select>
      </div>

      <div class="vs-share" *ngIf="canShare(); else shareLocked">
        <ng-container *ngIf="shareLink() as link; else noLink">
          <label class="vs-label">Share link</label>
          <div class="vs-row">
            <input class="vs-link" data-testid="share-url" [value]="link.url" readonly (focus)="selectAll($event)" />
            <button type="button" class="vs-btn" data-testid="copy-share" (click)="copy(link.url)">Copy</button>
            <button type="button" class="vs-btn vs-danger" data-testid="revoke-share" [disabled]="busy()" (click)="revoke()">
              Revoke
            </button>
          </div>
          <p class="vs-hint">Anyone with this link can view a read-only copy until you revoke it.</p>
        </ng-container>
        <ng-template #noLink>
          <button type="button" class="vs-btn vs-primary" data-testid="create-share" [disabled]="busy()" (click)="createLink()">
            Create share link
          </button>
        </ng-template>
      </div>

      <ng-template #shareLocked>
        <p class="vs-hint vs-locked" data-testid="share-locked">Sharing is available on a higher plan.</p>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .vs { border: 1px solid #e6e6e6; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
      .vs-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .vs-label { font-weight: 600; min-width: 90px; color: #333; }
      .vs-select { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; min-width: 240px; }
      .vs-link { flex: 1 1 260px; padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; font-family: monospace; font-size: 0.85rem; }
      .vs-btn { padding: 6px 12px; border: 1px solid #ccc; border-radius: 6px; background: #f7f7f7; cursor: pointer; }
      .vs-btn:disabled { opacity: 0.6; cursor: default; }
      .vs-primary { background: #1565c0; color: #fff; border-color: #1565c0; }
      .vs-danger { color: #c62828; border-color: #e0b4b4; }
      .vs-hint { margin: 0; color: #777; font-size: 0.82rem; }
      .vs-locked { font-style: italic; }
    `,
  ],
})
export class ResumeVisibilityShareComponent implements OnInit {
  @Input({ required: true }) resumeId!: number | string;

  private readonly api = inject(ResumeShareApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly entitlements = inject(EntitlementService);

  readonly visibilities = RESUME_VISIBILITIES;
  readonly labels = RESUME_VISIBILITY_LABELS;

  readonly visibility = signal<ResumeVisibility>('PRIVATE');
  readonly shareLink = signal<ShareLinkResponse | null>(null);
  readonly busy = signal(false);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    const id = this.numericId();
    if (id == null) return;
    this.api.getResume(id).subscribe({
      next: (r) => {
        if (r?.visibility) this.visibility.set(r.visibility);
      },
      error: () => {
        /* non-fatal: leave default visibility */
      },
    });
  }

  canShare(): boolean {
    return this.entitlements.canAccess(ENTITLEMENT_KEYS.RESUME_SHARE);
  }

  onVisibilityChange(next: ResumeVisibility): void {
    const id = this.numericId();
    if (id == null || this.busy()) return;
    const previous = this.visibility();
    this.visibility.set(next);
    this.busy.set(true);
    this.api.setVisibility(id, next).subscribe({
      next: () => {
        this.busy.set(false);
        this.toast(`Visibility set to ${this.labels[next]}`);
      },
      error: () => {
        this.visibility.set(previous); // roll back on failure (fail closed)
        this.busy.set(false);
        this.toast('Could not update visibility');
      },
    });
  }

  createLink(): void {
    const id = this.numericId();
    if (id == null || this.busy()) return;
    this.busy.set(true);
    this.api.createShareLink(id).subscribe({
      next: (link) => {
        this.shareLink.set(link);
        this.busy.set(false);
        this.toast('Share link created');
      },
      error: () => {
        this.busy.set(false);
        this.toast('Could not create share link');
      },
    });
  }

  revoke(): void {
    const id = this.numericId();
    const link = this.shareLink();
    if (id == null || !link || this.busy()) return;
    this.busy.set(true);
    this.api.revokeShareLink(id, link.token).subscribe({
      next: () => {
        this.shareLink.set(null);
        this.busy.set(false);
        this.toast('Share link revoked');
      },
      error: () => {
        this.busy.set(false);
        this.toast('Could not revoke share link');
      },
    });
  }

  copy(url: string): void {
    if (isPlatformBrowser(this.platformId) && navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => this.toast('Link copied'),
        () => this.toast('Copy failed — select and copy manually')
      );
    }
  }

  selectAll(event: FocusEvent): void {
    (event.target as HTMLInputElement)?.select();
  }

  private numericId(): number | null {
    const n = Number(this.resumeId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  private toast(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 2500 });
  }
}
