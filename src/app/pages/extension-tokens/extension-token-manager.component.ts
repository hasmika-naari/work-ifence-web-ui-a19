import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENTITLEMENT_KEYS } from '../../entitlements/entitlement-keys';
import { EntitlementService } from '../../services/entitlement.service';
import {
  ExtensionTokenApiService,
  ExtensionTokenSummary,
  IssuedExtensionToken,
} from '../../services/extension-token-api.service';

@Component({
  selector: 'app-extension-token-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, DatePipe],
  template: `
    <div class="etm-page" *ngIf="entitled; else upgradeBlock">
      <div class="etm-header">
        <h2>Browser Extension Tokens</h2>
        <p class="etm-desc">
          Issue a scoped token so the WorkIfence browser extension can capture job postings
          directly to your tracker. Revoke any token instantly from here.
        </p>
      </div>

      <!-- Issue new token -->
      <div class="etm-card issue-card">
        <h3>Issue new token</h3>
        <div class="issue-row">
          <input
            type="text"
            [(ngModel)]="newLabel"
            placeholder="Label (e.g. Work laptop Chrome)"
            class="etm-input"
            [disabled]="issuing"
          />
          <button class="etm-btn primary" (click)="issueToken()" [disabled]="issuing">
            {{ issuing ? 'Issuing…' : 'Issue token' }}
          </button>
        </div>

        <!-- One-time reveal -->
        <div class="token-reveal" *ngIf="newlyIssued">
          <p class="reveal-warn">
            <mat-icon>warning</mat-icon>
            Copy this token now — it will not be shown again.
          </p>
          <div class="token-copy-row">
            <code class="token-value">{{ newlyIssued.token }}</code>
            <button class="etm-btn secondary" (click)="copyToken(newlyIssued.token)">
              <mat-icon>content_copy</mat-icon> Copy
            </button>
          </div>
          <button class="etm-btn ghost" (click)="newlyIssued = null">Dismiss</button>
        </div>
      </div>

      <!-- Token list -->
      <div class="etm-card">
        <div class="list-header">
          <h3>Active tokens</h3>
          <button
            class="etm-btn danger"
            (click)="revokeAll()"
            [disabled]="busy || tokens.length === 0"
          >
            Revoke all
          </button>
        </div>

        <div *ngIf="loading" class="etm-state">Loading…</div>
        <div *ngIf="!loading && tokens.length === 0" class="etm-state">No tokens issued yet.</div>

        <table class="etm-table" *ngIf="!loading && tokens.length > 0">
          <thead>
            <tr>
              <th>Label</th>
              <th>Status</th>
              <th>Issued</th>
              <th>Expires</th>
              <th>Last used</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tokens">
              <td>{{ t.label || '—' }}</td>
              <td>
                <span class="status-chip" [ngClass]="t.status.toLowerCase()">
                  {{ t.status }}
                </span>
              </td>
              <td>{{ t.issuedAt | date:'mediumDate' }}</td>
              <td>{{ t.expiresAt | date:'mediumDate' }}</td>
              <td>{{ t.lastUsedAt ? (t.lastUsedAt | date:'mediumDate') : '—' }}</td>
              <td>
                <button
                  class="etm-btn danger-sm"
                  (click)="revokeOne(t)"
                  [disabled]="busy || t.status !== 'ACTIVE'"
                >
                  Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ng-template #upgradeBlock>
      <div class="etm-upgrade">
        <mat-icon>extension</mat-icon>
        <span>Browser extension token management requires a Pro plan.</span>
      </div>
    </ng-template>
  `,
  styles: [`
    .etm-page { max-width: 860px; margin: 24px auto; padding: 0 16px; display: flex; flex-direction: column; gap: 16px; }
    .etm-header h2 { margin: 0 0 4px; font-size: 22px; }
    .etm-desc { margin: 0; color: #555; font-size: 14px; }
    .etm-card { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; }
    .etm-card h3 { margin: 0 0 12px; font-size: 16px; }
    .issue-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .etm-input { flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 13px; }
    .etm-btn { display: inline-flex; align-items: center; gap: 4px; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; }
    .etm-btn:disabled { opacity: 0.55; cursor: default; }
    .etm-btn.primary { background: #1a73e8; color: white; }
    .etm-btn.secondary { background: #f1f3f4; color: #333; }
    .etm-btn.ghost { background: transparent; color: #666; padding: 4px 8px; }
    .etm-btn.danger { background: #d32f2f; color: white; }
    .etm-btn.danger-sm { background: transparent; color: #d32f2f; border: 1px solid #d32f2f; padding: 4px 10px; font-size: 12px; border-radius: 4px; cursor: pointer; }
    .etm-btn.danger-sm:disabled { opacity: 0.4; cursor: default; }
    .token-reveal { margin-top: 16px; padding: 12px; background: #fff8e1; border: 1px solid #ffe082; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; }
    .reveal-warn { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 13px; font-weight: 600; color: #e65100; }
    .token-copy-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .token-value { background: #f5f5f5; padding: 6px 10px; border-radius: 4px; font-size: 12px; word-break: break-all; flex: 1; }
    .list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .list-header h3 { margin: 0; font-size: 16px; }
    .etm-state { color: #666; font-size: 13px; padding: 8px 0; }
    .etm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .etm-table th { text-align: left; padding: 8px 10px; border-bottom: 2px solid #e0e0e0; font-weight: 600; color: #444; }
    .etm-table td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    .status-chip { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .status-chip.active { background: #e8f5e9; color: #2e7d32; }
    .status-chip.revoked { background: #fce4ec; color: #c62828; }
    .status-chip.expired { background: #f5f5f5; color: #666; }
    .etm-upgrade { display: flex; align-items: center; gap: 10px; padding: 20px; border: 1px dashed #ccc; border-radius: 8px; color: #666; font-size: 14px; max-width: 500px; margin: 40px auto; }
  `],
})
export class ExtensionTokenManagerComponent implements OnInit {
  entitled = false;
  loading = false;
  busy = false;
  issuing = false;

  tokens: ExtensionTokenSummary[] = [];
  newLabel = '';
  newlyIssued: IssuedExtensionToken | null = null;

  constructor(
    private readonly api: ExtensionTokenApiService,
    private readonly entitlements: EntitlementService,
    private readonly snack: MatSnackBar
  ) {
    this.entitled = this.entitlements.canAccess(ENTITLEMENT_KEYS.EXTENSION_CAPTURE);
  }

  ngOnInit(): void {
    if (this.entitled) this.loadTokens();
  }

  private loadTokens(): void {
    this.loading = true;
    this.api.list().subscribe({
      next: (tokens) => { this.tokens = tokens; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Failed to load tokens', '', { duration: 3000 }); },
    });
  }

  issueToken(): void {
    this.issuing = true;
    this.newlyIssued = null;
    this.api.issue(this.newLabel || undefined).subscribe({
      next: (issued) => {
        this.newlyIssued = issued;
        this.newLabel = '';
        this.issuing = false;
        this.loadTokens();
      },
      error: () => {
        this.issuing = false;
        this.snack.open('Failed to issue token', '', { duration: 3000 });
      },
    });
  }

  revokeOne(token: ExtensionTokenSummary): void {
    this.busy = true;
    this.api.revoke(token.tokenId).subscribe({
      next: () => { this.busy = false; this.loadTokens(); },
      error: () => { this.busy = false; this.snack.open('Revoke failed', '', { duration: 3000 }); },
    });
  }

  revokeAll(): void {
    this.busy = true;
    this.api.revokeAll().subscribe({
      next: (res) => {
        this.busy = false;
        this.snack.open(`Revoked ${res.revoked} token(s)`, '', { duration: 3000 });
        this.loadTokens();
      },
      error: () => { this.busy = false; this.snack.open('Revoke all failed', '', { duration: 3000 }); },
    });
  }

  copyToken(token: string): void {
    navigator.clipboard.writeText(token).then(
      () => this.snack.open('Token copied', '', { duration: 2000 }),
      () => this.snack.open('Copy failed', '', { duration: 2000 })
    );
  }
}
