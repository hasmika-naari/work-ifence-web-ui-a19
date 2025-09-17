import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from 'src/app/shared/icons.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-saas-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    NgOptimizedImage, 
    RouterModule, 
    RouterLink, 
    NgbModule, 
    NgbNavModule,
    IconsModule,
    MatProgressSpinnerModule
   
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaasSidebarComponent implements OnInit, OnChanges {
  @Input() userAccount: any;
  @Output() closeSidebar = new EventEmitter<void>();
  @Input() sidebarOpen: boolean = false;
  @Input() isAutoLoggingIn: boolean = false; // New property to track auto login state
  country: string = '';
  selectedCountry: any = '';

  private _localStorageService: LocalStorageService = inject(LocalStorageService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    // Country logic commented out
  }

  ngOnInit() {
    console.log('Sidebar initialized, open state:', this.sidebarOpen);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarOpen']) {
      console.log('Sidebar open state changed:', this.sidebarOpen);
      this.cdr.detectChanges();
    }
  }

  // countrySelectionChanged($event){
  //   
  //   if($event.value === '1'){
  //     this.selectedCountry = '1';
  //     this._localStorageService.setItem('naariCountry', 'usa');
  //     this.dealStoreFacade.setSelectedCountry('usa');
  //     this.country = 'usa';
  //   }else{
  //     this.selectedCountry = '2';
  //     this._localStorageService.setItem('naariCountry', 'india');
  //     this.dealStoreFacade.setSelectedCountry('india');
  //     this.country = 'india';
  //   }
  // }

}
