import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, SimpleChanges, ViewChild, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Education, IsSectionPresent, JobDescriptionAIResponse, Resume, SkillV2, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SectionDesc } from 'src/app/services/store/user-store';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

export interface Skill {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-resume-skills',
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
    MatFormFieldModule,InputTextModule,TableModule, DragDropModule,
    MatInputModule,ButtonModule,OverlayPanelModule,MatTooltipModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, MatAutocompleteModule, MatChipsModule, MatAutocompleteModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class SkillsComponent implements OnInit, OnDestroy {

  @ViewChild('sectionAuto') sectionAutocomplete!: MatAutocomplete;

  // Skills bullet points properties
  skillsBulletPoints: string[] = [];
  originalSkillsBulletPoints: string[] = [];

  // Regular skills properties
  fruits: Array<Skill> = [];
  originalFruits: Array<Skill> = [];

  // Form change detection properties
  private originalFormValues: any = {};
  hasFormChanged = false;

  draggingIndex2: number | null = null; // Stores the position where placeholder should appear

  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private router: Router = inject(Router);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  jobDescAISuggestions : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();
  sections : Signal<SectionDesc[]> = this.userStore.getCurrentSections();
  multipleSections : Signal<SectionDesc[][]> = this.userStore.getMultipleColumnTemplateSections(); 

  @Output() contact = new EventEmitter();
  @Output() skillsReordered = new EventEmitter<string[]>();
  onSkillsReordered(event: CdkDragDrop<string[]>) {
    this.dropSkill(event);
    this.skillsReordered.emit([...this.skillsBulletPoints]);
  }

  @Input()
  skillsValue! : number

  @Input()
  sectionName : string = ''
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  isSuffixVisible: boolean | string = false;

  selectable = true;
  removable = true;
  selectableAI = true;
  removableAI = false;
  selectedSkills: Skill[] = [];
  skills: Skill[] = [];
  skills_v2 : SkillV2[] = [];

  isEditSubTitle : boolean = false;
  old_subTitle  : string = ""

  filteredSectionOptions!: Observable<string[]>;

  subs: Array<Subscription> = [];


  skillsForm = this._formBuilder.group({
    skills: [''],
    sub_title : [''],
    skillsv2 : [''],
    section_title : ['Skills', Validators.required]
  });

  // Skill section suggestions
  sectionOptions: string[] = [
    'Programming Languages',
    'Frameworks & Libraries', 
    'DevOps & Cloud',
    'Databases',
    'Web Technologies',
    'Mobile Development',
    'Design & UI/UX',
    'Data Science & Analytics',
    'Machine Learning & AI',
    'Software Testing',
    'Operating Systems',
    'Version Control',
    'Project Management',
    'Cybersecurity',
    'Network & Infrastructure',
    'Business Intelligence',
    'APIs & Integration',
    'Technical Writing',
    'Languages',
    'Certifications'
  ];

  toggleSkill(skill: any): void {
    // Toggle the skill between selected and deselected
    if (!skill.selected) {
      this.onSkillSelected(skill); // Call the handler for selected skill
    } else {
      this.onSkillDeselected(skill); // Call the handler for deselected skill
    }
  }

  onSkillSelected(skill: Skill): void {
    // Handle the case when a skill is selected
    skill.selected = true;
    if(skill.name){
      if (!this.fruits.some(fruit => fruit.name === skill.name)) {
        this.add(skill);
      }
    }
    console.log(`${skill.name} selected`);
    
    // Add any other logic needed when a skill is selected
    // Example: API call to save selected skill or update the UI
  }

  onSkillDeselected(skill: Skill): void {
    // Mark the skill as deselected
    skill.selected = false;
  
    // Update the corresponding skill in the `skills` array
    this.skills = this.skills.map(e => (e.name === skill.name ? skill : e));
  
    // Remove the skill from `fruits` if it exists
    const fruitIndex = this.fruits.findIndex(fruit => fruit.name === skill.name);
    if (fruitIndex !== -1) {
      this.fruits.splice(fruitIndex, 1); // Remove the skill by index
      this.checkForFormChanges(); // Trigger change detection
    }
  
    // Add any additional logic if needed
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  ngOnInit() {
    this.getAISkills();
    console.log(this.sectionName);
    this.skillsForm.controls['skillsv2'].disable();
    
    // Load data based on section name
    if (this.sectionName === 'SKILLS_BULLET_POINTS') {
      this.setSkillsBulletPointsValues();
    } else if (this.sectionName === 'SKILLS_CATEGORY') {
      this.setSkillsValues();
      this.setSkillsV2Values();
    }
    
    // Initialize section title autocomplete
    this.filteredSectionOptions = this.skillsForm.controls['section_title'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterSectionOptions(value || ''))
    );
    
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        console.log('Current route does not match the desired route');
      }
    }));

    this.filteredOptions = this.skillsForm.controls['sub_title'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.skillsForm.controls['sub_title'].valueChanges.subscribe((e)=>{
      if(e){
        this.skillsForm.controls['skillsv2'].enable();
      }
      else{
        this.skillsForm.controls['skillsv2'].disable();
      }
    })

    // Setup form change detection
    this.setupFormChangeDetection();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterSectionOptions(value: string): string[] {
    console.log('Filtering section options for value:', value);
    // If value is null, undefined, or empty string, show all options
    if (!value || value.trim() === '') {
      console.log('Returning all options:', this.sectionOptions);
      return [...this.sectionOptions]; // Return a copy of all options
    }
    
    const filterValue = value.toLowerCase().trim();
    const filtered = this.sectionOptions.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
    console.log('Filtered options:', filtered);
    return filtered;
  }

  private setupFormChangeDetection(): void {
    // Listen to section_title changes for form change detection
    this.skillsForm.controls['section_title'].valueChanges.subscribe(() => {
      this.checkForFormChanges();
    });
    // No need to listen to 'skills' input changes for bullet points logic
    setTimeout(() => {
      this.captureOriginalFormValues();
      this.checkForFormChanges();
    }, 100);
  }

  private captureOriginalFormValues(): void {
      // Only store section_title for change detection, not the skills input
      this.originalFormValues = {
        section_title: this.skillsForm.controls['section_title'].value
      };
      if (this.sectionName === "SKILLS_BULLET_POINTS") {
        // Store a copy of the original skills list
        this.originalSkillsBulletPoints = [...this.skillsBulletPoints];
      } else {
        this.originalFruits = [...this.fruits];
      }
      // Do not reset hasFormChanged here; let checkForFormChanges control it
    }

  private checkForFormChanges(): void {
    if (this.sectionName === "SKILLS_BULLET_POINTS") {
      // Always enable the button for now
      this.hasFormChanged = true;
    } else {
      const sectionTitleChanged = this.skillsForm.controls['section_title'].value !== this.originalFormValues.section_title;
      const fruitsChanged = JSON.stringify(this.fruits) !== JSON.stringify(this.originalFruits);
      this.hasFormChanged = (sectionTitleChanged || fruitsChanged) &&
        !!this.skillsForm.controls['section_title'].value?.trim() &&
        this.fruits.length > 0;
    }
  }

  getButtonTooltip(): string {
    if (this.skillsForm.invalid) {
      return 'Please fill in all required fields';
    }
    
    if (this.sectionName === "SKILLS_BULLET_POINTS") {
      if (!this.hasFormChanged) {
        return 'No changes to save';
      }
      return 'Update Skills';
    } else {
      if (this.fruits && this.fruits.length === 0) {
        return 'Add skills before saving to resume';
      }
      if (!this.hasFormChanged) {
        return 'No changes to save';
      }
      return 'Add to Resume';
    }
  }

  onSectionTitleFocus(): void {
    console.log('Section title input focused');
    // Trigger autocomplete by programmatically setting empty value
    const control = this.skillsForm.controls['section_title'];
    console.log('Current value before clearing:', control.value);
    // Set to empty to trigger the filter with all options
    control.setValue('');
    console.log('Value after clearing:', control.value);
    // Force change detection
    this.cdr.detectChanges();
  }

  onSectionTitleInput(event: any): void {
    // This ensures the autocomplete works when typing
    const value = event.target.value;
    this.skillsForm.controls['section_title'].setValue(value);
  }

  setSkillsValues(): void {
    // Safely handle skill values, defaulting to an empty array
    const resume = this.resumeSignalForm();
    const section = resume.sections?.find((s: any) => s.section === 'SKILLS_CATEGORY');
    const skillValues = section?.items?.map((i: any) => i.data) || [];
    this.fruits = [...skillValues];
    let section_title;
        if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
          this.multipleSections().map((e : SectionDesc[])=>{
            e.map((section : SectionDesc)=>{
              if(section.section == this.sectionName){
                section_title = section.editable_section_title
              }
            })
          })
        }
        else{
          this.sections().map((section : SectionDesc)=>{
              if(section.section == this.sectionName){
                section_title = section.editable_section_title
              }
            })
        }
        this.skillsForm.controls['section_title'].setValue(section_title??'Skills')
  }
  
  setSkillsV2Values(){
    this.options = []
      const resume = this.resumeSignalForm();
      const section = resume.sections?.find((s: any) => s.section === 'SKILLS_CATEGORY');
      const skillV2List = section?.items?.map((i: any) => i.data) || [];
      skillV2List.forEach((e: any) => {
        this.options = [...this.options, e.sub_title];
      });
      this.skills_v2 = [...skillV2List];
    
    // Capture original form values for regular skills mode
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }
  
  drop(event: CdkDragDrop<any[]>): void {
    console.log('previousIndex: ' + event.previousIndex + ' --- ' + 'currentIndex: ' + event.currentIndex);
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.fruits, event.previousIndex, event.currentIndex);
      this.checkForFormChanges(); // Trigger change detection
    }
  }

  startSkillDrag(event: CdkDragEnter<any[]>, index: number) {
    this.draggingIndex2 = index; // Update placeholder position
  }

  endSkillDrag(event: CdkDragExit<any[]>) {
    this.draggingIndex2 = null; // Reset placeholder when exiting the list
  }

  enter(event: CdkDragEnter<any[]>, index: number) {
    this.draggingIndex2 = index; // Update placeholder position
  }

  exit(event: CdkDragExit<any[]>) {
    this.draggingIndex2 = null; // Reset placeholder when exiting the list
  }

  dropAI(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.fruits, event.previousIndex, event.currentIndex);
    this.checkForFormChanges(); // Trigger change detection
  }
  
  saveAndContinue(): void {
    this.markFormGroupTouched(this.skillsForm);

    if (this.sectionName == "SKILLS_BULLET_POINTS") {
      // Save skills bullet points
      this.userStore.setSkillsBulletPoints(this.skillsBulletPoints);

      // Update section status
      if (!this.sectionStatus().isSkillsBulletPoints) {
        const status = this.sectionStatus();
        status.isSkillsBulletPoints = true;
        this.userStore.updateSectionStatus(status);
      }
    } else {
      // Handle other skills sections
      let skills: Skill[] = [];
      this.skills_v2.forEach((e: any) => {
        if (Array.isArray(e.skills)) {
          skills = [...skills, ...e.skills]; // Safely spread only arrays
        }
      });

      this.userStore.addSkillV2(this.skills_v2);

      // Update section status for regular skills
      if (!this.sectionStatus().isSkill) {
        const status = this.sectionStatus();
        status.isSkill = true;
        this.userStore.updateSectionStatus(status);
      }
    }

    // Update section title
    if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
      this.multipleSections().map((e : SectionDesc[])=>{
        e.map((section : SectionDesc)=>{
          if(section.section == this.sectionName){
            section.editable_section_title = this.skillsForm.controls['section_title'].value?? 'Skills'
          }
        })
      })
      this.userStore.setMultipleColumnTemplateSections(this.multipleSections())
    }
    else{
      this.sections().map((section : SectionDesc)=>{
          if(section.section == this.sectionName){
            section.editable_section_title = this.skillsForm.controls['section_title'].value?? 'Skills'
          }
        })
        this.userStore.setResumeSections(this.sections())
    }


    // Reset form and mark as pristine for skills bullet points
    if (this.sectionName == "SKILLS_BULLET_POINTS") {
      this.skillsForm.patchValue({
        skills: ''
      });
      this.skillsForm.markAsPristine();
      // Update the originalSkillsBulletPoints after save
      this.originalSkillsBulletPoints = [...this.skillsBulletPoints];
      // Reset hasFormChanged to false after save
      this.hasFormChanged = false;
      // Capture new original values after save
      setTimeout(() => {
        this.captureOriginalFormValues();
        this.checkForFormChanges();
      }, 100);
    } else {
      this.skillsForm.reset();
      // Reset hasFormChanged to false after save
      this.hasFormChanged = false;
      // Capture new original values after save for regular skills
      setTimeout(() => {
        this.captureOriginalFormValues();
        this.checkForFormChanges();
      }, 100);
    }

    // Emit contact event
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

  add(skill : Skill): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
      if ((skill.name || '').trim()) {
        this.fruits.push(skill);
        this.checkForFormChanges(); // Trigger change detection
      }
      this.skillsForm.controls['skills'].setValue(null);
    }
    addSkill(): void {
      const inputSkill = this.skillsForm.controls['skills'].value?.trim();
      
      // Ensure the input is not empty and does not already exist in the list
      if (inputSkill && !this.fruits.some(fruit => fruit.name.toLowerCase() === inputSkill.toLowerCase())) {
        this.fruits.push({ name: inputSkill, selected: false }); // Assuming each fruit is an object
        this.checkForFormChanges(); // Trigger change detection
      }
    
      // Clear the input field
      this.skillsForm.controls['skills'].setValue(null);
    }

  removeSkill(item: any, skill: string) {
    item.skills = item.skills.filter((s: any) => s !== skill);
  }  

  remove(fruit: Skill): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.checkForFormChanges(); // Trigger change detection
    }
  }

  getAISkills(){
    this.jobDescAISuggestions().Skills.split("###").filter(e => e != "").map((e)=>{
      let skill : Skill = {name : e, selected : false}
      this.skills.push(skill);
    })
  }

  isVisible(){
    return this.skillsForm.controls['skills'].value?this.skillsForm.controls['skills'].value.length > 0 : false 
  }

  isVisiblev2(){
    return this.skillsForm.controls['skillsv2'].value?this.skillsForm.controls['skillsv2'].value.length > 0 : false 
  }

  checkForOptions(event : any): void {
    this.isSuffixVisible = event.target.value && !this.options.some(option => option.toLowerCase() === event.target.value.toLowerCase());
  }

  removeSkillV2(sub_title : string, skill : string){
    let selected_skill_v2 = this.skills_v2.find(e=> e.sub_title == sub_title);
    let selected_skills = selected_skill_v2?.skills.filter(e=> e != skill)
    if(selected_skill_v2?.sub_title){
      selected_skill_v2.skills = selected_skills?selected_skills : [];
      let index = this.skills_v2.findIndex(obj => obj.sub_title === sub_title);
      this.skills_v2 = [...this.skills_v2.slice(0,index), selected_skill_v2, ...this.skills_v2.slice(index + 1,)]
    }
  }

  addSubTitleV2(){
    if(this.skillsForm.controls['sub_title'].value && !this.isEditSubTitle){
    let new_skillv2 : SkillV2 = new SkillV2();
    new_skillv2.sub_title = this.skillsForm.controls['sub_title'].value;
    this.skills_v2.push(new_skillv2);
    this.options = [...this.options, this.skillsForm.controls['sub_title'].value];
    this.skillsForm.controls['sub_title'].setValue(null);
    this.isSuffixVisible = false;
    }
    else if(this.skillsForm.controls['sub_title'].value && this.isEditSubTitle){
      let new_skillv2 : SkillV2 = new SkillV2();
      new_skillv2.sub_title = this.skillsForm.controls['sub_title'].value;
      let index = this.skills_v2.findIndex(obj => obj.sub_title == this.old_subTitle);
      console.log(this.skills_v2, index, [...this.skills_v2.slice(0,index), new_skillv2, ...this.skills_v2.slice(index + 1,)]);
      this.skills_v2 = [...this.skills_v2.slice(0,index), new_skillv2, ...this.skills_v2.slice(index + 1,)]
      index = this.options.findIndex(obj => obj === this.old_subTitle);
      this.options = [...this.options.slice(0,index), new_skillv2.sub_title, ...this.options.slice(index + 1,)]
      this.skillsForm.controls['sub_title'].setValue(null);
      this.isSuffixVisible = false;
      this.isEditSubTitle = false;
    }
  }

  deleteSubTitle(item : SkillV2){
    let index = this.skills_v2.findIndex(obj => obj.sub_title === item.sub_title)
    this.skills_v2 = [...this.skills_v2.slice(0,index), ...this.skills_v2.slice(index + 1,)]
    index = this.options.findIndex(obj => obj === item.sub_title);
    this.options = [...this.options.slice(0,index), ...this.options.slice(index + 1,)]
  }

  addSkillV2(){
    if(this.skillsForm.controls['skillsv2'].value){
    let selected_skills = this.skills_v2.find(e => e.sub_title == this.skillsForm.controls['sub_title'].value)?.skills;
    let lowerSkills : string[]= []
    selected_skills?.map((e : string)=>{
      lowerSkills = [...lowerSkills, e.toLowerCase()]
    })
    if (this.skillsForm.controls['skillsv2'].value && !lowerSkills.includes(this.skillsForm.controls['skillsv2'].value.toLowerCase())) {
      selected_skills?.push(this.skillsForm.controls['skillsv2'].value)
    }
    let selected_skill_v2 = this.skills_v2.find(e=> e.sub_title == this.skillsForm.controls['sub_title'].value);
    if(selected_skill_v2 && selected_skills){
      selected_skill_v2.skills = selected_skills;
      let index = this.skills_v2.findIndex(obj => obj.sub_title === this.skillsForm.controls['sub_title'].value);
      this.skills_v2 = [...this.skills_v2.slice(0,index), selected_skill_v2, ...this.skills_v2.slice(index + 1,)]
    }
    this.skillsForm.controls['skillsv2'].setValue(null);
    }
  }

  editSubTitle(item : SkillV2){
    this.old_subTitle = item.sub_title
    this.skillsForm.controls['sub_title'].setValue(item.sub_title);
    this.isEditSubTitle = true;
  }

  // Skills Bullet Points Methods

  addSkillBulletPoint(): void {
    const skillValue = this.skillsForm.controls['skills'].value?.trim();
    if (skillValue && !this.skillsBulletPoints.includes(skillValue)) {
      this.skillsBulletPoints.push(skillValue);
      this.skillsForm.controls['skills'].setValue('');
      this.skillsForm.markAsDirty();
      this.checkForFormChanges(); // Always check for changes after add
    }
  }


  removeSkillBulletPoint(index: number): void {
    this.skillsBulletPoints.splice(index, 1);
    this.skillsForm.markAsDirty();
    this.checkForFormChanges(); // Always check for changes after remove
  }


  dropSkill(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.skillsBulletPoints, event.previousIndex, event.currentIndex);
    this.skillsForm.markAsDirty();
    // Force a new array reference to ensure change detection
    this.skillsBulletPoints = [...this.skillsBulletPoints];
    this.checkForFormChanges(); // Always check for changes after reorder
    this.cdr.detectChanges(); // Force UI update for button state
  }

  isFormDirty(): boolean {
    // Section title must be non-empty, and at least one skill must be present
    const sectionTitle = this.skillsForm.get('section_title')?.value?.trim();
    return (
      this.skillsForm.dirty ||
      JSON.stringify(this.skillsBulletPoints) !== JSON.stringify(this.originalSkillsBulletPoints)
    ) && !!sectionTitle && this.skillsBulletPoints.length > 0;
  }

  setSkillsBulletPointsValues(): void {
    // Load existing skills bullet points
  const resume = this.resumeSignalForm();
  const section = resume.sections?.find((s: any) => s.section === 'SKILLS_BULLET_POINTS');
  this.skillsBulletPoints = section?.items?.map((i: any) => i.data.skill) || [];
  this.originalSkillsBulletPoints = [...this.skillsBulletPoints];
    // Set section title
    let section_title;
    if(this.resumeSignalForm().template_details.template_name == 'TEMPLATE_9'){
      this.multipleSections().map((e : SectionDesc[])=>{
        e.map((section : SectionDesc)=>{
          if(section.section == this.sectionName){
            section_title = section.editable_section_title
          }
        })
      })
    }
    else{
      this.sections().map((section : SectionDesc)=>{
          if(section.section == this.sectionName){
            section_title = section.editable_section_title
          }
        })
    }
    this.skillsForm.controls['section_title'].setValidators([Validators.required]);
    this.skillsForm.controls['section_title'].updateValueAndValidity();
    this.skillsForm.controls['section_title'].setValue(section_title ?? 'Skills');
    // Capture original form values after setting
    setTimeout(() => {
      this.captureOriginalFormValues();
    }, 100);
  }
}
