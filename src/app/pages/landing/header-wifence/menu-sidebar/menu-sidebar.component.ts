import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from 'src/app/shared/icons.module';
import { MenuListItem } from '../../../../services/bee-compete.model';

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
  @Output() closeMenuSidebar = new EventEmitter<void>();

  constructor() {}
}