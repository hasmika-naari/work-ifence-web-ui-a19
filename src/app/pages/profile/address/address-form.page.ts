import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, Subject, startWith, map } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { CommonModule, Location } from '@angular/common';
import { Account, BioProfile, LoginProfile, Profile } from 'src/app/services/profile.model';
import { AppUtilService } from 'src/app/services/app.util.service';
import { Address } from 'src/app/services/contact.model';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../resume-form3/confirm-dialog/confirm-dialog.component';
// import { CountryBottomSheetComponent } from '@app/shared/bottom-sheets/country/country-bottom-sheet.component';
// import { StateBottomSheetComponent } from '@app/shared/bottom-sheets/states/state-bottom-sheet.component';
// import { CityBottomSheetComponent } from '@app/shared/bottom-sheets/city/city-bottom-sheet.component';

@Component({
  selector: 'address-profile-form',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, ReactiveFormsModule, MatButtonModule, MatOptionModule,
            MatCardModule, MatSelectModule, MatAutocompleteModule,
          FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressBarModule],
  templateUrl: './address-form.page.html',
  styleUrls: ['./address-form.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AddressFormPage implements OnInit, OnChanges, OnDestroy {
  
  pageTtitle = 'Address Profile';
 ////////////////////////////////////////////////
 htmlText ="<p>Address Form</p>"
 hasFocus = false;
 subject!: string;
 offEdit : Boolean = false
  actionInProgress =  false;

  stateList:any = [];
  filteredStateList:any = [];

//////////////////////////////////////////////////
  private _subscriptions: Array<Subscription>

  actionInProgress$!: Observable<Boolean>;;

  public addressForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private userStore: UserStoreService = inject(UserStoreService);
  private appUtilService: AppUtilService = inject(AppUtilService);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  address: Signal<Address> = this.userStore.getSelectedAddresses();
  addresses: Signal<Array<Address>> = this.userStore.getUserAddresses();
  @Output() editAddress = new EventEmitter();
  userAddressess : Signal<Address[]> = this.userStore.getUserAddresses();
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  isFirstTimeCalling : boolean = true;

  constructor(
    public bottomSheet : MatBottomSheet,
    public location: Location,
    public dialog: MatDialog
  ) {
   this._subscriptions  = new Array<Subscription>();
   effect(()=>{
    if(this.loginStatus() && this.isFirstTimeCalling){
         this.isFirstTimeCalling = false;
         this._subscriptions.push(this.authService.getAddress(this.userAccount().login).subscribe((addresses) => {

           this.userStore.updateAddresses(addresses);
         }));
       }
  })
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  private _filterStates(value: string): string[] {
    const filterValue = value.toLowerCase();
    
    return this.stateList
    .filter((option: any) => option.name.toLowerCase().startsWith(filterValue.toLowerCase()))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  ngOnInit() {

    this._subscriptions.push(this.authService.getStates('USA').subscribe((states) => {
      this.stateList = [...states];
      this.filteredStateList = [...states];
    }));

   
    this.addressForm = this.fb.group({
      line1: ['', [Validators.required, Validators.maxLength(60)]],
      line2: ['', Validators.maxLength(60)],
      city: ['', [Validators.required, Validators.maxLength(60)]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('(^\\d{6}$)|(^\\d{5}(-\\d{4})?$)')]],
      name: ['', [Validators.required, Validators.maxLength(60)]]
    });

    this._subscriptions.push(this.addressForm.controls['state'].valueChanges.subscribe((value => {
      this.filteredStateList = this._filterStates(value || '');
    })));
    
      // this.addressForm.controls['line1'].setValue(this.address().line1);
      // this.addressForm.controls['line2'].setValue(this.address().line2);
      // this.addressForm.controls['city'].setValue(this.address().city);
      // this.addressForm.controls['state'].setValue(this.address().state);
      this.addressForm.controls['country'].setValue('USA');
      // this.addressForm.controls['zipcode'].setValue(this.address().zipcode);
      // this.addressForm.controls['name'].setValue(this.address().locationName);

      this._subscriptions.push(this.addressForm.controls['country'].valueChanges.subscribe(country => {
        this.authService.getStates(country).subscribe((states) => {
          this.stateList = [...states];
          // if(this.offEdit){
          //   this.addressForm.controls['state'].setValue('');
          // }
        });
      })); 

      this._subscriptions.push(this.authService.getAddress(this.userAccount().login).subscribe((addresses) => {
        
        this.userStore.updateAddresses(addresses);
      }));

      if(this.loginStatus() && !this.address()){
        this._subscriptions.push(this.authService.getAddress(this.userAccount().login).subscribe((addresses) => {
          this.userStore.updateAddresses(addresses);
        }));
      }

  }

ngOnChanges(changes: SimpleChanges): void {
    
}

addNewAddress($event: any){
  this.addressForm.reset();
  this.offEdit = true;

}


saveAddressProfile($event: any){
 
  this.actionInProgress = true;
    let address: Address = new Address();
    address.id = this.address().id;
    address.city = this.addressForm.controls['city'].value;
    address.country = this.addressForm.controls['country'].value;
    address.line1 = this.addressForm.controls['line1'].value;
    address.line2 = this.addressForm.controls['line2'].value;
    address.location = "";
    address.locationName = this.addressForm.controls['name'].value;
    address.name = this.addressForm.controls['name'].value;
    address.ownerId =  this.userAccount().id;
    address.userName =  this.userAccount().login;
    address.state = this.addressForm.controls['state'].value;
    address.zipcode = this.addressForm.controls['zipcode'].value;
    if(address.id){
      this._subscriptions.push(this.authService.updateAddress(address).subscribe((resp) => {
        console.log('Save Bio Profile' + resp);
        this._subscriptions.push(this.authService.getAddress(this.userAccount().login).subscribe((addresses) => {
        this.actionInProgress = false;
        this.offEdit = false;
          this.userStore.updateAddresses(addresses);
        }));
      }));
    }else{
      this._subscriptions.push(this.authService.saveAddress(address).subscribe((resp) => {
        console.log('Save Bio Profile' + resp);
        this._subscriptions.push(this.authService.getAddress(this.userAccount().login).subscribe((addresses) => {
        this.actionInProgress = false;
        this.offEdit = false;

          this.userStore.updateAddresses(addresses);
        }));
      }));
    }
}

editAddressProfile($event: any, address: Address){
    this.addressForm.controls['line1'].setValue(address.line1);
    this.addressForm.controls['line2'].setValue(address.line2);
    this.addressForm.controls['city'].setValue(address.city);
    this.addressForm.controls['state'].setValue(address.state);
    this.addressForm.controls['country'].setValue(address.country);
    this.addressForm.controls['zipcode'].setValue(address.zipcode);
    this.addressForm.controls['name'].setValue(address.locationName);
    this.userStore.setSelectedAddress(address);
     
    this.offEdit = true;
}

removeAddress($event: any, address: Address){

  let dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '250px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result.event);
    if(result.event == 'CONFIRM'){
      if(address.id){
        this.actionInProgress = true;
        this._subscriptions.push(this.authService.removeAddress(address.id).subscribe((resp) => {
          console.log('Save Bio Profile' + resp);
          let index = this.userAddressess().findIndex(obj => obj.id === address.id)
          this.userStore.removeAddress(index);
          this.actionInProgress = false;
        }))
      }
    }
  });
}

cancelChanges($event: any){
    this.offEdit = false;
}

editAddressForm(address : Address){
  this.userStore.setSelectedAddress(address);
  this.editAddress.emit()
}

addAddress($event : any){
  this.userStore.setSelectedAddress(new Address());
  this.editAddress.emit()
}


}
