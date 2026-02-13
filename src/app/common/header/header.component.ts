import { Component, inject, Signal, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router } from '@angular/router';
import { ToggleService } from './toggle.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile, WifRole } from 'src/app/services/profile.model';
import { AccessContextService } from 'src/app/services/access-context.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, NgIf, NgFor, NgClass, MatDividerModule, MatIconModule, MatTooltipModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {
    public accessContext = inject(AccessContextService);
        get ownedProfiles() {
            return this.accessContext.ownedProfiles();
        }
        get activeProfileKey() {
            return this.accessContext.activeProfileKey() ?? '';
        }
        switchProfile(profileKey: string) {
            // Profile switching is handled by the right-side profile panel.
            // Keep this method for template compatibility.
            void 0;
        }
    @Output() openMenuSidenav = new EventEmitter<void>();
    @Input() isSticky = false;
    private userStore: UserStoreService = inject(UserStoreService);
    public userAccount: Signal<Account> = this.userStore.getUserAccount();
    public userRoles: Signal<Array<WifRole>> = this.userStore.getUserRoles();
    public userActiveRole: Signal<WifRole> = this.userStore.getUserActiveRole();
    public isLoggedIn = this.userStore.getUserLoginStatus();
    bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
    private storageService: LocalStorageService = inject(LocalStorageService);
    private router:Router =  inject(Router);
    currentDate: Date = new Date();
    formattedDate: any;

    constructor(
        public toggleService: ToggleService,
        private datePipe: DatePipe
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.formattedDate = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    
    goHome() {
        this.router.navigate(['/']);
    }

    goToLogin() {
        void this.router.navigateByUrl('/sign-in');
    }
    

    logoutHandler($event: any){
        $event?.preventDefault?.();
        $event?.stopPropagation?.();

        // Clear token + remember-me + credentials
        this.storageService.clearAuthState();

        // Ensure UI reflects logged-out state immediately
        this.userStore.setUserLoginStatus(false);
        this.userStore.resetStore();

        void this.router.navigateByUrl("/");
    }
}