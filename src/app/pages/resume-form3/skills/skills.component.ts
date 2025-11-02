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
import { Education, IsSectionPresent, JobDescriptionAIResponse, Resume, SkillV2 as SkillV2Base, TemplateVariables } from 'src/app/services/resume.model';
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

// Extend SkillV2 to allow a temporary _newSkill property for UI
type SkillV2 = SkillV2Base & { _newSkill?: string };

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
  /**
   * Index of the selected category to edit (for SKILLS_BY_CATEGORY mode)
   */
  @Input() selectedCategoryIndex: number | null = null;
  /**
   * The currently selected category for skills by category mode.
   */
  public selectedCategory: any | null = null;
  /**
   * Index of the selected category to edit (for SKILLS_BY_CATEGORY mode)
   */
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
  public cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
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

  /**
   * Local array to hold skills for SKILLS_BY_CATEGORY mode before saving to store.
   */
  localSkills: string[] = [];

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
    // Always treat 'Skills' menu as SKILLS_BULLET_POINTS and load from selected resume
    if (this.sectionName === 'SKILLS' || this.sectionName === 'SKILLS_BULLET_POINTS') {
      this.sectionName = 'SKILLS_BULLET_POINTS';
      // Find the SKILLS_BULLET_POINTS section in the selected resume
      const resume = this.resumeSignalForm();
      const section = resume.sections?.find((s: any) => s.section === 'SKILLS_BULLET_POINTS');
      if (section) {
        this.skillsBulletPoints = section.items?.map((i: any) => i.data.skill) || [];
        this.originalSkillsBulletPoints = [...this.skillsBulletPoints];
      } else {
        this.skillsBulletPoints = [];
        this.originalSkillsBulletPoints = [];
      }
      // Set section title
      let section_title;
      if(resume.template_details.template_name == 'TEMPLATE_9'){
        this.multipleSections().map((e : SectionDesc[])=>{
          e.map((section : SectionDesc)=>{
            if(section.section == 'SKILLS_BULLET_POINTS'){
              section_title = section.editable_section_title
            }
          })
        })
      }
      else{
        this.sections().map((section : SectionDesc)=>{
            if(section.section == 'SKILLS_BULLET_POINTS'){
              section_title = section.editable_section_title
            }
          })
      }
      this.skillsForm.controls['section_title'].setValidators([Validators.required]);
      this.skillsForm.controls['section_title'].updateValueAndValidity();
      this.skillsForm.controls['section_title'].setValue(section_title ?? 'Skills');
      this.selectedCategory = null; // No category for bulleted mode
    } else if (this.sectionName === 'SKILLS_CATEGORY' || this.sectionName === 'SKILLS_BY_CATEGORY') {
      this.setSkillsValues();
      this.setSkillsV2Values();
      // If an index is provided, load that category for editing from the store
      const selectedCategory = this.userStore.getSelectedSkillsCategory && this.userStore.getSelectedSkillsCategory();
      if (selectedCategory) {
        this.selectedCategory = selectedCategory;
        // Prefer data.name if present, fallback to sub_title
        const categoryName = selectedCategory.data?.name || selectedCategory.sub_title || '';
        this.skillsForm.controls['sub_title'].setValue(categoryName);
        // Always re-initialize localSkills from the selectedCategory when editing
        this.localSkills = Array.isArray(selectedCategory.data?.skills)
          ? [...selectedCategory.data.skills]
          : [];
      } else if (this.selectedCategoryIndex !== null && this.skills_v2 && this.skills_v2[this.selectedCategoryIndex]) {
        this.selectedCategory = this.skills_v2[this.selectedCategoryIndex];
        const categoryName = this.selectedCategory.data?.name || this.selectedCategory.sub_title || '';
        this.skillsForm.controls['sub_title'].setValue(categoryName);
        this.localSkills = Array.isArray(this.selectedCategory.data?.skills)
          ? [...this.selectedCategory.data.skills]
          : [];
      } else {
        // Always start with a new/empty category when loading from menu
        this.selectedCategory = { sub_title: '', skills: [], _newSkill: '' };
        this.skillsForm.controls['sub_title'].setValue('');
        this.localSkills = [];
      }
      // Log the selectedCategory for debugging
      console.log('[SkillsComponent] selectedCategory after init:', this.selectedCategory);
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
    // Filter out undefined/null options before calling toLowerCase
    return this.options
      .filter(option => typeof option === 'string')
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterSectionOptions(value: string): string[] {
    console.log('Filtering section options for value:', value);
    // If value is null, undefined, or empty string, show all options
    if (!value || value.trim() === '') {
      console.log('Returning all options:', this.sectionOptions);
      return [...this.sectionOptions]; // Return a copy of all options
    }

    const filterValue = value.toLowerCase().trim();
    // Filter out undefined/null options before calling toLowerCase
    const filtered = this.sectionOptions
      .filter(option => typeof option === 'string')
      .filter(option => option.toLowerCase().includes(filterValue));
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

  public checkForFormChanges(): void {
    if (this.sectionName === "SKILLS_BULLET_POINTS") {
      // Always enable the button for now
      this.hasFormChanged = true;
    } else if (this.sectionName === 'SKILLS_BY_CATEGORY') {
      // Enable only if category has value, at least one skill, and skills changed
      const categoryValue = this.skillsForm.controls['sub_title'].value?.trim();
      // Prefer selectedCategory.data.skills if present, else fallback
      const skillsArr = this.selectedCategory?.data?.skills || this.selectedCategory?.skills || [];
      const originalSkillsArr = this.originalFruits || [];
      const skillsChanged = JSON.stringify(skillsArr) !== JSON.stringify(originalSkillsArr);
      this.hasFormChanged = !!categoryValue && skillsArr.length > 0 && skillsChanged;
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
    const section = resume.sections?.find((s: any) => s.section === this.sectionName);
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
    this.options = [];
    const resume = this.resumeSignalForm();
    const section = resume.sections?.find((s: any) => s.section === this.sectionName);
    const skillV2List = section?.items?.map((i: any) => i.data) || [];
    skillV2List.forEach((e: any) => {
      this.options = [...this.options, e.sub_title];
    });
    // Ensure each SkillV2 has a _newSkill property for template use
    this.skills_v2 = skillV2List.map((cat: any) => ({ ...cat, _newSkill: '' }));
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

    if (this.sectionName === 'SKILLS_BY_CATEGORY' && this.selectedCategory) {
      // Save/update the category and its skills in the selectedResume's SKILLS_BY_CATEGORY section
      const resume = this.resumeSignalForm();
      const section = resume.sections?.find((s: any) => s.section === 'SKILLS_BY_CATEGORY');
      let updatedCategory = null;
      if (section && this.selectedCategory) {
        // Find the category item in section.items by id or name
        const categoryName = this.skillsForm.controls['sub_title'].value?.trim();
        // Always use localSkills for saving
        let itemToUpdate = section.items?.find((item: any) => {
          if (item.data?.id && this.selectedCategory.data?.id) {
            return item.data.id === this.selectedCategory.data.id;
          }
          return (item.data?.name || item.data?.sub_title) === (this.selectedCategory.data?.name || this.selectedCategory.sub_title);
        });
        if (itemToUpdate) {
          if (itemToUpdate.data) {
            itemToUpdate.data.name = categoryName;
            itemToUpdate.data.skills = [...this.localSkills];
            updatedCategory = itemToUpdate;
          }
        } else {
          const newCat = { data: { name: categoryName, skills: [...this.localSkills] } };
          section.items = section.items || [];
          section.items.push(newCat);
          updatedCategory = newCat;
        }
        // Also update selectedCategory.data.skills so UI stays in sync
        if (this.selectedCategory.data) {
          this.selectedCategory.data.skills = [...this.localSkills];
        }
      }
      // Update selectedSkillsCategory in store so future edits reflect latest
      if (updatedCategory) {
        this.userStore.setSelectedSkillsCategory(updatedCategory);
      }
      // Update section status for regular skills
      if (!this.sectionStatus().isSkill) {
        const status = this.sectionStatus();
        status.isSkill = true;
        this.userStore.updateSectionStatus(status);
      }
      this.userStore.setResumeSections(this.sections());
    } else {
      if (this.sectionName === 'SKILLS_BULLET_POINTS') {
        // Update the SKILLS_BULLET_POINTS section in the selectedResume
        this.userStore.setSkillsBulletPoints(this.skillsBulletPoints);
        // Update section status for regular skills
        if (!this.sectionStatus().isSkill) {
          const status = this.sectionStatus();
          status.isSkill = true;
          this.userStore.updateSectionStatus(status);
        }
      } else {
        // Handle other skills sections (SKILLS_V2, etc.)
        let skills: Skill[] = [];
        this.skills_v2.forEach((e: any) => {
          if (Array.isArray(e.skills)) {
            skills = [...skills, ...e.skills];
          }
        });
        this.userStore.addSkillV2(this.skills_v2);
        if (!this.sectionStatus().isSkill) {
          const status = this.sectionStatus();
          status.isSkill = true;
          this.userStore.updateSectionStatus(status);
        }
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


  removeSkill(index: number): void {
    if (Array.isArray(this.localSkills) && index > -1 && index < this.localSkills.length) {
      this.localSkills = [
        ...this.localSkills.slice(0, index),
        ...this.localSkills.slice(index + 1)
      ];
      this.skillsForm.markAsDirty();
      this.checkForFormChanges?.();
      this.cdr.detectChanges?.();
    }
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
      let new_skillv2 : SkillV2 = { sub_title: this.skillsForm.controls['sub_title'].value, skills: [], _newSkill: '' };
      this.skills_v2.push(new_skillv2);
      this.options = [...this.options, this.skillsForm.controls['sub_title'].value];
      this.selectedCategory = new_skillv2;
      this.skillsForm.controls['sub_title'].setValue(null);
      this.isSuffixVisible = false;
    }
    else if(this.skillsForm.controls['sub_title'].value && this.isEditSubTitle){
      let new_skillv2 : SkillV2 = { sub_title: this.skillsForm.controls['sub_title'].value, skills: [], _newSkill: '' };
      let index = this.skills_v2.findIndex(obj => obj.sub_title == this.old_subTitle);
      this.skills_v2 = [...this.skills_v2.slice(0,index), new_skillv2, ...this.skills_v2.slice(index + 1,)];
      index = this.options.findIndex(obj => obj === this.old_subTitle);
      this.options = [...this.options.slice(0,index), new_skillv2.sub_title, ...this.options.slice(index + 1,)];
      this.selectedCategory = new_skillv2;
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
    this.old_subTitle = item.sub_title;
    this.skillsForm.controls['sub_title'].setValue(item.sub_title);
    this.selectedCategory = item; // Set selectedCategory to the edited item
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

  /**
   * Adds a skill to the currently selected category (for SKILLS_BY_CATEGORY mode).
   * Called from the template when user presses Enter or clicks Add.
   */
  addSkillToCategory(event?: Event): void {
    event?.preventDefault();
    const skillValue = this.skillsForm.controls['skills'].value?.trim();
    if (this.sectionName === 'SKILLS_BY_CATEGORY') {
      if (skillValue && !this.localSkills.includes(skillValue)) {
        this.localSkills.push(skillValue);
        this.skillsForm.controls['skills'].setValue('');
      }
    } else {
      // ...existing logic for other section types...
    }
  }

  // Handles input event for category autocomplete (optional, for future logic)
  onCategoryInput(event: any): void {
    // Optionally implement logic to filter or react to input
    // Currently a no-op for template compatibility
  }
}
