import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
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
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeContactComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeForm : Signal<Resume> = this.userStore.getResumeForm();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();


  visible = true;
  outLineButton = true;
  @Output() contact = new EventEmitter();

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog) {
        effect(()=>{
          this.setContactValues()
        })
      }

 
  profile_summary_genai : Array<String> | null = null 
  is_summary_loading : boolean = false;

  isSummarySkipped : boolean = false;

  subs: Array<Subscription> = [];

  contactForm = this._formBuilder.group({
    fname: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
    lname: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]],
    subTitle: [''],
    phone_number: ['', Validators.pattern('^(?:(?:\\+91|91|0)?\\d{10})$|^(?:(?:\\+1|1)?[-.\\s]?(\\d{3}|\\(\\d{3}\\))[-.\\s]?\\d{3}[-.\\s]?\\d{4})$')],
    email_address: ['', Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')],
    address: [''],
    role: [''],
    linkedIn_profile: ['', Validators.pattern('^https:\\/\\/(www\\.)?linkedin\\.com\\/in\\/[a-zA-Z0-9-]+\\/?$')],
    github_profile: ['', Validators.pattern('^https:\\/\\/github\\.com\\/[a-zA-Z0-9-]+\\/?$')],
    portfolio_url: ['', Validators.pattern('^https?:\\/\\/(www\\.)?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(\\/[a-zA-Z0-9._~-]*)*\\/?$')],
    linkedIn_profile_display_name : [''],
    github_profile_display_name : ['']
});


  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
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
    // this.userStore.updateSidebar(true);
  }

  onRowSelect(event: TableRowSelectEvent, op: OverlayPanel) {
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
    op.hide();
}

  setContactValues(){
    if(!this.resumeForm().contact.isDefaultData){
      this.contactForm.controls['address'].setValue(this.resumeForm().contact.address);
      this.contactForm.controls['email_address'].setValue(this.resumeForm().contact.email);
      this.contactForm.controls['github_profile'].setValue(this.resumeForm().contact.github_profile);
      this.contactForm.controls['linkedIn_profile'].setValue(this.resumeForm().contact.linkedIn_profile);
      this.contactForm.controls['subTitle'].setValue(this.resumeForm().contact.subTitle);
      this.contactForm.controls['fname'].setValue(this.resumeForm().contact.fname);
      this.contactForm.controls['lname'].setValue(this.resumeForm().contact.lname);
      this.contactForm.controls['phone_number'].setValue(this.resumeForm().contact.phone_number);
      this.contactForm.controls['portfolio_url'].setValue(this.resumeForm().contact.portfolio_link);
      this.contactForm.controls['role'].setValue(this.resumeForm().contact.role);
      this.contactForm.controls['linkedIn_profile_display_name'].setValue(this.resumeForm().contact.linkedIn_profile_display_name);
      this.contactForm.controls['github_profile_display_name'].setValue(this.resumeForm().contact.github_profile_display_name);
    }
  }

  saveAndContinue(display : String | null){
    this.markFormGroupTouched(this.contactForm);
    
    // if (this.contactForm.invalid) {
    //   return;
    // }
      let resumeContact: ResumeContact = new ResumeContact();
      resumeContact.fname =  this.contactForm.value.fname?this.contactForm.value.fname?.trim() : '';
      resumeContact.lname =  this.contactForm.value.lname?this.contactForm.value.lname?.trim() : '';
      resumeContact.subTitle =  this.contactForm.value.subTitle?this.contactForm.value.subTitle:'';
      resumeContact.phone_number =  this.contactForm.value.phone_number?this.contactForm.value.phone_number : "";
      resumeContact.email =  this.contactForm.value.email_address?this.contactForm.value.email_address : "";
      resumeContact.linkedIn_profile =  this.contactForm.value.linkedIn_profile?this.contactForm.value.linkedIn_profile : "";
      resumeContact.github_profile =  this.contactForm.value.github_profile?this.contactForm.value.github_profile : "";
      resumeContact.portfolio_link =  this.contactForm.value.portfolio_url?this.contactForm.value.portfolio_url : "";
      resumeContact.linkedIn_profile_display_name = this.contactForm.value.linkedIn_profile_display_name?this.contactForm.value.linkedIn_profile_display_name:"";
      resumeContact.github_profile_display_name = this.contactForm.value.github_profile_display_name?this.contactForm.value.github_profile_display_name:"";
      resumeContact.address = this.contactForm.value.address?this.contactForm.value.address:"";
      resumeContact.isDefaultData = false
      

      this.userStore.addContact(resumeContact);
      if(!this.sectionStatus().isContact){
        let status = this.sectionStatus()
        status.isContact = true;
        this.userStore.updateSectionStatus(status);
      }
      this.contact.emit();

  }

  onFileSelected(event: any) {
    this.showProfileImage = true;
    const file: File = event.target.files[0];
    if (file) {
      this.convertImageToBase64(file);
    }
  }

  convertImageToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer: ArrayBuffer | null = reader.result as ArrayBuffer; // Get the ArrayBuffer
      if (arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer); // Create a Uint8Array view
        this.imageBase64 = this.arrayBufferToBase64(uint8Array); // Convert to base64
        console.log('Image converted to base64:', this.imageBase64);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  getImageBase64(){
    return "data:image/png;base64, " + this.imageBase64;
  }

  arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    buffer.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
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
