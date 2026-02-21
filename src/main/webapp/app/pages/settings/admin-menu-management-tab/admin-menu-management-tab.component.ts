import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavbarStoreService } from '../../../core/navbar/navbar-store.service';

interface AdminNavSectionRow {
  id: string;
  roleKey: string;
  sectionKey: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
}

interface AdminNavItemRow {
  id: string;
  roleKey: string;
  sectionKey: string;
  itemKey: string;
  title: string;
  route: string;
  isActive: boolean;
  featureStatus: 'ACTIVE' | 'READ_ONLY' | 'DISABLED';
  statusReason?: string;
  showWhenLocked: boolean;
}

interface AdminNavSectionUpdateRequest {
  id: string;
  roleKey: string;
  sectionKey: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
}

interface AdminNavItemUpdateRequest {
  id: string;
  roleKey: string;
  sectionKey: string;
  itemKey: string;
  title: string;
  route: string;
  isActive: boolean;
  featureStatus: 'ACTIVE' | 'READ_ONLY' | 'DISABLED';
  statusReason?: string;
  showWhenLocked: boolean;
}

@Component({
  selector: 'app-admin-menu-management-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-menu-management-tab.component.html',
  styleUrls: ['./admin-menu-management-tab.component.scss'],
})
export class AdminMenuManagementTabComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly snackbar = inject(MatSnackBar);
  private readonly navbarStore = inject(NavbarStoreService);
  private readonly destroy$ = new Subject<void>();

  isAdmin = false;
  loading = false;
  saving = false;

  selectedRoleKey = 'ALL';
  roleKeys: string[] = ['ALL'];

  sections: AdminNavSectionRow[] = [];
  items: AdminNavItemRow[] = [];

  readonly sectionColumns = ['roleKey', 'sectionKey', 'title', 'isActive', 'save'];
  readonly itemColumns = ['roleKey', 'sectionKey', 'itemKey', 'title', 'isActive', 'featureStatus', 'showWhenLocked', 'save'];

  readonly featureStatuses: Array<'ACTIVE' | 'READ_ONLY' | 'DISABLED'> = ['ACTIVE', 'READ_ONLY', 'DISABLED'];

  get filteredSections(): AdminNavSectionRow[] {
    if (this.selectedRoleKey === 'ALL') return this.sections;
    return this.sections.filter((row) => row.roleKey === this.selectedRoleKey);
  }

  get filteredItems(): AdminNavItemRow[] {
    if (this.selectedRoleKey === 'ALL') return this.items;
    return this.items.filter((row) => row.roleKey === this.selectedRoleKey);
  }

  ngOnInit(): void {
    this.navbarStore.navbar$
      .pipe(takeUntil(this.destroy$))
      .subscribe((navbar) => {
        this.isAdmin = (navbar?.user?.role ?? '') === 'ROLE_ADMIN';
      });

    this.navbarStore.initOnce();
    this.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reload(): void {
    this.loading = true;
    forkJoin({
      sections: this.http.get<AdminNavSectionRow[]>('/api/admin/menu/sections'),
      items: this.http.get<AdminNavItemRow[]>('/api/admin/menu/items'),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ sections, items }) => {
          this.sections = sections ?? [];
          this.items = items ?? [];
          this.roleKeys = ['ALL', ...Array.from(new Set([
            ...this.sections.map((x) => x.roleKey),
            ...this.items.map((x) => x.roleKey),
          ])).filter(Boolean).sort()];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackbar.open('Failed to load menu management data.', 'Dismiss', { duration: 3000 });
        },
      });
  }

  saveSection(row: AdminNavSectionRow): void {
    const payload: AdminNavSectionUpdateRequest = {
      id: row.id,
      roleKey: row.roleKey,
      sectionKey: row.sectionKey,
      title: row.title,
      sortOrder: row.sortOrder,
      isActive: row.isActive,
    };

    this.saving = true;
    this.http.put(`/api/admin/menu/sections/${encodeURIComponent(row.id)}`, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.saving = false;
          this.snackbar.open('Section saved.', 'Dismiss', { duration: 2000 });
          this.navbarStore.refresh();
          this.reload();
        },
        error: () => {
          this.saving = false;
          this.snackbar.open('Failed to save section.', 'Dismiss', { duration: 3000 });
        },
      });
  }

  saveItem(row: AdminNavItemRow): void {
    if (!this.isValidFeatureStatus(row.featureStatus)) {
      this.snackbar.open('featureStatus must be ACTIVE, READ_ONLY, or DISABLED.', 'Dismiss', { duration: 3000 });
      return;
    }

    const needsReason = row.featureStatus === 'READ_ONLY' || row.featureStatus === 'DISABLED';
    const statusReason = (row.statusReason ?? '').trim();
    if (needsReason && !statusReason) {
      this.snackbar.open('Reason is required when featureStatus is READ_ONLY or DISABLED.', 'Dismiss', { duration: 3000 });
      return;
    }

    const payload: AdminNavItemUpdateRequest = {
      id: row.id,
      roleKey: row.roleKey,
      sectionKey: row.sectionKey,
      itemKey: row.itemKey,
      title: row.title,
      route: row.route,
      isActive: row.isActive,
      featureStatus: row.featureStatus,
      statusReason: statusReason || undefined,
      showWhenLocked: row.showWhenLocked,
    };

    this.saving = true;
    this.http.put(`/api/admin/menu/items/${encodeURIComponent(row.id)}`, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.saving = false;
          this.snackbar.open('Item saved.', 'Dismiss', { duration: 2000 });
          this.navbarStore.refresh();
          this.reload();
        },
        error: () => {
          this.saving = false;
          this.snackbar.open('Failed to save item.', 'Dismiss', { duration: 3000 });
        },
      });
  }

  private isValidFeatureStatus(value: string): value is 'ACTIVE' | 'READ_ONLY' | 'DISABLED' {
    return value === 'ACTIVE' || value === 'READ_ONLY' || value === 'DISABLED';
  }
}
