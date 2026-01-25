import { Component, inject, Signal, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router } from '@angular/router';
import { ToggleService } from './toggle.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile, WifRole } from 'src/app/services/profile.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, NgClass, MatDividerModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {
    @Output() openMenuSidenav = new EventEmitter<void>();
    @Input() isSticky = false;
    private userStore: UserStoreService = inject(UserStoreService);
    public userAccount: Signal<Account> = this.userStore.getUserAccount();
    public userRoles: Signal<Array<WifRole>> = this.userStore.getUserRoles();
    public userActiveRole: Signal<WifRole> = this.userStore.getUserActiveRole();
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
    

    logoutHandler($event: any){
        this.storageService.removeItem("userName");
        this.storageService.removeItem("passWord");
        this.storageService.removeItem("authenticated");
    
    
       this.userStore.resetStore();
        this.router.navigateByUrl("/");
    }
}