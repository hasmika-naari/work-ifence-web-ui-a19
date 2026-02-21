import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MenuItem, MenuManagementService, MenuSection, RoleKey } from './menu-management.service';

type DrawerEntity = 'section' | 'item';

interface SectionFormModel {
  title: string;
  sectionKey: string;
  sortOrder: number;
  isActive: boolean;
}

interface ItemFormModel {
  title: string;
  roleKey: RoleKey;
  sectionKey: string;
  sortOrder: number;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-menu-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSidenavModule,
  ],
  templateUrl: './app-admin-menu-management.component.html',
  styleUrls: ['./app-admin-menu-management.component.scss'],
})
export class AppAdminMenuManagementComponent implements OnInit {
  private readonly menuManagementService = inject(MenuManagementService);

  readonly menuItemColumns = ['select', 'title', 'roleKey', 'sectionKey', 'sortOrder', 'active', 'lastUpdated', 'actions'];

  readonly sections = signal<MenuSection[]>([]);

  readonly menuItems = signal<MenuItem[]>([]);

  selectedSectionKey = 'all';
  searchText = '';
  selectedRole = 'ALL';
  selectedStatus = 'ALL';
  reorderEnabled = false;
  readonly selectedItemIds = signal<string[]>([]);
  drawerOpen = false;
  drawerEntity: DrawerEntity = 'section';
  drawerAction: 'create' | 'edit' = 'create';
  editingSectionKey: string | null = null;
  editingItemId: string | null = null;

  sectionForm: SectionFormModel = this.getDefaultSectionForm();
  itemForm: ItemFormModel = this.getDefaultItemForm();
  private formSnapshot = '';

  ngOnInit(): void {
    this.reloadData();
  }

  get sortedSections(): MenuSection[] {
    return [...this.sections()].sort((left, right) => left.sortOrder - right.sortOrder);
  }

  get filteredMenuItems(): MenuItem[] {
    const search = this.searchText.trim().toLowerCase();
    return this.menuItems().filter((item) => {
      const sectionOk = this.selectedSectionKey === 'all' || item.sectionKey === this.selectedSectionKey;
      const roleOk = this.selectedRole === 'ALL' || item.roleKey === this.selectedRole;
      const statusOk =
        this.selectedStatus === 'ALL' ||
        (this.selectedStatus === 'Active' && item.isActive) ||
        (this.selectedStatus === 'Inactive' && !item.isActive);
      const searchOk =
        search.length === 0 ||
        item.title.toLowerCase().includes(search) ||
        item.sectionKey.toLowerCase().includes(search) ||
        item.roleKey.toLowerCase().includes(search);
      return sectionOk && roleOk && statusOk && searchOk;
    });
  }

  get isSectionDrawer(): boolean {
    return this.drawerEntity === 'section';
  }

  get isItemDrawer(): boolean {
    return this.drawerEntity === 'item';
  }

  get drawerTitle(): string {
    const action = this.drawerAction === 'create' ? 'Create' : 'Edit';
    return this.drawerEntity === 'section' ? `${action} Section` : `${action} Menu Item`;
  }

  get drawerDirty(): boolean {
    if (!this.drawerOpen) {
      return false;
    }

    const current = this.drawerEntity === 'section' ? this.sectionForm : this.itemForm;
    return JSON.stringify(current) !== this.formSnapshot;
  }

  get canSaveDrawer(): boolean {
    if (this.drawerEntity === 'section') {
      return !!this.sectionForm.title.trim() && !!this.sectionForm.sectionKey.trim();
    }

    return !!this.itemForm.title.trim() && !!this.itemForm.sectionKey.trim() && !!this.itemForm.roleKey;
  }

  isSelected(itemId: string): boolean {
    return this.selectedItemIds().includes(itemId);
  }

  toggleSelection(itemId: string, selected: boolean): void {
    this.selectedItemIds.update((ids) => {
      if (selected) {
        return ids.includes(itemId) ? ids : [...ids, itemId];
      }
      return ids.filter((id) => id !== itemId);
    });
  }

  openCreateSectionDrawer(): void {
    if (!this.canProceedWithDrawerSwitch()) {
      return;
    }
    this.drawerEntity = 'section';
    this.drawerAction = 'create';
    this.editingSectionKey = null;
    this.sectionForm = this.getDefaultSectionForm();
    this.openDrawerWithSnapshot();
  }

  openCreateItemDrawer(): void {
    if (!this.canProceedWithDrawerSwitch()) {
      return;
    }
    this.drawerEntity = 'item';
    this.drawerAction = 'create';
    this.editingItemId = null;
    this.itemForm = this.getDefaultItemForm();
    this.openDrawerWithSnapshot();
  }

  openEditSectionDrawer(section: MenuSection, event?: Event): void {
    event?.stopPropagation();
    if (!this.canProceedWithDrawerSwitch()) {
      return;
    }
    this.drawerEntity = 'section';
    this.drawerAction = 'edit';
    this.editingSectionKey = section.sectionKey;
    this.sectionForm = {
      title: section.title,
      sectionKey: section.sectionKey,
      sortOrder: section.sortOrder,
      isActive: section.isActive,
    };
    this.openDrawerWithSnapshot();
  }

  openEditItemDrawer(item: MenuItem): void {
    if (!this.canProceedWithDrawerSwitch()) {
      return;
    }
    this.drawerEntity = 'item';
    this.drawerAction = 'edit';
    this.editingItemId = item.id;
    this.itemForm = {
      title: item.title,
      roleKey: item.roleKey,
      sectionKey: item.sectionKey,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    };
    this.openDrawerWithSnapshot();
  }

  saveDrawer(): void {
    if (!this.canSaveDrawer) {
      return;
    }

    if (this.drawerEntity === 'section') {
      this.saveSection();
    } else {
      this.saveItem();
    }

    this.closeDrawer(false);
  }

  closeDrawer(userInitiated = true): void {
    if (userInitiated && this.drawerDirty) {
      const proceed = this.confirmDiscard();
      if (!proceed) {
        return;
      }
    }

    this.drawerOpen = false;
    this.formSnapshot = '';
  }

  selectSection(sectionKey: string): void {
    this.selectedSectionKey = sectionKey;
  }

  toggleSectionActive(sectionKey: string, isActive: boolean): void {
    const section = this.sections().find((row) => row.sectionKey === sectionKey);
    if (!section) {
      return;
    }

    this.menuManagementService
      .updateSection({ ...section, isActive })
      .subscribe(() => this.reloadData());
  }

  toggleReorder(): void {
    this.reorderEnabled = !this.reorderEnabled;
  }

  getItemCount(sectionKey: string): number {
    return this.menuItems().filter((item) => item.sectionKey === sectionKey).length;
  }

  canMoveUp(sectionKey: string): boolean {
    const sorted = this.sortedSections;
    return sorted.findIndex((section) => section.sectionKey === sectionKey) > 0;
  }

  canMoveDown(sectionKey: string): boolean {
    const sorted = this.sortedSections;
    const index = sorted.findIndex((section) => section.sectionKey === sectionKey);
    return index !== -1 && index < sorted.length - 1;
  }

  moveSectionUp(sectionKey: string, event: MouseEvent): void {
    event.stopPropagation();
    this.reorderSection(sectionKey, -1);
  }

  moveSectionDown(sectionKey: string, event: MouseEvent): void {
    event.stopPropagation();
    this.reorderSection(sectionKey, 1);
  }

  private reorderSection(sectionKey: string, direction: -1 | 1): void {
    const sorted = this.sortedSections;
    const currentIndex = sorted.findIndex((section) => section.sectionKey === sectionKey);
    const targetIndex = currentIndex + direction;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
      return;
    }

    const current = sorted[currentIndex];
    const target = sorted[targetIndex];

    this.menuManagementService
      .updateSection({ ...current, sortOrder: target.sortOrder })
      .subscribe(() => {
        this.menuManagementService
          .updateSection({ ...target, sortOrder: current.sortOrder })
          .subscribe(() => this.reloadData());
      });
  }

  toggleMenuItem(itemId: string, isActive: boolean): void {
    const item = this.menuItems().find((row) => row.id === itemId);
    if (!item) {
      return;
    }

    this.menuManagementService
      .updateItem({ ...item, isActive })
      .subscribe(() => this.reloadData());
  }

  private openDrawerWithSnapshot(): void {
    this.drawerOpen = true;
    const current = this.drawerEntity === 'section' ? this.sectionForm : this.itemForm;
    this.formSnapshot = JSON.stringify(current);
  }

  private canProceedWithDrawerSwitch(): boolean {
    if (!this.drawerOpen || !this.drawerDirty) {
      return true;
    }

    return this.confirmDiscard();
  }

  private confirmDiscard(): boolean {
    return globalThis.confirm('You have unsaved changes. Discard them and close?');
  }

  private saveSection(): void {
    const normalizedKey = this.sectionForm.sectionKey.trim();
    const payload: MenuSection = {
      title: this.sectionForm.title.trim(),
      sectionKey: normalizedKey,
      sortOrder: Number(this.sectionForm.sortOrder) || 1,
      isActive: this.sectionForm.isActive,
    };

    if (this.drawerAction === 'edit' && this.editingSectionKey) {
      const previousKey = this.editingSectionKey;
      this.menuManagementService
        .updateSection(payload, previousKey)
        .subscribe(() => {
          if (this.selectedSectionKey === previousKey) {
            this.selectedSectionKey = normalizedKey;
          }
          this.reloadData();
        });
      return;
    }

    this.menuManagementService
      .createSection(payload)
      .subscribe(() => this.reloadData());
  }

  private saveItem(): void {
    const payload: ItemFormModel = {
      title: this.itemForm.title.trim(),
      roleKey: this.itemForm.roleKey,
      sectionKey: this.itemForm.sectionKey,
      sortOrder: Number(this.itemForm.sortOrder) || 1,
      isActive: this.itemForm.isActive,
    };

    if (this.drawerAction === 'edit' && this.editingItemId) {
      const current = this.menuItems().find((row) => row.id === this.editingItemId);
      if (!current) {
        return;
      }

      this.menuManagementService
        .updateItem({
          ...current,
          ...payload,
        })
        .subscribe(() => this.reloadData());
      return;
    }

    this.menuManagementService
      .createItem({
        ...payload,
      })
      .subscribe(() => this.reloadData());
  }

  reloadData(): void {
    this.menuManagementService.getSections().subscribe((rows) => {
      this.sections.set(rows);

      if (this.selectedSectionKey !== 'all' && !rows.some((section) => section.sectionKey === this.selectedSectionKey)) {
        this.selectedSectionKey = 'all';
      }
    });

    this.menuManagementService.getItems().subscribe((rows) => {
      this.menuItems.set(rows);
    });
  }

  private getDefaultSectionForm(): SectionFormModel {
    return {
      title: '',
      sectionKey: '',
      sortOrder: this.sections().length + 1,
      isActive: true,
    };
  }

  private getDefaultItemForm(): ItemFormModel {
    return {
      title: '',
      roleKey: 'ROLE_USER',
      sectionKey: this.selectedSectionKey !== 'all' ? this.selectedSectionKey : (this.sortedSections[0]?.sectionKey ?? ''),
      sortOrder: this.menuItems().length + 1,
      isActive: true,
    };
  }
}
