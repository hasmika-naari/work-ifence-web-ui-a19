import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import type { FeatureFlag, FeatureFlagKey } from 'src/app/models/feature-flag.model';

type FlagEdit = {
  enabled?: boolean;
  rolloutPercent?: number | null;
  failClosed?: boolean;
  notes?: string;
};

@Component({
  selector: 'app-admin-feature-flags',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-feature-flags.component.html',
  styleUrls: ['./admin-feature-flags.component.scss'],
})
export class AdminFeatureFlagsComponent {
  private readonly remoteConfig = inject(RemoteConfigFacadeService);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['key', 'enabled', 'rollout', 'effective', 'actions'];

  private readonly edits = signal<Map<FeatureFlagKey, FlagEdit>>(new Map());
  readonly importJson = signal<string>('');

  readonly rows = computed(() => {
    const list = Array.from(this.remoteConfig.flagsMap().values());
    list.sort((a, b) => a.key.localeCompare(b.key));
    return list;
  });

  isEffectiveEnabled(key: FeatureFlagKey): boolean {
    return this.remoteConfig.isFlagEnabledSafe(key);
  }

  getEdit(key: FeatureFlagKey): FlagEdit {
    return this.edits().get(key) ?? {};
  }

  private setEdit(key: FeatureFlagKey, patch: FlagEdit): void {
    const next = new Map(this.edits());
    next.set(key, { ...(next.get(key) ?? {}), ...patch });
    this.edits.set(next);
  }

  onToggleEnabled(key: FeatureFlagKey, enabled: boolean): void {
    this.setEdit(key, { enabled });
  }

  onRolloutChange(key: FeatureFlagKey, value: string): void {
    const n = value.trim() === '' ? null : Number(value);
    this.setEdit(key, { rolloutPercent: Number.isFinite(n as any) ? (n as number) : null });
  }

  applyRow(flag: FeatureFlag): void {
    const edit = this.getEdit(flag.key);

    const enabled = edit.enabled ?? flag.enabled;
    const rolloutPercent =
      edit.rolloutPercent === null
        ? undefined
        : edit.rolloutPercent === undefined
          ? flag.rolloutPercent
          : edit.rolloutPercent;

    this.remoteConfig.setFlag(flag.key, enabled, rolloutPercent, flag.failClosed, flag.notes);

    const next = new Map(this.edits());
    next.delete(flag.key);
    this.edits.set(next);

    this.snackBar.open('Feature flag updated.', 'OK', { duration: 2200 });
  }

  resetAll(): void {
    this.remoteConfig.resetToDefaults();
    this.edits.set(new Map());
    this.snackBar.open('Feature flags reset to defaults.', 'OK', { duration: 2600 });
  }

  exportJson(): void {
    const json = this.remoteConfig.exportConfigJson();
    this.importJson.set(json);
    void this.copyToClipboard(json);
    this.snackBar.open('Exported config (also copied to clipboard when permitted).', 'OK', { duration: 3200 });
  }

  importNow(): void {
    const raw = this.importJson();
    if (!raw.trim()) {
      this.snackBar.open('Paste JSON to import.', 'OK', { duration: 2600 });
      return;
    }

    const err = this.remoteConfig.importConfigJson(raw);
    if (err) {
      this.snackBar.open(`Import failed: ${err}`, 'OK', { duration: 4000 });
      return;
    }

    this.edits.set(new Map());
    this.snackBar.open('Imported feature flags.', 'OK', { duration: 2600 });
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      const clip = (globalThis as any).navigator?.clipboard;
      if (clip?.writeText) {
        await clip.writeText(text);
      }
    } catch {
      // ignore
    }
  }
}
