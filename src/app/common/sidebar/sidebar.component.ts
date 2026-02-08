import { Component, inject, Signal, effect, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile, WifRole } from 'src/app/services/profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavSection } from 'src/app/nav/nav.model';
import { NavStore } from 'src/app/core/nav/nav.store';

@Component({
    selector: 'app-sidebar',
        imports: [NgScrollbarModule, MatExpansionModule, MatIconModule, MatDividerModule,
          CommonModule, MatButtonModule, MatIconModule,
          RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule, MatTooltipModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  showFullMenu = false;
  showMoreAvailable = false;
  @ViewChild('sidebarScroll') sidebarScroll?: ElementRef<HTMLDivElement>;

    // Handle click on locked/disabled menu item
    onLockedMenuClick(item: any, event: Event) {
      event.preventDefault();
      this.router.navigate(['/user/billing/upgrade'], {
        queryParams: {
          feature: item.entitlementKey,
          returnUrl: this.router.url
        }
      });
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

  public navSections: Signal<NavSection[]> = this.navStore.visibleSections;

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
    // Debug: log navSections whenever it changes
    effect(() => {
      // eslint-disable-next-line no-console
      console.log('Sidebar navSections:', JSON.stringify(this.navSections(), null, 2));
    });
    effect(() => {
      this.navSections();
      queueMicrotask(() => this.updateShowMoreState());
    });
  }

  // ...existing code...

  toggleShowMore() {
    this.showFullMenu = !this.showFullMenu;
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
      this.showFullMenu = false;
    }
  }

  toggle() {
    this.toggleService.toggle();
  }

  toggleTheme() {
    this.toggleService.toggleTheme();
  }
}