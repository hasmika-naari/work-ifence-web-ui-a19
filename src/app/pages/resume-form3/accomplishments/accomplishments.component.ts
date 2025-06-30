import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, Signal, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { map, Observable, startWith, Subscription } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Accomplishment, AchievementBulletPoints, Education, IsSectionPresent, CertificationBulletPoints, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Quill from 'quill';



export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-accomplishments',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, MatAutocompleteModule, MatChipsModule],
  templateUrl: './accomplishments.component.html',
  styleUrls: ['./accomplishments.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AccomplishmentsComponent implements OnInit, OnDestroy {

  resumeForm!: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('autoskills') matAutocomplete! : MatAutocomplete;

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  // sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  selectedAccomplishment : Signal<Accomplishment> = this.userStore.getSelectedAccomplishment();


  outLineButton = true;
  @Output() contact = new EventEmitter();
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  private editor!: Quill;

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog,
      @Inject(PLATFORM_ID) private platformId: Object) {
        effect(()=>{
            this.setAccomplishments()
        })
      }

  accomplishmentForm = this._formBuilder.group({
    acplsmnt : [''],
    date : [''],
    accomplishments: ['']
  })
  
  is_achievement_loading : boolean = false;

  subs: Array<Subscription> = [];

  
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        // The current active route matches the desired route
        // console.log('Current route matches the desired route');
        // this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        // this.userStore.updateSidebar(false);
        // The current active route does not match the desired route
        console.log('Current route does not match the desired route');
      }
    }));
  }

setAccomplishments(){
  this.accomplishmentForm.controls['acplsmnt'].setValue(this.selectedAccomplishment().accomplisment);
  this.accomplishmentForm.controls['date'].setValue(this.selectedAccomplishment().date);
  if(this.editor?.clipboard){
    this.editor.clipboard.dangerouslyPasteHTML(this.selectedAccomplishment().original_html_description);
  }
}

setSkillsCategory(){
  if(this.editor?.clipboard){
    this.editor.clipboard.dangerouslyPasteHTML(this.resumeSignalForm().certificationBulletPoints.original_html_content);
  }
}

  saveAndContinue(){
    let des = this.getEditorData();
      console.log(des);
      let accom = new Accomplishment();
      if(des.includes('data-list="bullet"')){
        const correctedHTML = des.replace('<ol>', '<ul>').replace("</ol>", '</ul>');
        accom.description = correctedHTML.length>0? correctedHTML : "";
      }
      else{
        accom.description = des.length>0? des : "";
      }
      accom.original_html_description = des;
      if(des.length > 0){
        accom.isDefault = false
      }
      else{
        accom.isDefault = true
      }
      accom.accomplisment = this.accomplishmentForm.controls['acplsmnt'].value?this.accomplishmentForm.controls['acplsmnt'].value : '';
      accom.date = this.accomplishmentForm.controls['date'].value?this.accomplishmentForm.controls['date'].value : '';
      accom.isDefault = false;
      accom.isHideSelected = false;
    if(this.selectedAccomplishment().id){
      accom.id = this.selectedAccomplishment().id;
      let index = this.resumeSignalForm().accomplishment.findIndex(obj => obj.id === this.selectedAccomplishment().id)
      this.userStore.updateAccomplishmentItem(accom, index);
    }
    else{ 
      accom.id = (this.resumeSignalForm().accomplishment.length + 1).toString()
      this.userStore.addAccomplishmentItem(accom);
    }
    this.userStore.setSelectedAccomplishment(new Accomplishment());
    this.accomplishmentForm.reset()
    if(!this.sectionStatus().isAccomplishments){
      let status = this.sectionStatus()
      status.isAccomplishments = true;
      this.userStore.updateSectionStatus(status);
    }
    this.contact.emit();
  }


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  

  goback($event: any){
    this.userStore.updateSidebar(false);
    this.router.navigateByUrl('/user/resumes');
  }


  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const Quill = (await import('quill')).default; // Dynamically import Quill
      this.editor = new Quill(this.editorContainer.nativeElement, {
        theme: 'snow',
        placeholder: 'Description', // Set placeholder text
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // Text formatting
            [{ list: 'ordered' }, { list: 'bullet' }] // Ordered and unordered lists
          ],
        },
      });


      // Sync editor accomplishments with FormControl
      this.editor.on('text-change', () => {
        this.accomplishmentForm.get('accomplishments')?.setValue(this.editor.root.innerHTML, { emitEvent: false });
      });

      // Sync FormControl value changes with Quill
      this.accomplishmentForm.get('accomplishments')?.valueChanges.subscribe((value) => {
        if (this.editor.root.innerHTML !== value) {
          this.editor.root.innerHTML = value || '';
        }
      });
    }

    this.setAccomplishments()
  }

  getEditorRawData(): string {
    // const html = this.editor.root.innerHTML; 
    const rawText = this.editor.getText().trim(); // Plain text (removes formatting and extra whitespace)
    return rawText;
  }

  setDataInEditor(sentences: string[]): void {
    if (this.editor) {
      // Convert sentences to HTML
      const html = sentences.map((sentence) => `<p>${sentence}</p>`).join('');
      this.editor.clipboard.dangerouslyPasteHTML(html); // Set the HTML description in the editor
    }
  }

  getEditorData(){
    return this.editor.root.innerHTML;
  }
  

  logContent(): void {
    console.log(this.accomplishmentForm.get('accomplishments')?.value);
  }
}
