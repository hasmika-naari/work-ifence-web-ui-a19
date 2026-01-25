import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, Signal, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AchievementBulletPoints, Education, IsSectionPresent, CertificationBulletPoints, Resume, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import Quill from 'quill';
import { SectionDesc } from 'src/app/services/store/user-store';
import { DatePicker } from 'primeng/datepicker';



export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-achievements',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [RouterModule, CarouselModule, ReactiveFormsModule, FormsModule, MatStepperModule, MatFormFieldModule, InputTextModule, TableModule, MatInputModule, ButtonModule, PopoverModule, MatTooltipModule, MatButtonModule, AccordionModule, TextareaModule, DatePicker, MatIconModule, MatExpansionModule, MatAutocompleteModule, MatChipsModule],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AchievementsComponent implements OnInit, OnDestroy {

  resumeForm!: FormGroup;
  contactForm! : FormGroup
  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false
  eduForm!: FormGroup;
  workForm! : FormGroup;
  userProjectForm! : FormGroup
  certificationForm! : FormGroup
 
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  // sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  sections : Signal<SectionDesc[]> = this.userStore.getCurrentSections();
    multipleSections : Signal<SectionDesc[][]> = this.userStore.getMultipleColumnTemplateSections(); 


  outLineButton = true;
  @Output() contact = new EventEmitter();
  @ViewChild('editorContainer', { static: true }) editorContainer?: ElementRef;
  @Input() sectionName : string = '';

  achievementsForm = this._formBuilder.group({
    title: new FormControl('', Validators.required),
    organization: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    section_title: new FormControl('', Validators.required)
  });

  // Form change detection properties
  private originalFormValues: any = {};
  private originalEditorContent: string = '';
  hasFormChanged = false;


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
          if(this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'){
            this.setAchievements()
          }
          else if(this.sectionName == 'CERTIFICATIONS_BULLET_POINTS'){
            this.setCertification()
          }
        })
      }

  
  ngOnDestroy(): void {
    // this.subs.forEach(s => s.unsubscribe());
  }

  private setupFormChangeDetection(): void {
    // Subscribe to form value changes
    this.achievementsForm.valueChanges.subscribe(() => {
      this.checkForFormChanges();
    });

    // Capture initial form values after they are set
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }

  private captureOriginalFormValues(): void {
    this.originalFormValues = { ...this.achievementsForm.value };
    this.originalEditorContent = this.editor?.getContents()?.ops ? JSON.stringify(this.editor.getContents().ops) : '';
    this.hasFormChanged = false;
  }

  private checkForFormChanges(): void {
    const currentValues = this.achievementsForm.value;
    const currentEditorContent = this.editor?.getContents()?.ops ? JSON.stringify(this.editor.getContents().ops) : '';
    
    const formChanged = JSON.stringify(currentValues) !== JSON.stringify(this.originalFormValues);
    const editorChanged = currentEditorContent !== this.originalEditorContent;
    
    this.hasFormChanged = formChanged || editorChanged;
  }

  getButtonTooltip(): string {
    if (this.achievementsForm.invalid) {
      return 'Please fill in all required fields';
    }
    if (!this.hasFormChanged) {
      return 'No changes to save';
    }
    return 'Add to Resume';
  }



  ngOnInit() {
    this.achievementsForm.controls['section_title'].setValue(this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'? 'Achievements' : 'Certifications');
    this.achievementsForm.enable();
    this.setupFormChangeDetection();
  }



  setAchievements() {
    // Find the ACHIEVEMENTS_BULLET_POINTS section and get its first item's data
    const achSection = this.sections().find((section: any) => section.section === 'ACHIEVEMENTS_BULLET_POINTS');
    const achItem = achSection?.items && achSection.items.length > 0 ? achSection.items[0].data : null;
    if (achItem) {
      this.achievementsForm.patchValue({
        title: achItem.title || '',
        organization: achItem.organization || '',
        year: achItem.year || '',
      });
    }
    let section_title;
    if (this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9') {
      this.multipleSections().map((e: SectionDesc[]) => {
        e.map((section: SectionDesc) => {
          if (section.section == 'ACHIEVEMENTS_BULLET_POINTS') {
            section_title = section.editable_section_title
          }
        })
      })
    } else {
      this.sections().map((section: SectionDesc) => {
        if (section.section == 'ACHIEVEMENTS_BULLET_POINTS') {
          section_title = section.editable_section_title
        }
      })
    }
    this.achievementsForm.controls['section_title'].setValue(section_title ?? 'Achievements');
  }

setCertification(){
  if(this.editor?.clipboard){
    // Find the CERTIFICATIONS_BULLET_POINTS section and get its first item's data
    const certSection = this.sections().find((section: any) => section.section === 'CERTIFICATIONS_BULLET_POINTS');
    const certItem = certSection?.items && certSection.items.length > 0 ? certSection.items[0].data : null;
    if(certItem && certItem.original_html_content) {
      this.editor.clipboard.dangerouslyPasteHTML(certItem.original_html_content);
    }
  }
  let section_title;
    if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
      this.multipleSections().map((e : SectionDesc[])=>{
        e.map((section : SectionDesc)=>{
          if(section.section == 'CERTIFICATIONS_BULLET_POINTS'){
            section_title = section.editable_section_title
          }
        })
      })
    }
    else{
      this.sections().map((section : SectionDesc)=>{
          if(section.section == 'CERTIFICATIONS_BULLET_POINTS'){
            section_title = section.editable_section_title
          }
        })
    }
    this.achievementsForm.controls['section_title'].setValue(section_title??'Certifications')
}



 




  saveAndContinue(){
  if(this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'){
      // Read form fields
      const formValue = this.achievementsForm.value;

  let achievement = new AchievementBulletPoints();
      achievement.title = formValue.title || '';
      achievement.organization = formValue.organization || '';
      // If year is a Date object, extract year as string
      if (formValue.year && typeof formValue.year === 'object' && typeof (formValue.year as Date).getFullYear === 'function') {
        achievement.year = String((formValue.year as Date).getFullYear());
      } else if (typeof formValue.year === 'string') {
        achievement.year = formValue.year;
      } else {
        achievement.year = '';
      }
  achievement.isDefault = !formValue.title;

      // Find the section and items
      const achSection = this.sections().find((section: any) => section.section === 'ACHIEVEMENTS_BULLET_POINTS');
      let items = achSection?.items ? [...achSection.items] : [];

      // Check if editing (has selected index or id)
      let editIndex = -1;
      if (items.length > 0) {
        // Try to find by id or just update first for now
        editIndex = 0;
      }

      let sectionItem;
      if (editIndex >= 0) {
        // Update existing
        sectionItem = { ...items[editIndex], data: achievement };
        items[editIndex] = sectionItem;
      } else {
        // Add new
        sectionItem = { id: 'ach_' + Date.now(), data: achievement };
        items.push(sectionItem);
      }

      // LOG: Show what is being sent to the store
      console.log('Achievement to store:', achievement);
      console.log('Section item:', sectionItem);
      console.log('All items:', items);

      // Update the section's items and store
      const updatedSections = this.sections().map((section: any) => {
        if (section.section === 'ACHIEVEMENTS_BULLET_POINTS') {
          return { ...section, items };
        }
        return section;
      });
      console.log('Updated sections:', updatedSections);
      this.userStore.setResumeSections(updatedSections);

      if(!this.sectionStatus().isAchievement){
        let status = this.sectionStatus()
        status.isAchievement = true;
        this.userStore.updateSectionStatus(status);
      }
    }
    if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
          this.multipleSections().map((e : SectionDesc[])=>{
            e.map((section : SectionDesc)=>{
              if(section.section == this.sectionName){
                section.editable_section_title = this.achievementsForm.controls['section_title'].value??this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'? 'Achievements' : 'Certifications'
              }
            })
          })
          this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
        }
        else{
          this.sections().map((section : SectionDesc)=>{
              if(section.section == this.sectionName){
               section.editable_section_title = this.achievementsForm.controls['section_title'].value??this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'? 'Achievements' : 'Certifications'
              }
            })
          this.userStore.setResumeSections(this.sections())
        }
    this.contact.emit();
    
    // Capture new baseline after saving
    this.captureOriginalFormValues();
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
    if (isPlatformBrowser(this.platformId) && this.editorContainer?.nativeElement) {
      const Quill = (await import('quill')).default; // Dynamically import Quill

      this.editor = new Quill(this.editorContainer.nativeElement, {
        theme: 'snow',
        placeholder: this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'? 'Describe your achievements and accomplishments...' : 'Describe your certifications and qualifications...', // Set placeholder text
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Text formatting
            [{ 'header': [1, 2, 3, false] }], // Headers
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists
            [{ 'indent': '-1' }, { 'indent': '+1' }], // Indentation
            ['link'], // Links
            ['clean'] // Remove formatting
          ],
        },
      });

      // If you want to keep the Quill editor for a description field, add a new field and sync here. Otherwise, remove this block.

      // Setup form change detection after editor is ready
      this.setupFormChangeDetection();
    }

    if(this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'){
      this.setAchievements()
    }
    else if(this.sectionName == 'CERTIFICATIONS_BULLET_POINTS'){
      this.setCertification()
    }

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
    if (!this.editor) return '';
    return this.editor.root.innerHTML;
  }
  

  logContent(): void {
    console.log(this.achievementsForm.get('achievements')?.value);
  }
}
