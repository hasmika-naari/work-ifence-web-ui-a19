import { Component, inject, PLATFORM_ID, Signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleService } from '../header/toggle.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Account, BioProfile, MenuListItem, WifRole } from 'src/app/services/profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sidebar',
    imports: [NgScrollbarModule, MatExpansionModule, MatIconModule, MatDividerModule,
            CommonModule, MatButtonModule, MatIconModule,
            RouterLinkActive, RouterModule, RouterLink, NgClass, FeathericonsModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

    // Toggle Service
    isToggled = false;
    pExpanded = false;
    menuList: Array<MenuListItem> = [];
    
    public toggleService: ToggleService = inject(ToggleService);
    private userStore: UserStoreService = inject(UserStoreService);
    public userAccount: Signal<Account> = this.userStore.getUserAccount();
    public userActiveRole: Signal<WifRole> = this.userStore.getUserActiveRole();
    public bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
    private platformId: object =  inject(PLATFORM_ID);
    private router: Router =  inject(Router);

    constructor(
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        let aRole = this.userActiveRole().role;
        if(this.userActiveRole().role === 'ROLE_ADMIN'){
            this.menuList = [
                {
                    title: 'Dashboard',
                    icon: 'grid',
                    url: '/user/dashboard-admin',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Requests',
                    icon: 'file-text',
                    url: '/user/requests',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Organizations',
                    icon: 'file',
                    url: '/user/org-list',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Users',
                    icon: 'users',
                    url: '/user/user-list',
                    role: '',
                    subscription: ''
                }
                
            ];
        }else if(this.userActiveRole().role === 'ROLE_USER'){
            this.menuList = [
                {
                    title: 'Dashboard',
                    icon: 'grid',
                    url: '/user/dashboard',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Resumes',
                    icon: 'file-text',
                    url: '/user/resumes',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Job Applications',
                    icon: 'file',
                    url: '/user/job-applications',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Learn',
                    icon: 'book-open',
                    url: '/user/user-learn',
                    role: '',
                    subscription: ''
                }
            ];
        }else{
            this.menuList = [
                {
                    title: 'Dashboard',
                    icon: 'grid',
                    url: '/user/dashboard',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Resumes',
                    icon: 'file-text',
                    url: '/user/resumes',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Job Applications',
                    icon: 'file',
                    url: '/user/job-applications',
                    role: '',
                    subscription: ''
                },
                {
                    title: 'Learn',
                    icon: 'book-open',
                    url: '/user/user-learn',
                    role: '',
                    subscription: ''
                }
            ];
        }
    }

   
    toggle() {
        // this.pExpanded = !this.pExpanded;
        this.toggleService.toggle();
        // this.isToggled = !this.isToggled; // Toggle state
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Mat Expansion
    panelOpenState = false;

}