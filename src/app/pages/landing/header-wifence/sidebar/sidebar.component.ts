import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'app-saas-sidebar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, RouterLink, NgbModule, NgbNavModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SaasSidebarComponent implements OnInit {
  country: string = '';
  selectedCountry: any = '';

  private _localStorageService: LocalStorageService= inject(LocalStorageService);

  constructor() {
    // this.country = this._localStorageService.getItem('naariCountry');
    // if(this.country){
    //   this.country = this.country.replace(/\"/g, " ");
    //   this.country = this.country.replace(/\s+/g, '');
    //   this.country = this.country.replace(/\\/g, '');

    //   if(this.country === 'usa'){
    //     this.selectedCountry = '1';
    //   }else{
    //     this.selectedCountry = '2';
    //   }
    // }
   }

  ngOnInit() {
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
