import { Input } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';

// (removed misplaced method)
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map, startWith } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { JobApplication, JobApplicationDetails, Resume, ResumeContact } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JobApplicationStatus, JobMode, JobType, ResumeAccess, ResumeCategory, ResumeRoleLevel } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment from 'moment';
import { Account, LoginProfile } from 'src/app/services/profile.model';
import { ResumeService } from 'src/app/services/resume.service';
import { AuthService } from 'src/app/services/auth.service';
import { Address } from 'src/app/services/contact.model';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';

export interface Country {
  name : string
  code : string
}

@Component({
  selector: 'app-address-form-editor',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,
    MatCheckboxModule, MatAutocompleteModule, AutoCompleteModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,TextareaModule,InputIconModule,
    IconFieldModule,FloatLabelModule,DropdownModule,
    MatIconModule,MatExpansionModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './address-form-editor.component.html',
  styleUrls: ['./address-form-editor.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AddressFormEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() isActionInProgress: boolean = false;
  ngAfterViewInit() {
    // Ensure ViewChild is available and triggers change detection if needed
    // This is required for showPanel to work reliably
  }

  @ViewChild('countryAuto') countryAuto: any;
  @ViewChild('stateAuto') stateAuto: any;

  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  jobApplication : Signal<JobApplication> = this.userStore.getSelectedJobApplication();
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  visible = true;
  outLineButton = true;
  address : Signal<Address> = this.userStore.getSelectedAddresses();
  userAddressess : Signal<Address[]> = this.userStore.getUserAddresses();

  @Output() actionInProgress = new EventEmitter();
  @Output() formSaved = new EventEmitter();
  @Output() formClosed = new EventEmitter();

  // List of states in the USA
usaStates: { label: string, value: string }[] = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
  ].map(s => ({ label: s, value: s }));
  
  // List of states in India
  indiaStates: { label: string, value: string }[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ].map(s => ({ label: s, value: s }));
  
  // Union Territories in India
  indiaUTs: { label: string, value: string }[] = [
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ].map(s => ({ label: s, value: s }));

  states : { label: string, value: string }[] = [];

  countries : { label: string, value: string }[] = [
    { label: 'India', value: 'INDIA' },
    { label: 'United States', value: 'USA' }
  ];

  filteredCountries: { label: string, value: string }[] = [...this.countries];
  filteredStates: { label: string, value: string }[] = [];


  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog,
      public resumeService : ResumeService,
      public authService : AuthService) {
        effect(()=>{
          this.setAddressForm()
        })
      }

 
  subs: Array<Subscription> = [];

  addressForm = this._formBuilder.group({
    address_name: ['', Validators.required],
    address_line1: ['', Validators.required],
    address_line2 : [''],
    city : ['', Validators.required],
    state : [null as {label: string, value: string} | null, Validators.required],
    country : [null as {label: string, value: string} | null, Validators.required],
    zipcode : ['', Validators.required]
  })

  filterCountry(event: any) {
    const query = event.query?.toLowerCase() || '';
    if (query) {
      this.filteredCountries = this.countries.filter(c => c.label.toLowerCase().includes(query));
    } else {
      this.filteredCountries = [...this.countries];
    }
  }

  onCountryFocus() {
    // Show initial list if input is empty
    if (!this.addressForm.controls['country'].value) {
      this.filterCountry({ query: '' });
    }
    if (this.countryAuto && typeof this.countryAuto.show === 'function') {
      this.countryAuto.show();
    }
  }

  onCountrySelect() {
    // Always set the selected country as the full object
    const selectedCountry = this.addressForm.controls['country'].value;
    const selectedValue = typeof selectedCountry === 'string' ? selectedCountry : selectedCountry?.value;
    const selected = this.countries.find(c => c.value === selectedValue) || null;
    this.addressForm.controls['country'].setValue(selected);
    this.addressForm.controls['state'].setValue(null);
    if (selected?.value === 'INDIA') {
      this.states = [...this.indiaStates];
      this.filteredStates = [...this.indiaStates];
    } else if (selected?.value === 'USA') {
      this.states = [...this.usaStates];
      this.filteredStates = [...this.usaStates];
    } else {
      this.states = [];
      this.filteredStates = [];
    }
    setTimeout(() => {
      this.countryAuto?.hide?.();
    }, 50);
  }

  filterState(event: any) {
    const query = event.query?.toLowerCase() || '';
    if (query) {
      this.filteredStates = this.states.filter(s => s.label.toLowerCase().includes(query));
    } else {
      this.filteredStates = [...this.states];
    }
  }

  onStateFocus() {
    // Always show all states for the selected country on focus
    this.filterState({ query: '' });
    // Blur country input to prevent its panel from opening
    if (this.countryAuto && this.countryAuto.el && this.countryAuto.el.nativeElement) {
      const input = this.countryAuto.el.nativeElement.querySelector('input');
      if (input) input.blur();
    }
    if (this.stateAuto && typeof this.stateAuto.show === 'function') {
      this.stateAuto.show();
    }
  }

  onStateSelect() {
    // Always set the selected state as the full object
    const stateValue = this.addressForm.controls['state'].value;
    let selected = null;
    if (typeof stateValue === 'string') {
      selected = this.states.find(s => s.value === stateValue) || null;
    } else {
      selected = this.states.find(s => s.value === stateValue?.value) || null;
    }
    this.addressForm.controls['state'].setValue(selected);
    setTimeout(() => {
      this.stateAuto?.hide?.();
    }, 50);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());

  }

  toggle() {
}

  ngOnInit() {
    // this.setAddressForm();
    this.addressForm.controls['country'].valueChanges.subscribe(val => {
      this.addressForm.controls['state'].setValue(null);
      if(val?.value === 'INDIA'){
        this.states = [...this.indiaStates];
      } else if(val?.value === 'USA'){
        this.states = [...this.usaStates];
      } else {
        this.states = [];
      }
    });
  }



  setAddressForm(){
    this.addressForm.controls['address_name'].setValue(this.address().locationName);
    this.addressForm.controls['address_line1'].setValue(this.address().line1);
    this.addressForm.controls['address_line2'].setValue(this.address().line2);
  // Set country as object
  const countryObj = this.countries.find(c => c.value === this.address().country) || null;
  this.addressForm.controls['country'].setValue(countryObj);
    this.addressForm.controls['city'].setValue(this.address().city);
    this.addressForm.controls['zipcode'].setValue(this.address().zipcode);
    if(this.address().country == 'INDIA'){
      this.states = [...this.indiaStates];
    }
    else if(this.address().country == 'USA'){
      this.states = [...this.usaStates];
    }
    // Set state as object
    const stateObj = this.states.find(s => s.value === this.address().state) || null;
    this.addressForm.controls['state'].setValue(stateObj);
  }

  saveAddressForm(){
    this.actionInProgress.emit()
    let form : Address = this.address();
    form.locationName = this.addressForm.controls['address_name'].value?this.addressForm.controls['address_name'].value : '';
    form.line1 = this.addressForm.controls['address_line1'].value?this.addressForm.controls['address_line1'].value : '';
    form.line2 = this.addressForm.controls['address_line2'].value?this.addressForm.controls['address_line2'].value : '';
    form.city = this.addressForm.controls['city'].value?this.addressForm.controls['city'].value : '';
  form.state = this.addressForm.controls['state'].value?.value || '';
  form.country = this.addressForm.controls['country'].value?.value || '';
    form.zipcode = this.addressForm.controls['zipcode'].value?this.addressForm.controls['zipcode'].value : '';
    form.ownerId = this.userAccount().id;
    form.userName = this.userAccount().login;

    if(this.address().id){
        this.authService.updateAddress(form).subscribe((e)=>{
            let index = this.userAddressess().findIndex(obj => obj.id === e.id)
            this.userStore.editAddress(e, index);
            this.userStore.setSelectedAddress(new Address());
            this.formSaved.emit()
            this.formClosed.emit();
        })
    }
    else{
        this.authService.saveAddress(form).subscribe((e)=>{
            this.userStore.addAddress(e);
            this.userStore.setSelectedAddress(new Address());
            this.formSaved.emit()
            this.formClosed.emit();
        })
        }    
  }

  // Optional: method to close/cancel the form (e.g. on a cancel button or overlay close)
  closeEditor() {
    this.formClosed.emit();
  }



  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

