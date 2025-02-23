import { Component, inject, Signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router, RouterLink } from '@angular/router';
import { ToggleService } from './toggle.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile } from 'src/app/services/profile.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, RouterLink, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {
    private userStore: UserStoreService = inject(UserStoreService);
    public userAccount: Signal<Account> = this.userStore.getUserAccount();
    bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  
    private storageService: LocalStorageService = inject(LocalStorageService);
    private router:Router =  inject(Router);


    // Current Date
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

    

    logoutHandler($event: any){
        this.storageService.removeItem("userName");
        this.storageService.removeItem("passWord");
        this.storageService.removeItem("authenticated");
    
    
       this.userStore.resetStore();
        this.router.navigateByUrl("/");
    }
}