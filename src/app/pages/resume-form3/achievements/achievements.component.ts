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
import { AchievementBulletPoints, Education, IsSectionPresent, CertificationBulletPoints, Resume, TemplateVariables } from 'src/app/services/resume.model';
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
  selector: 'app-resume-achievements',
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


  outLineButton = true;
  @Output() contact = new EventEmitter();
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @Input() sectionName : string = '';

  achievementsForm = this._formBuilder.group({
    'achievements' : new FormControl('')
  })


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
          else if(this.sectionName == 'CERTIFICATION_BULLET_POINTS'){
            this.setCertification()
          }
        })
      }

  
  ngOnDestroy(): void {
    // this.subs.forEach(s => s.unsubscribe());
  }



  ngOnInit() {
    
  
  }



setAchievements(){
  if(this.editor?.clipboard){
    this.editor.clipboard.dangerouslyPasteHTML(this.resumeSignalForm().achievementBulletPoints.original_html_achievement);
  }
}

setCertification(){
  if(this.editor?.clipboard){
    this.editor.clipboard.dangerouslyPasteHTML(this.resumeSignalForm().certificationBulletPoints.original_html_content);
  }
}



 




  saveAndContinue(){
    let des = this.getEditorData();
    console.log(des);
    if(this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'){
      let achievement = new AchievementBulletPoints();
    if(des.includes('data-list="bullet"')){
      const correctedHTML = des.replace('<ol>', '<ul>').replace("</ol>", '</ul>');
      achievement.ach = correctedHTML.length>0? correctedHTML : "";
    }
    else{
      achievement.ach = des.length>0? des : "";
    }
    achievement.original_html_achievement = des;
    if(des.length > 0){
      achievement.isDefault = false
    }
    else{
      achievement.isDefault = true
    }
    this.userStore.addAchievement(achievement);
    if(!this.sectionStatus().isAchievement){
      let status = this.sectionStatus()
      status.isAchievement = true;
      this.userStore.updateSectionStatus(status);
    }
    }
    else if(this.sectionName == 'CERTIFICATION_BULLET_POINTS'){
      let certification = new CertificationBulletPoints();
    if(des.includes('data-list="bullet"')){
      const correctedHTML = des.replace('<ol>', '<ul>').replace("</ol>", '</ul>');
      certification.point = correctedHTML.length>0? correctedHTML : "";
    }
    else{
      certification.point = des.length>0? des : "";
    }
    certification.original_html_content = des;
    if(des.length > 0){
      certification.isDefault = false
    }
    else{
      certification.isDefault = true
    }
    this.userStore.addCertificationBulletPoints(certification);
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
        placeholder: this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'?'Achievements' : 'Certifications', // Set placeholder text
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // Text formatting
            [{ list: 'ordered' }, { list: 'bullet' }] // Ordered and unordered lists
          ],
        },
      });


      // Sync editor achievements with FormControl
      this.editor.on('text-change', () => {
        this.achievementsForm.get('achievements')?.setValue(this.editor.root.innerHTML, { emitEvent: false });
      });

      // Sync FormControl value changes with Quill
      this.achievementsForm.get('achievements')?.valueChanges.subscribe((value) => {
        if (this.editor.root.innerHTML !== value) {
          this.editor.root.innerHTML = value || '';
        }
      });
    }

    if(this.sectionName == 'ACHIEVEMENTS_BULLET_POINTS'){
      this.setAchievements()
    }
    else if(this.sectionName == 'CERTIFICATION_BULLET_POINTS'){
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
    return this.editor.root.innerHTML;
  }
  

  logContent(): void {
    console.log(this.achievementsForm.get('achievements')?.value);
  }
}
