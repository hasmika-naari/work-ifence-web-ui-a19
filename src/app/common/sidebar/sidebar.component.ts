
import { Component, inject, Signal, computed, effect, ElementRef, ViewChild, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile, WifRole } from 'src/app/services/profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpgradeDialogComponent } from 'src/app/resume-portal/components/upgrade-dialog.component';
import { Subscription } from 'rxjs';
import {
  type MenuBadge,
} from 'src/main/webapp/app/core/navbar/menu-rendering.util';
import { AccessContextStore } from 'src/app/core/store/access-context.store';
import { NavApiSection } from 'src/app/core/nav/nav-api.model';

@Component({
    selector: 'app-sidebar',
        imports: [NgScrollbarModule, MatExpansionModule, MatIconModule, MatDividerModule,
          CommonModule, MatButtonModule, MatIconModule,
          RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule, MatTooltipModule, MatMenuModule, MatDialogModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  private readonly dialog = inject(MatDialog);

  // Sections and flattened items are signals so they update immediately when navbar state updates.
  readonly navSections = computed<NavSection[]>(() => this.mapSections(this.navbarSectionsSignal()));
  readonly allMenuItems = computed<NavItem[]>(() => this.navSections().flatMap(section => section.items || []));

  // Returns the title for the currently active section (for use in template)
  get activeSectionTitle(): string {
    const section = this.navSections().find(s => s.id === this.activeSectionId);
    return section?.title || '';
  }

  // Returns the items for the currently active section (for use in template)
  get activeSectionItems(): NavItem[] {
    const section = this.navSections().find(s => s.id === this.activeSectionId);
    return section?.items || [];
  }
  isMoreOpen = false;
  showMoreAvailable = false;
  @ViewChild('sidebarScroll') sidebarScroll?: ElementRef<HTMLDivElement>;
  
  // Submenu management (custom implementation without Material menu)
  hoveredSectionId: string | null = null;
  activeSectionId: string | null = null;
  private submenuCloseTimer: ReturnType<typeof setTimeout> | undefined;

    onMenuItemClick(item: NavItem, event: Event, closeMorePanel = false): void {
      if (this.isMenuItemDisabled(item)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (closeMorePanel) {
        this.closeMorePanel();
      }
    }

    isMenuItemEnabled(item: NavItem): boolean {
      if (!item) return false;
      return !this.isMenuItemDisabled(item);
    }

    isMenuItemDisabled(item: NavItem): boolean {
      const route = (item?.route ?? '').toString().trim();
      const isMissingRoute = !route;
      const isLocked = item?.locked === true;
      const isNotAllowed = item?.allowed === false;
      return isLocked || isNotAllowed || isMissingRoute;
    }

    getItemBadges(item: NavItem): MenuBadge[] {
      const badges: MenuBadge[] = [];
      if (item?.locked) {
        badges.push({
          type: 'lock',
          label: 'Locked',
          tooltip: (item.lockReason ?? '').toString().trim() || 'Locked feature',
        });
      }
      if (item?.readOnly) {
        badges.push({
          type: 'readOnly',
          label: 'Read-only',
        });
      }
      return badges;
    }

    getLockTooltip(item: NavItem): string {
      return this.getItemBadges(item).find((badge) => badge.type === 'lock')?.tooltip || 'LOCKED';
    }

    getReadOnlyBadgeLabel(item: NavItem): string {
      return this.getItemBadges(item).find((badge) => badge.type === 'readOnly')?.label || 'Read Only';
    }
  isToggled = false;
  public toggleService: ToggleService = inject(ToggleService);
  private userStore: UserStoreService = inject(UserStoreService);
  public userAccount: Signal<Account> = this.userStore.getUserAccount();
  public userActiveRole: Signal<WifRole> = this.userStore.getUserActiveRole();
  public bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  public router: Router = inject(Router);
  private readonly accessContextStore = inject(AccessContextStore);
  private isLoggedIn = this.userStore.getUserLoginStatus();

  readonly navbarLoading = signal(true);
  readonly navbarLoadError = signal(false);

  private navMenuSectionsState = signal<NavApiSection[]>([]);
  private navbarSectionsSignal = computed<NavApiSection[]>(() => this.navMenuSectionsState());
  private navbarSub?: Subscription;
  private errorTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.toggleService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });

    effect(() => {
      const loggedIn = this.isLoggedIn();
      if (loggedIn) {
        this.accessContextStore.init().subscribe({ error: () => void 0 });
      } else {
        this.navMenuSectionsState.set([]);
      }
    });

    effect(() => {
      const sections = this.navSections();

      // If the menu changes, ensure any open submenu anchors still exist.
      if (this.activeSectionId && !sections.some(s => s.id === this.activeSectionId)) {
        this.activeSectionId = null;
      }
      if (this.hoveredSectionId && !sections.some(s => s.id === this.hoveredSectionId)) {
        this.hoveredSectionId = null;
      }

      queueMicrotask(() => this.updateShowMoreState());
    });
  }

  ngOnInit(): void {
    this.navbarLoading.set(true);
    this.navbarLoadError.set(false);

    if (this.isLoggedIn()) {
      this.accessContextStore.init().subscribe({ error: () => void 0 });
    }

    this.navbarSub = this.accessContextStore.navMenuSections$.subscribe((sections) => {
      this.navMenuSectionsState.set(Array.isArray(sections) ? sections : []);
      if (Array.isArray(sections)) {
        this.navbarLoading.set(false);
        this.navbarLoadError.set(false);
        if (this.errorTimer) {
          clearTimeout(this.errorTimer);
          this.errorTimer = undefined;
        }
      }
    });

    this.errorTimer = setTimeout(() => {
      if (!this.navMenuSectionsState().length) {
        this.navbarLoading.set(false);
        this.navbarLoadError.set(true);
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    this.navbarSub?.unsubscribe();
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
      this.errorTimer = undefined;
    }
  }

  private mapSections(sections: NavApiSection[]): NavSection[] {
    return [...sections]
      .sort((a, b) => this.sortNum(a.sortOrder, b.sortOrder))
      .map((section) => ({
        id: section.id,
        title: (section.title ?? '').toString(),
        items: (section.items ?? [])
          .map((item) => ({
            itemKey: item.id,
            title: (item.title ?? '').toString(),
            icon: this.normalizeIcon(item.icon),
            route: item.route,
            locked: item.locked,
            allowed: item.allowed,
            showWhenLocked: item.showWhenLocked,
            readOnly: false,
            lockReason: item.locked ? 'Locked feature' : undefined,
            entitlementKey: item.entitlementKey,
          }))
          .filter((item) => !(item.locked === true && item.showWhenLocked !== true)),
      }));
  }

  private normalizeIcon(name?: string): string {
    const normalized = (name ?? '').trim().toLowerCase();
    return normalized || 'grid';
  }

  private sortNum(a?: number, b?: number): number {
    const left = Number.isFinite(a) ? (a as number) : Number.MAX_SAFE_INTEGER;
    const right = Number.isFinite(b) ? (b as number) : Number.MAX_SAFE_INTEGER;
    return left - right;
  }

  trackSection = (_index: number, section: NavSection) => section.title;
  trackItem = (_index: number, item: NavItem) => item.itemKey || item.route || item.title;
  getSectionIcon(section: NavSection): string {
    return section.items?.[0]?.icon ?? '';
  }

    expandSidebar() {
      this.toggleService.toggle();
    }

  // ...existing code...

  openMorePanel() {
    this.isMoreOpen = true;
  }

  closeMorePanel() {
    this.isMoreOpen = false;
  }

  retryNavbarLoad(): void {
    this.navbarLoadError.set(false);
    this.navbarLoading.set(true);
    this.accessContextStore.refreshAfterProfileSwitch().subscribe({
      next: () => {
        this.navbarLoading.set(false);
      },
      error: () => {
        this.navbarLoading.set(false);
        this.navbarLoadError.set(true);
      },
    });
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }
    this.errorTimer = setTimeout(() => {
      if (!this.navMenuSectionsState().length) {
        this.navbarLoading.set(false);
        this.navbarLoadError.set(true);
      }
    }, 5000);
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateShowMoreState();
  }

  private updateShowMoreState() {
    const el = this.sidebarScroll?.nativeElement;
    if (!el) return;
    this.showMoreAvailable = el.scrollHeight > el.clientHeight + 4;
    if (!this.showMoreAvailable) {
      this.isMoreOpen = false;
    }
  }

  toggle() {
    this.toggleService.toggle();
  }

  toggleTheme() {
    this.toggleService.toggleTheme();
  }

  // Custom submenu management (no Material menu)
  openSubmenu(sectionId: string) {
    this.cancelSubmenuClose();
    this.activeSectionId = sectionId;
  }

  closeSubmenu() {
    this.scheduleSubmenuClose();
  }

  toggleSubmenu(sectionId: string) {
    if (this.activeSectionId === sectionId) {
      this.activeSectionId = null;
    } else {
      this.activeSectionId = sectionId;
    }
    this.cancelSubmenuClose();
  }

  scheduleSubmenuClose() {
    this.cancelSubmenuClose();
    this.submenuCloseTimer = setTimeout(() => {
      this.activeSectionId = null;
    }, 250);
  }

  cancelSubmenuClose() {
    if (this.submenuCloseTimer) {
      clearTimeout(this.submenuCloseTimer);
      this.submenuCloseTimer = undefined;
    }
  }

}

interface NavItem {
  itemKey?: string;
  title: string;
  icon: string;
  route?: string;
  locked?: boolean;
  allowed?: boolean;
  showWhenLocked?: boolean;
  readOnly?: boolean;
  lockReason?: string;
  entitlementKey?: string;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}