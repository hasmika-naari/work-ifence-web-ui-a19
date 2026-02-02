import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from 'src/app/shared/icons.module';
import { MenuListItem } from '../../../../services/bee-compete.model';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { UserStoreService } from '../../../../services/store/user-store.service';

@Component({
  selector: 'app-menu-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    NgOptimizedImage, 
    RouterModule, 
    RouterLink, 
    NgbModule, 
    NgbNavModule,
    IconsModule
  ],
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuSidebarComponent {
  @Input() menuSidebarOpen: boolean = false;
  @Input() menuItems: MenuListItem[] = [];
  @Input() userAccount: any;
  @Output() closeMenuSidebar = new EventEmitter<void>();

  private _localStorageService: LocalStorageService = inject(LocalStorageService);
  private userStore: UserStoreService = inject(UserStoreService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private router: Router = inject(Router);

  constructor() {}
  
  /**
   * Logout the user and redirect to home page
   */
  logout(): void {
    this._localStorageService.clearAuthState();

    // Ensure global app state reflects logged-out immediately
    this.userStore.setUserLoginStatus(false);
    this.userStore.resetStore();
    
    // Close the sidebar
    this.closeMenuSidebar.emit();
    
    // Reset user account
    this.userAccount = null;
    
    // Navigate to home page
    this.router.navigate(['/']);
    
    // Force change detection
    this.cdr.detectChanges();
  }
}