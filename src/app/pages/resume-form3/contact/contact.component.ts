import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Subscription } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { IsSectionPresent, Resume, ResumeContact } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-contact',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [RouterModule, CarouselModule, ReactiveFormsModule, FormsModule, MatStepperModule, MatFormFieldModule, InputTextModule, TableModule, MatInputModule, ButtonModule, PopoverModule, MatButtonModule, AccordionModule, TextareaModule, MatIconModule, MatExpansionModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeContactComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subs.forEach(sub => sub.unsubscribe());
  }

  sections: Signal<any[]>;
  imageBase64: string | null = null;
  profileImageSrc: string | null = null;
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  subs: Array<Subscription> = [];
  contactForm = this._formBuilder.group({
    fname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
    lname: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
    subTitle: [''],
    // Fixed phone number regex: properly escape + and use correct digit patterns
    phone_number: ['', Validators.pattern('^(?:(?:\\+91|91|0)?\\d{10})$|^(?:(?:\\+1|1)?[-.\\s]?(\\d{3}|\\(\\d{3}\\))[-.\\s]?\\d{3}[-.\\s]?\\d{4})$')],
    email_address: ['', Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')],
    address: [''],
    role: [''],
    linkedIn_profile: ['', Validators.pattern('^https:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[a-zA-Z0-9-]+\\/?$')],
    github_profile: ['', Validators.pattern('^https:\\/\\/github\\.com\\/[a-zA-Z0-9-]+\\/?$')],
    portfolio_url: ['', Validators.pattern('^https?:\\/\\/(www\\.)?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(\\/[a-zA-Z0-9._~-]*)*\\/?$')],
    linkedIn_profile_display_name: [''],
    github_profile_display_name: ['']
  });
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeForm : Signal<Resume> = this.userStore.getResumeForm();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  visible = true;
  outLineButton = true;
  @Output() contact = new EventEmitter();
  private originalFormValues: any = null;
  private originalImageSrc: string | null = null;
  public hasFormChanged: boolean = false;
  profile_summary_genai : Array<String> | null = null 
  is_summary_loading : boolean = false;
  isSummarySkipped : boolean = false;
  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog) {
        this.sections = this.userStore.getCurrentSections();
        effect(()=>{
          this.setContactValues()
        })
      }
  toggle() {
}

get email_address(){
  return this.contactForm?.get('email_address');
}

  ngOnInit() {
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        // The current active route matches the desired route
        // console.log('Current route matches the desired route');
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        // The current active route does not match the desired route
        console.log('Current route does not match the desired route');
      }
    }));

    // Set up form change detection
    this.setupFormChangeDetection();
    // this.userStore.updateSidebar(true);
  }

  onRowSelect(event: TableRowSelectEvent, op: any) {
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    op.hide();
}

  setContactValues(){
    // Prefer selectedContact from resumeForm if present
    const selectedContact = this.resumeForm()?.selectedContact;
    let contactData = selectedContact;
    if (!contactData) {
      // Fallback to canonical section data (section.data)
      const contactSection = this.sections().find((section: any) => section.section === 'CONTACT');
      contactData = contactSection?.data || {};
    }
    this.contactForm.patchValue({
      address: contactData.address || '',
      email_address: contactData.email_address || contactData.email || '',
      github_profile: contactData.github_profile || '',
      linkedIn_profile: contactData.linkedIn_profile || '',
      subTitle: contactData.subTitle || '',
      fname: contactData.fname || '',
      lname: contactData.lname || '',
      phone_number: contactData.phone_number || '',
      portfolio_url: contactData.portfolio_url || contactData.portfolio_link || '',
      role: contactData.role || '',
      linkedIn_profile_display_name: contactData.linkedIn_profile_display_name || '',
      github_profile_display_name: contactData.github_profile_display_name || ''
    });
    this.profileImageSrc = this.resumeForm()?.imageBase64Encoded || null;
    this.imageBase64 = this.profileImageSrc;
    this.showProfileImage = !!this.profileImageSrc;
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 0);
  }

  private setupFormChangeDetection(): void {
    // Subscribe to form value changes
    this.subs.push(
      this.contactForm.valueChanges.subscribe(() => {
        this.checkForFormChanges();
      })
    );
  }

  private captureOriginalFormValues(): void {
    this.originalFormValues = { ...this.contactForm.getRawValue() };
    this.originalImageSrc = this.profileImageSrc;
    this.hasFormChanged = false;
  }

  private checkForFormChanges(): void {
    if (!this.originalFormValues) {
      this.hasFormChanged = false;
      return;
    }

    const currentValues = this.contactForm.getRawValue();
    this.hasFormChanged = JSON.stringify(this.originalFormValues) !== JSON.stringify(currentValues)
      || this.originalImageSrc !== this.profileImageSrc;
  }

  // Helper method to check if form can be submitted
  public canSubmitForm(): boolean {
    return this.contactForm.valid && this.hasFormChanged;
  }

  // Get appropriate tooltip message for the button
  public getButtonTooltip(): string {
    if (this.contactForm.invalid) {
      return 'Please fix form errors before saving';
    }
    if (!this.hasFormChanged) {
      return 'Make changes to the form to enable saving';
    }
    return 'Click to save changes to your resume';
  }

  saveAndContinue(display : String | null){
    this.markFormGroupTouched(this.contactForm);
    if (this.contactForm.invalid) {
      return;
    }
    let resumeContact: ResumeContact = new ResumeContact();
    resumeContact.fname =  this.contactForm.value.fname?this.contactForm.value.fname?.trim() : '';
    resumeContact.lname =  this.contactForm.value.lname?this.contactForm.value.lname?.trim() : '';
    resumeContact.subTitle =  this.contactForm.value.subTitle?this.contactForm.value.subTitle:'';
    resumeContact.role = this.contactForm.value.role?this.contactForm.value.role:'';
    resumeContact.phone_number =  this.contactForm.value.phone_number?this.contactForm.value.phone_number : "";
    resumeContact.email_address =  this.contactForm.value.email_address?this.contactForm.value.email_address : "";
    resumeContact.email = resumeContact.email_address;
    resumeContact.linkedIn_profile =  this.contactForm.value.linkedIn_profile?this.contactForm.value.linkedIn_profile : "";
    resumeContact.github_profile =  this.contactForm.value.github_profile?this.contactForm.value.github_profile : "";
    resumeContact.portfolio_url =  this.contactForm.value.portfolio_url?this.contactForm.value.portfolio_url : "";
    resumeContact.portfolio_link = resumeContact.portfolio_url;
    resumeContact.linkedIn_profile_display_name = this.contactForm.value.linkedIn_profile_display_name?this.contactForm.value.linkedIn_profile_display_name:"";
    resumeContact.github_profile_display_name = this.contactForm.value.github_profile_display_name?this.contactForm.value.github_profile_display_name:"";
    resumeContact.address = this.contactForm.value.address?this.contactForm.value.address:"";
    resumeContact.isDefaultData = false

    // Update CONTACT section's data in selectedResume.sections
    const resume = this.resumeForm();
    if (resume && Array.isArray(resume.sections)) {
      const updatedSections = resume.sections.map((section: any) => {
        if (section.section !== 'CONTACT') {
          return section;
        }

        return {
          ...section,
          data: { ...resumeContact }
        };
      });

      this.userStore.updateResumeForm({
        ...resume,
        sections: updatedSections,
        imageBase64Encoded: this.profileImageSrc,
        selectedContact: undefined
      });
    }

    if(!this.sectionStatus().isContact){
      let status = this.sectionStatus()
      status.isContact = true;
      this.userStore.updateSectionStatus(status);
    }

    // Reset form change tracking after successful save
    this.captureOriginalFormValues();
    this.contact.emit();

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.convertImageToBase64(file);
    }
  }

  convertImageToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.imageBase64 = reader.result;
        this.profileImageSrc = reader.result;
        this.showProfileImage = true;
        this.checkForFormChanges();
      }
    };
    reader.readAsDataURL(file);
  }

  getImageBase64(){
    return this.profileImageSrc || 'assets/img/home/profile_fake.png';
  }

  removeSelectedImage(): void {
    this.imageBase64 = null;
    this.profileImageSrc = null;
    this.showProfileImage = false;
    this.checkForFormChanges();
  }

  get profileInitials(): string {
    const firstInitial = this.contactForm.value.fname?.trim()?.charAt(0) || '';
    const lastInitial = this.contactForm.value.lname?.trim()?.charAt(0) || '';
    const initials = `${firstInitial}${lastInitial}`.toUpperCase();
    return initials || 'WF';
  }

  get hasProfileImage(): boolean {
    return !!this.profileImageSrc;
  }

  onSubmit(){

  }

  saveForm(){
    
  }

  back(){
    console.log(this.cPage);
    
    if(this.cPage == 0){
      this.router.navigateByUrl("/resume-templates")
    }
    this.cPage = this.cPage - 2;
  }

  parseResponse(response : any) : any{
    try {
      // Attempt to parse the response as JSON
      return JSON.parse(response);
    } catch (error) {
      // If parsing fails, check if the response is wrapped in triple backticks and try to parse again
      const trimmedResponse = response.replaceAll('`', '').trim()
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      console.log(trimmedResponse);
      console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      
      
      
      if (trimmedResponse.startsWith('json')) {
        const jsonContent = trimmedResponse.slice(4,);
        console.log("-----------------------------------------------------------------------------");
        console.log(jsonContent);
        console.log("-----------------------------------------------------------------------------");
        return JSON.parse(jsonContent);
      }
      else if (trimmedResponse.startsWith('JSON')) {
        const jsonContent = trimmedResponse.slice(4, );
        console.log("-----------------------------------------------------------------------------");
        console.log(jsonContent);
        console.log("-----------------------------------------------------------------------------");
        return JSON.parse(jsonContent);
      }
      else
      {
        return JSON.parse(trimmedResponse.replaceAll('`', "").trim());
      }

    }
  }

  optimizeText(step : any) : void{
   
  }

  goback($event: any){
    this.userStore.updateSidebar(false);
    this.router.navigateByUrl('/user/resumes');
  }

  handleGenAIResponse(step : String, selectedAIResponse : any){
  
  }

  closeSheet(){
    const sheet = document.getElementById("sheet");
    if (sheet) {
      sheet.classList.remove("open");
    }
  }

  currentTab = 'tab1';
  switchTab(event: MouseEvent, tab: string) {
      event.preventDefault();
      this.currentTab = tab;
  }

  // changeHandler(){
  //   let contact : ResumeContact = new ResumeContact();
  //   contact.address = this.contactForm.controls['address'].value?this.contactForm.controls['address'].value : "";
  //   contact.email = this.contactForm.controls['email_address'].value;
  //   contact.github_profile = this.contactForm.controls['github_profile'].value;
  //   contact.linkedIn_profile = this.contactForm.controls['linkedIn_profile'].value;
  //   contact.name = this.contactForm.controls['fname'].value + " " + this.contactForm.controls['lname'].value;
  //   contact.phone_number = this.contactForm.controls['phone_number'].value;
  //   contact.portfolio_link = this.contactForm.controls['portfolio_url'].value;
  //   contact.role = this.contactForm.controls['role'].value;

  //   this.userStore.addContact(contact);
  //   this.contact.emit(contact);

  //   console.log("*************************************");
    
  // }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
