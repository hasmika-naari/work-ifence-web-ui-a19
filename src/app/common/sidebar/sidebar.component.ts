import { Component, inject, Signal, effect } from '@angular/core';
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
import { NavStateService } from 'src/app/nav/nav-state.service';
import { NavSection } from 'src/app/nav/nav.model';

@Component({
    selector: 'app-sidebar',
        imports: [NgScrollbarModule, MatExpansionModule, MatIconModule, MatDividerModule,
          CommonModule, MatButtonModule, MatIconModule,
          RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule, MatTooltipModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
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
  private navState: NavStateService = inject(NavStateService);

  public navSections: Signal<NavSection[]> = this.navState.navSections();

  constructor() {
    this.toggleService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
    // Debug: log navSections whenever it changes
    effect(() => {
      // eslint-disable-next-line no-console
      console.log('Sidebar navSections:', JSON.stringify(this.navSections(), null, 2));
    });
  }

  // ...existing code...

  toggle() {
    this.toggleService.toggle();
  }

  toggleTheme() {
    this.toggleService.toggleTheme();
  }
}