import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';

const STORAGE_KEY = 'resume-template-selection';
const CATALOG_STORAGE_KEY = 'resume-template-selection-v2';

export type ResumeTemplateCatalogSelection = {
  templateId: string | number;
  templateKey: string;
  componentKey: string;
  version: string;
};

@Injectable({ providedIn: 'root' })
export class ResumeTemplateSelectionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storage = inject(LocalStorageService);
  private readonly userStore = inject(UserStoreService);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setSelection(template: ResumeTemplate): void {
    if (!this.isBrowser()) return;
    this.storage.setItem(STORAGE_KEY, template);
  }

  getSelection(): ResumeTemplate | null {
    if (!this.isBrowser()) return null;
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw || !raw.template_name || !raw.id) return null;
    return raw as ResumeTemplate;
  }

  clearSelection(): void {
    if (!this.isBrowser()) return;
    this.storage.removeItem(STORAGE_KEY);
  }

  setCatalogSelection(selection: ResumeTemplateCatalogSelection): void {
    if (!this.isBrowser()) return;
    try {
      sessionStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // ignore storage errors
    }
  }

  getCatalogSelection(): ResumeTemplateCatalogSelection | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = sessionStorage.getItem(CATALOG_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as ResumeTemplateCatalogSelection;
      if (!parsed?.templateId || !parsed?.componentKey) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  clearCatalogSelection(): void {
    if (!this.isBrowser()) return;
    try {
      sessionStorage.removeItem(CATALOG_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }

  consumeCatalogSelection(): ResumeTemplateCatalogSelection | null {
    const selection = this.getCatalogSelection();
    if (selection) {
      this.clearCatalogSelection();
    }
    return selection;
  }

  applySelectionIfPresent(): ResumeTemplate | null {
    const tpl = this.getSelection();
    if (!tpl) return null;

    this.userStore.updateResumeTemplate(tpl);
    if (tpl.template_name !== 'TEMPLATE_9') {
      this.userStore.emptyMultipleColumnTemplateSections();
    }
    this.userStore.setFlagOnTemplateSelected(tpl.template_name);
    this.clearSelection();
    return tpl;
  }
}
