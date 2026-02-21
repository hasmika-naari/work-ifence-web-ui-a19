import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavbarApiService } from '../../../core/navbar/navbar-api.service';
import { NavbarStoreService } from '../../../core/navbar/navbar-store.service';
import { NavbarItemDTO, NavbarSectionDTO, UserMenuPrefDTO } from '../../../core/navbar/navbar.model';
import { isClickable, isVisible, itemBadges, type MenuBadge } from '../../../core/navbar/menu-rendering.util';

interface MenuItemViewModel {
  sectionKey: string;
  itemKey: string;
  title: string;
  icon?: string;
  route?: string;
  entitlementKey?: string;
  locked?: boolean;
  showWhenLocked?: boolean;
  readOnly?: boolean;
  lockReason?: string;
  minPlan?: string;
  hidden: boolean;
}

@Component({
  selector: 'app-user-menu-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAccordion,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './user-menu-preferences.component.html',
  styleUrls: ['./user-menu-preferences.component.scss'],
})
export class UserMenuPreferencesComponent implements OnInit {
  private readonly navbarStoreService = inject(NavbarStoreService);
  private readonly navbarApiService = inject(NavbarApiService);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly showOnlyLockedControl = new FormControl(false, { nonNullable: true });
  readonly resetting = signal(false);
  readonly loadingPrefs = signal(false);
  readonly refreshingNavbar = signal(false);

  private readonly navbarSignal = toSignal(this.navbarStoreService.navbar$, { initialValue: null });
  private readonly searchText = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    { initialValue: '' },
  );
  private readonly showOnlyLocked = toSignal(
    this.showOnlyLockedControl.valueChanges.pipe(startWith(this.showOnlyLockedControl.value)),
    { initialValue: false },
  );

  private readonly hiddenByItemKey = signal<Record<string, boolean>>({});

  readonly items = computed<MenuItemViewModel[]>(() => {
    const navbar = this.navbarSignal();
    const search = (this.searchText() ?? '').trim().toLowerCase();
    const lockedOnly = this.showOnlyLocked();
    const hiddenMap = this.hiddenByItemKey();

    if (!navbar?.sections?.length) {
      return [];
    }

    return (navbar.sections ?? [])
      .flatMap((section) =>
        (section.items ?? [])
          .filter((item) => !this.isFeatureDisabled(item))
          .filter((item) => isVisible(item))
          .map((item) => this.toItemViewModel(section.sectionKey, item, hiddenMap))
      )
      .filter((item) => !lockedOnly || item.locked === true)
      .filter((item) => this.matchesSearch(item, search));
  });

  ngOnInit(): void {
    this.navbarStoreService.initOnce();
    this.loadPrefs();
  }

  onToggle(item: MenuItemViewModel, event: MatSlideToggleChange): void {
    const previousHidden = item.hidden;
    const nextHidden = !event.checked;

    if (!this.isCurrentUserItem(item.itemKey)) {
      this.snackBar.open('Invalid preference item for current user.', 'Dismiss', {
        duration: 3000,
      });
      this.setItemHidden(item.itemKey, previousHidden);
      return;
    }

    this.setItemHidden(item.itemKey, nextHidden);

    this.navbarApiService.updatePref(item.itemKey, nextHidden).subscribe({
      next: () => {
        this.navbarStoreService.refresh();
      },
      error: () => {
        this.setItemHidden(item.itemKey, previousHidden);
        this.snackBar.open('Failed to save menu preference. Reverted change.', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  onReset(): void {
    if (this.resetting()) {
      return;
    }

    this.resetting.set(true);
    this.navbarApiService.resetPrefs().subscribe({
      next: () => {
        this.searchControl.setValue('');
        this.showOnlyLockedControl.setValue(false);
        this.hiddenByItemKey.set({});
        this.navbarStoreService.refresh();
        this.loadPrefs();
        this.snackBar.open('Menu preferences reset.', 'Dismiss', { duration: 2500 });
        this.resetting.set(false);
      },
      error: () => {
        this.resetting.set(false);
        this.snackBar.open('Failed to reset menu preferences.', 'Dismiss', { duration: 3000 });
      },
    });
  }

  trackItem(_index: number, item: MenuItemViewModel): string {
    return item.itemKey;
  }

  isItemActionEnabled(item: MenuItemViewModel): boolean {
    return isClickable(item, { allowReadOnlyNavigation: false, requireRoute: false });
  }

  getItemBadges(item: MenuItemViewModel): MenuBadge[] {
    return itemBadges(item);
  }

  getLockTooltip(item: MenuItemViewModel): string {
    return this.getItemBadges(item).find((badge) => badge.type === 'lock')?.tooltip || 'Locked feature';
  }

  getReadOnlyBadgeLabel(item: MenuItemViewModel): string {
    return this.getItemBadges(item).find((badge) => badge.type === 'readOnly')?.label || 'Read Only';
  }

  private loadPrefs(): void {
    this.loadingPrefs.set(true);
    this.navbarApiService.getPrefs().subscribe({
      next: (prefs) => {
        this.hiddenByItemKey.set(this.toPrefMap(prefs));
        this.loadingPrefs.set(false);
      },
      error: () => {
        this.loadingPrefs.set(false);
        this.snackBar.open('Unable to load menu preferences. Using defaults.', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  private toItemViewModel(sectionKey: string, item: NavbarItemDTO, hiddenMap: Record<string, boolean>): MenuItemViewModel {
    const prefHidden = hiddenMap[item.itemKey];

    return {
      sectionKey,
      itemKey: item.itemKey,
      title: item.title,
      icon: item.icon,
      route: item.route,
      entitlementKey: item.entitlementKey,
      locked: item.locked,
      showWhenLocked: item.showWhenLocked,
      readOnly: item.readOnly,
      lockReason: item.lockReason,
      minPlan: (item as { minPlan?: string }).minPlan,
      hidden: prefHidden ?? false,
    };
  }

  private isFeatureDisabled(item: NavbarItemDTO): boolean {
    return (item.featureStatus ?? '').toUpperCase() === 'DISABLED';
  }

  private matchesSearch(item: MenuItemViewModel, search: string): boolean {
    if (!search) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(search) ||
      item.itemKey.toLowerCase().includes(search)
    );
  }

  private toPrefMap(prefs: UserMenuPrefDTO[]): Record<string, boolean> {
    return prefs.reduce<Record<string, boolean>>((acc, pref) => {
      acc[pref.itemKey] = pref.isHidden;
      return acc;
    }, {});
  }

  private setItemHidden(itemKey: string, hidden: boolean): void {
    this.hiddenByItemKey.update((current) => ({
      ...current,
      [itemKey]: hidden,
    }));
  }

  private isCurrentUserItem(itemKey: string): boolean {
    const navbar = this.navbarSignal();
    if (!navbar?.sections?.length) {
      return false;
    }

    return (navbar.sections ?? []).some((section) =>
      (section.items ?? []).some((item) => item.itemKey === itemKey),
    );
  }
}
