import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, ViewChild, effect, inject } from '@angular/core';
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
import { Education, IsSectionPresent, JobDescriptionAIResponse, Resume, SkillV2, TemplateVariables } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';


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
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, MatAutocompleteModule, MatChipsModule, MatAutocompleteModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class SkillsComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {

  

  skills_list : {id : number, skills : String | null}[] = []
  skillCount : number = 1
  isEditSubTitle : boolean = false

  selectedSkillItem! : {id : number | null, skills : String | null}

  selectable = true;
  removable = true;
  fruits: Array<Skill> = [];
  old_subTitle  : string = ""

  draggingIndex: number | null = null;

  draggingIndex2: number | null = null; // Stores the position where placeholder should appear
  
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();
  jobDescAISuggestions : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();
  sectionStatus : Signal<IsSectionPresent> = this.userStore.getSectionStatus();


  @Output() contact = new EventEmitter();

  @Input()
  skillsValue! : number
  options: string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  isSuffixVisible: boolean | string = false;

  

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog) {
        effect(()=>{
          if(this.resumeSignalForm().template_details.template_name != "TEMPLATE_10"){
            this.setSkillsValues()
          }
          else{
            this.setSkillsV2Values()
          }
        })
      }

    
  ngOnChanges(changes: SimpleChanges): void {
    this.setSkillsV2Values()
  }


    ngAfterViewChecked() {
    if(this.skillCount == this.skillsValue){
      this.setSkillsValues();
      this.skillCount = this.skillCount+1;
    }
  }

  startDrag(index: number) {
    this.draggingIndex = index; // Set placeholder index
  }

  endDrag() {
    this.draggingIndex = null; // Remove placeholder after drag
  }


  skillsForm = this._formBuilder.group({
    skills: [''],
    sub_title : ['']
  });

  subs: Array<Subscription> = [];
  overlayVisible = true;

  selectableAI = true;
  removableAI = false; // Chips cannot be removed
  selectedSkills: Skill[] = []; // To track selected skills
  skills: Skill[] = [];
  skills_v2 : SkillV2[] = [];

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
    }
  
    // Add any additional logic if needed
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  ngOnInit() {
    this.getAISkills();
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

    if(this.resumeSignalForm().template_details.template_name == "TEMPLATE_10"){
      this.skillsForm.controls['skills'].disable();
    }

    this.skillsForm.controls['sub_title'].valueChanges.subscribe((e)=>{
      if(e){
        this.skillsForm.controls['skills'].enable();
      }
      else{
        this.skillsForm.controls['skills'].disable();
      }
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  setSkillsValues(): void {
    // Safely handle skill values, defaulting to an empty array
    const skillValues = this.resumeSignalForm().skill as any[] || [];
    
    // Assign the array to fruits
    this.fruits = [...skillValues];
  }
  
  setSkillsV2Values(){
    this.options = []
    this.resumeSignalForm().skill_v2.map((e : SkillV2)=>{
      this.options = [...this.options, e.sub_title]
    })
    this.skills_v2 = [...this.resumeSignalForm().skill_v2]
  }
  
  drop(event: CdkDragDrop<any[]>): void {
    console.log('previousIndex: ' + event.previousIndex + ' --- ' + 'currentIndex: ' + event.currentIndex);
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.fruits, event.previousIndex, event.currentIndex);
    }
  }

  // dropInList(item:SkillV2, event: CdkDragDrop<any[]>): void {
  //   console.log('previousIndex: ' + event.previousIndex + ' --- ' + 'currentIndex: ' + event.currentIndex);
  //   debugger;
  //   if (event.previousIndex !== event.currentIndex) {
  //     moveItemInArray(item.skills, event.previousIndex, event.currentIndex);
  //     this.isDragging = false; // Remove placeholder
  //   }
  // }

  dropInList(item:SkillV2, event: CdkDragDrop<any[]>): void {
    console.log('previousIndex: ' + event.previousIndex + ' --- ' + 'currentIndex: ' + event.currentIndex);
    debugger;
    // if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(item.skills, event.previousIndex, event.currentIndex);
      // this.draggingIndex2 = null; 
    // }
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
  }
  
  saveAndContinue(): void {
    this.markFormGroupTouched(this.skillsForm);
  
    if (this.resumeSignalForm().template_details.template_name !== "TEMPLATE_10") {
      // Add skills for non-TEMPLATE_10
      this.userStore.addSkill(this.fruits);
    } else {
      // Handle TEMPLATE_10
      let skills: Skill[] = [];
      this.skills_v2.forEach((e: any) => {
        if (Array.isArray(e.skills)) {
          skills = [...skills, ...e.skills]; // Safely spread only arrays
        }
      });
  
      this.userStore.addSkillV2(this.skills_v2);
      this.userStore.addSkill(skills);
    }
  
    // Reset form
    this.skillsForm.reset();
  
    // Update section status if not already set
    if (!this.sectionStatus().isSkill) {
      const status = this.sectionStatus();
      status.isSkill = true;
      this.userStore.updateSectionStatus(status);
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
      }
      this.skillsForm.controls['skills'].setValue(null);
    }
    addSkill(): void {
      const inputSkill = this.skillsForm.controls['skills'].value?.trim();
      
      // Ensure the input is not empty and does not already exist in the list
      if (inputSkill && !this.fruits.some(fruit => fruit.name.toLowerCase() === inputSkill.toLowerCase())) {
        this.fruits.push({ name: inputSkill, selected: false }); // Assuming each fruit is an object
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
    if(this.skillsForm.controls['skills'].value){
    let selected_skills = this.skills_v2.find(e => e.sub_title == this.skillsForm.controls['sub_title'].value)?.skills;
    let lowerSkills : string[]= []
    selected_skills?.map((e : string)=>{
      lowerSkills = [...lowerSkills, e.toLowerCase()]
    })
    if (this.skillsForm.controls['skills'].value && !lowerSkills.includes(this.skillsForm.controls['skills'].value.toLowerCase())) {
      selected_skills?.push(this.skillsForm.controls['skills'].value)
    }
    let selected_skill_v2 = this.skills_v2.find(e=> e.sub_title == this.skillsForm.controls['sub_title'].value);
    if(selected_skill_v2 && selected_skills){
      selected_skill_v2.skills = selected_skills;
      let index = this.skills_v2.findIndex(obj => obj.sub_title === this.skillsForm.controls['sub_title'].value);
      this.skills_v2 = [...this.skills_v2.slice(0,index), selected_skill_v2, ...this.skills_v2.slice(index + 1,)]
    }
    this.skillsForm.controls['skills'].setValue(null);
    }
  }

  editSubTitle(item : SkillV2){
    this.old_subTitle = item.sub_title
    this.skillsForm.controls['sub_title'].setValue(item.sub_title);
    this.isEditSubTitle = true;
  }
}
