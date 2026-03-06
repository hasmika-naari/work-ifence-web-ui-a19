import { Injectable, computed, signal } from '@angular/core';
import { DashboardEditableRow, DashboardRowEditTab } from './dashboard-app-admin-menu.models';

interface RowEditContext {
  tab: DashboardRowEditTab | null;
  rowIndex: number | null;
  rowData: DashboardEditableRow | null;
}

interface SavedRowPayload {
  tab: DashboardRowEditTab;
  rowIndex: number;
  rowData: DashboardEditableRow;
}

@Injectable({ providedIn: 'root' })
export class DashboardRowEditStore {
  private readonly context = signal<RowEditContext>({
    tab: null,
    rowIndex: null,
    rowData: null,
  });

  private readonly savedRowSignal = signal<SavedRowPayload | null>(null);

  readonly editingTab = computed(() => this.context().tab);
  readonly editingRowIndex = computed(() => this.context().rowIndex);
  readonly editingRowData = computed(() => this.context().rowData);
  readonly savedRow = computed(() => this.savedRowSignal());

  startEditing(tab: DashboardRowEditTab, rowIndex: number, rowData: DashboardEditableRow): void {
    this.context.set({ tab, rowIndex, rowData: { ...rowData } });
  }

  closeEditing(): void {
    this.context.set({ tab: null, rowIndex: null, rowData: null });
  }

  submitCurrentRow(updatedRowData: DashboardEditableRow): void {
    const { tab, rowIndex } = this.context();
    if (tab === null || rowIndex === null) {
      return;
    }

    this.savedRowSignal.set({
      tab,
      rowIndex,
      rowData: { ...updatedRowData },
    });
  }

  clearSavedRow(): void {
    this.savedRowSignal.set(null);
  }
}
