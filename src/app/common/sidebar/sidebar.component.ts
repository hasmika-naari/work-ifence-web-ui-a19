
import { Component, inject, Signal, effect, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile, WifRole } from 'src/app/services/profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavSection as StoreNavSection } from 'src/app/nav/nav.model';
import { NavStore } from 'src/app/core/nav/nav.store';

@Component({
    selector: 'app-sidebar',
        imports: [NgScrollbarModule, MatExpansionModule, MatIconModule, MatDividerModule,
          CommonModule, MatButtonModule, MatIconModule,
          RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule, MatTooltipModule, MatMenuModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
        
        // Flatten all submenu items into a single list
        get allMenuItems(): NavItem[] {
          return this.navSections.flatMap(section => section.items || []);
        }
      // Returns the title for the currently active section (for use in template)
      get activeSectionTitle(): string {
        const section = this.navSections.find(s => s.id === this.activeSectionId);
        return section?.title || '';
      }
    // Returns the items for the currently active section (for use in template)
    get activeSectionItems(): NavItem[] {
      const section = this.navSections.find(s => s.id === this.activeSectionId);
      return section?.items || [];
    }
  isMoreOpen = false;
  navSections: NavSection[] = [];
  showMoreAvailable = false;
  @ViewChild('sidebarScroll') sidebarScroll?: ElementRef<HTMLDivElement>;
  
  // Submenu management (custom implementation without Material menu)
  hoveredSectionId: string | null = null;
  activeSectionId: string | null = null;
  private submenuCloseTimer: ReturnType<typeof setTimeout> | undefined;

    // Handle click on locked/disabled menu item
    onLockedMenuClick(item: any, event: Event) {
      event.preventDefault();
      if (item?.entitlementKey) {
        this.router.navigate(['/user/billing/upgrade'], {
          queryParams: {
            feature: item.entitlementKey,
            returnUrl: this.router.url
          }
        });
      }
    }
  isToggled = false;
  public toggleService: ToggleService = inject(ToggleService);
  private userStore: UserStoreService = inject(UserStoreService);
  public userAccount: Signal<Account> = this.userStore.getUserAccount();
  public userActiveRole: Signal<WifRole> = this.userStore.getUserActiveRole();
  public bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  public router: Router = inject(Router);
  private navStore: NavStore = inject(NavStore);
  private isLoggedIn = this.userStore.getUserLoginStatus();

  private navSectionsSignal: Signal<StoreNavSection[]> = this.navStore.visibleSections;

  constructor() {
    this.toggleService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
    effect(() => {
      const loggedIn = this.isLoggedIn();
      if (loggedIn) {
        this.navStore.load();
      } else {
        this.navStore.clear();
      }
    });
    effect(() => {
      this.navSections = this.navSectionsSignal() as unknown as NavSection[];
      queueMicrotask(() => this.updateShowMoreState());
    });
  }

  trackSection = (_index: number, section: NavSection) => section.title;
  trackItem = (_index: number, item: NavItem) => item.route || item.title;
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
  title: string;
  icon: string;
  route: string;
  locked?: boolean;
  showWhenLocked?: boolean;
}

interface NavSection {
id: any;
  title: string;
  items: NavItem[];
}