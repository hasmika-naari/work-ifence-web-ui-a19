import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { FooterComponent } from '../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { Education, TemplateVariables } from 'src/app/services/resume.model';

@Component({
  selector: 'app-resume-form',
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,MatExpansionModule],
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.scss']
})
export class ResumeFormComponent implements OnInit {
  resumeForm!: FormGroup;
  contactForm! : FormGroup
  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false
  eduForm!: FormGroup;
  workForm! : FormGroup;
  userProjectForm! : FormGroup
  listed_skills : Array<String> = ['Java', 'Python','Angular', 'NodeJS', 'ReactJS']

  private _formBuilder: FormBuilder = inject(FormBuilder);


  constructor( private router : Router, 
    public promptService : PromptService, public genaiService : GenAIService, 
    public templateService : TemplatesService) {}

  WorkHistoryFormGroup = this._formBuilder.group({
    work_history: ['', Validators.required],
  });
  educationForm = this._formBuilder.group({
    education: [''],
    school_name : ['', Validators.required],
    school_location : [''],
    degree : ['', Validators.required],
    field_of_study : ['', Validators.required],
    gpa : [''],
    graduation_month : ['', Validators.required],
    graduation_year : ['', Validators.required]
  });
  skillsForm = this._formBuilder.group({
    skills: ['', Validators.required],
  });
  summaryForm = this._formBuilder.group({
    profile_summary: ['', Validators.required],
  });
  certificationsForm = this._formBuilder.group({
    certifications : ['', Validators.required],
  });
  projectForm = this._formBuilder.group({
    projects : ['', Validators.required],
  });
  achievementForm = this._formBuilder.group({
    achievement : ['', Validators.required]
  })

  workHistoryList : Array<String>  | null= null
  educationGeminiResponse : Array<Education>  | null = null
  technical_skills_genai : Array<String> | null= null
  soft_skills_genai : Array<String> | null = null
  profile_summary_genai : Array<String> | null = null 
  projectList_genai : Array<String> | null= null
  achievement_genai : Array<String> | null = null

  is_work_history_loading : boolean = false
  is_education_loading : boolean = false
  is_skills_loading : boolean = false
  is_projects_loading : boolean = false
  is_certifications_loading : boolean = false
  is_summary_loading : boolean = false;
  is_achievement_loading : boolean = false;

  isWorkHistorySkipped : boolean = false;
  isEducationSkipped : boolean = false;
  isSkillsSkipped : boolean = false;
  isProjectsSkipped : boolean = false;
  isSummarySkipped : boolean = false;
  isAchievementsSkipped : boolean = false;

  currentWorkExpIndex : number = 0
  currentProjectIndex : number = 0


  selectedTemplate : Array<TemplateVariables> = [
    {
        template_name : 'delloite_template',
        name : true,
        email : true,
        phone_number : true,
        address : false,
        linkedIn_profile : true,
        github_profile : true,
        role : true,
        profile_summary : true,
        experience : true,
        education : true,
        skills : true,
        certification : true,
        project : true,
        awards : false,
        languages : false,
        interests : false,
        volunteer_experiences : false,
        professional_memberships : false,
        publications : false,
        profile_image : true
      }
  ];
  

  ngOnInit() {
    this.eduForm = this._formBuilder.group({
      edu_fields: this._formBuilder.array([])
    });

    this.workForm = this._formBuilder.group({
      work_fields : this._formBuilder.array([])
    });

    this.userProjectForm = this._formBuilder.group({
      project_fields: this._formBuilder.array([])
    });

    this.contactForm = this._formBuilder.group({
      name: ['', Validators.required],
      phone_number: [''],
      email_address: ['', Validators.required],
      address : [''],
      role: [''],
      linkedIn_profile: [''],
      github_profile: ['']
    })
    this.resumeForm = this._formBuilder.group({
      profile_summary: [''],
      experience: [``],
      education: [``],
      skills: [''],
      certifications: [``],
      projects: [``],
      award : [``],
      language : [``],
      interest : [''],
      publication : [''],
      professional_membership : [''],
      volunteer_experiences : [''],
      imageBase64Encoded : ['']
    });

    this.addEducationField();
    this.addWorkField();
    this.addProjectField();
  }

  get eduFields() {
    return this.eduForm.get('edu_fields') as FormArray;
  }

  get workFields(){
    return this.workForm.get('work_fields') as FormArray;
  }

  get projectFields(){
    return this.userProjectForm.get('project_fields') as FormArray;
  }

  addEducationField() {
    const educationField = this._formBuilder.group({
      school_name: ['', Validators.required],
      school_location: [''],
      degree: ['', Validators.required],
      field_of_study: ['', Validators.required],
      gpa: [''],
      graduation_month: ['', Validators.required],
      graduation_year: ['', Validators.required],
      expanded : [true]
    });

    this.eduFields.push(educationField);
  }

  addWorkField() {
    const workField = this._formBuilder.group({
      position_title: [''],
      company_name: [''],
      location : [''],
      start_month: [''],
      start_year : [''],
      end_month: [''],
      end_year: [''],
      current_work_check : [false],
      description : ['']
    });

    this.workFields.push(workField);
  }

  addProjectField() {
    const projectField = this._formBuilder.group({
      project_title: [''],
      technologies_used: [''],
      description : ['']
    });

    this.projectFields.push(projectField);
  }

  removeEducationField(index: number) {
    this.eduFields.removeAt(index);
    this.panels = this.panels.filter((item)=>{return item.id != index})
    console.log(this.panels);
  }

  removeWorkField(index: number) {
    this.workFields.removeAt(index);
    this.work_panels = this.work_panels.filter((item)=>{return item.id != index})
    console.log(this.work_panels);
  }

  removeProjectField(index: number) {
    this.projectFields.removeAt(index);
    this.project_panels = this.project_panels.filter((item)=>{return item.id != index})
    console.log(this.project_panels);
  }

  saveAndContinue(step : any){
    if(step == 'Heading'){
      const element = document.getElementById("heading-circle");
      element?.classList.add("circle-completed")
      const line_element = document.getElementById("heading-line");
      line_element?.classList.add("circle-completed")
      this.cPage = 1
    }
    else if(step == 'Work_History'){
      if(this.isBeforeSectionsCompleted('Work_History')){
        const element = document.getElementById("Work_History");
        element?.classList.add("circle-completed")
        this.cPage = 2
      }
    }
    else if(step == 'Education'){
      if(this.isBeforeSectionsCompleted('Education')){
        const element = document.getElementById("Education");
        element?.classList.add("circle-completed")
        this.cPage = 4
      }
    }
    else if(step == 'Skills'){
      if(this.isBeforeSectionsCompleted('Skills')){
        const element = document.getElementById("Skills");
        element?.classList.add("circle-completed")
        this.cPage = 6
      }
    }
    else if(step == 'Summary'){
      if(this.isBeforeSectionsCompleted('Summary')){
        const element = document.getElementById("Summary");
        element?.classList.add("circle-completed")
        this.cPage = 8
      }
    }
    else if(step == 'Project'){
      if(this.isBeforeSectionsCompleted('Project')){
        const element = document.getElementById("Project");
        element?.classList.add("circle-completed")
        this.cPage = 10
      }
    }
    else if(step == 'Achievement'){
      if(this.isBeforeSectionsCompleted('Achievement')){
        const element = document.getElementById("Achievement");
        element?.classList.add("circle-completed")
        this.cPage = 12
      }
    }
    else if(step == 'Finalize'){
      if(this.isBeforeSectionsCompleted('Finalize')){
        const element = document.getElementById("Finalize");
        element?.classList.add("circle-completed")
        this.cPage = 14
      }
    }
    this.next()
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
  next(){
    console.log(this.cPage);
    
    this.cPage = this.cPage + 1;
    console.log(this.cPage);

    if(this.cPage == 1 || this.cPage == 2){
      this.handleStepper("Work_History")
    }
    else if(this.cPage ==3 || this.cPage == 4){
      this.handleStepper("Education")
    }
    else if(this.cPage == 5 || this.cPage == 6){
      this.handleStepper("Skills")
    }
    else if(this.cPage == 7 || this.cPage == 8){
      this.handleStepper("Summary")
    }
    else if(this.cPage == 9 || this.cPage == 10){
      this.handleStepper("Project")
    }
    else if(this.cPage == 11 || this.cPage == 12){
      this.handleStepper("Achievement")
    }
    else if(this.cPage == 13 || this.cPage == 14){
      this.handleStepper("Finalize")
    }
  }

  isBeforeSectionsCompleted(step : any){
    if(step == 'Heading'){
      return true;
    }
    else if(step == 'Work_History'){
      return this.contactForm.valid;
    }
    else if(step == 'Education'){
        return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped);
    }
    else if(step == 'Skills'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped);
    }
    else if(step == 'Summary'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped);
    }
    else if(step == 'Project'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped);
    }
    else if(step == 'Achievement'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped) && (this.projectForm.valid || this.isProjectsSkipped);
    }
    else if(step == 'Finalize'){
      return this.contactForm.valid && (this.workForm.valid || this.isWorkHistorySkipped) && (this.eduForm.valid || this.isEducationSkipped) && (this.skillsForm.valid || this.isSkillsSkipped) && (this.summaryForm.valid || this.isSummarySkipped) && (this.projectForm.valid || this.isProjectsSkipped) && (this.achievementForm.valid || this.isAchievementsSkipped);
    }
    else{
      return true;
    }
  }

  handleStepper(step : any){
    console.log("*************");
    
    if(step == 'Heading'){
      const element = document.getElementById("heading-circle");
      element?.classList.add("circle-selected")
      this.cPage = 0
    }
    else if(step == 'Work_History'){
      if(this.isBeforeSectionsCompleted('Work_History')){
        const element = document.getElementById("Work_History");
        element?.classList.add("circle-selected")
        this.cPage = 2
      }
    }
    else if(step == 'Education'){
      if(this.isBeforeSectionsCompleted('Education')){
        console.log("___________________________________");
        const element = document.getElementById("Education");
        element?.classList.add("circle-selected")
        this.cPage = 4
      }
    }
    else if(step == 'Skills'){
      if(this.isBeforeSectionsCompleted('Skills')){
        const element = document.getElementById("Skills");
        element?.classList.add("circle-selected")
        this.cPage = 6
      }
    }
    else if(step == 'Summary'){
      if(this.isBeforeSectionsCompleted('Summary')){
        const element = document.getElementById("Summary");
        element?.classList.add("circle-selected")
        this.cPage = 8
      }
    }
    else if(step == 'Project'){
      if(this.isBeforeSectionsCompleted('Project')){
        const element = document.getElementById("Project");
        element?.classList.add("circle-selected")
        this.cPage = 10
      }
    }
    else if(step == 'Achievement'){
      if(this.isBeforeSectionsCompleted('Achievement')){
        const element = document.getElementById("Achievement");
        element?.classList.add("circle-selected")
        this.cPage = 12
      }
    }
    else if(step == 'Finalize'){
      if(this.isBeforeSectionsCompleted('Finalize')){
        const element = document.getElementById("Finalize");
        element?.classList.add("circle-selected")
        this.cPage = 14
      }
    }
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
    if(step == 'Work_History'){
      this.is_work_history_loading = true;
      if(this.WorkHistoryFormGroup.controls['work_history'].value){
        const experience_prompt = this.promptService.getExperience_prompt(this.WorkHistoryFormGroup.controls['work_history'].value);
        this.genaiService.getGeminiProResponse(experience_prompt).then((response)=>{
          console.log(response);
          this.workHistoryList = this.parseResponse(response);
          this.is_work_history_loading = false;
        });
      }
    }
    else if(step == 'Education'){
      if(this.educationForm.controls['education'].value){
        this.is_education_loading = true;
        const edu_prompt = this.promptService.getEducation_Prompt(this.educationForm.controls['education'].value);
        this.genaiService.getGeminiProResponse(edu_prompt).then((response)=>{
          console.log(response);
          this.educationGeminiResponse = this.parseResponse(response);
          const element = document.getElementById("edu-card-info");
          if(element && this.educationGeminiResponse){
            element.innerHTML = this.templateService.formatEductionDevResume(this.educationGeminiResponse);
          }
          this.is_education_loading = false
        });
      }
    }
    else if(step == 'Skills'){
      
    }
    else if(step == 'Summary'){
      // if(this.summaryForm.controls['profile_summary'].value){
      //   this.is_summary_loading = true;
      //   const role_input = this.contactForm.controls['role'].value?this.contactForm.controls['role'].value : "Software Engineer";
      //   const objective_prompt = this.promptService.getObjective_Propmt(role_input, this.summaryForm.controls['profile_summary'].value);
      //   this.genaiService.getGeminiProResponse(objective_prompt).then((response)=>{
      //     this.profile_summary_genai = response.split('\n').filter((item)=>{return item != ""});
      //     console.log(this.profile_summary_genai);
      //     this.is_summary_loading = false
      //   });
      // }
    }
    else if(step == 'Project'){
      if(this.projectForm.controls['projects'].value){
        this.is_projects_loading = true;
        const project_prompt = this.promptService.getProject_Prompt(this.projectForm.controls['projects'].value);
        this.genaiService.getGeminiProResponse(project_prompt).then((response)=>{
          console.log(response);
          this.projectList_genai = this.parseResponse(response);
          // const element = document.getElementById("project-card-info");
          // if(element && this.projectList_genai){
          //   element.innerHTML = this.templateService.formatProjectDevResume(this.projectList_genai);
          // }
          this.is_projects_loading = false;
        });
      }
    }
    else if(step == 'Achievement'){
      
    }
  }

  skipHandler(step : String) : void{
    if(step == 'Work_History'){
      this.workFields.disable();
      this.isWorkHistorySkipped = true;
      const element = document.getElementById("Work_History");
      if(element){
        element.classList.add("circle-skipped")
      }
      // this.WorkHistoryFormGroup.controls['work_history'].clearValidators();
      this.cPage = 2
      this.next();
    }
    else if(step == 'Education'){
      this.eduFields.disable();
      this.isEducationSkipped = true;
      const element = document.getElementById("Education");
      if(element){
        element.classList.add("circle-skipped")
      }
      // this.educationForm.controls['education'].clearValidators();
      this.cPage = 4
      this.next();
    }
    else if(step == 'Skills'){
      this.skillsForm.controls['skills'].disable();
      this.isSkillsSkipped = true;
      const element = document.getElementById("Skills");
      if(element){
        element.classList.add("circle-skipped")
      }
      this.skillsForm.controls['skills'].clearValidators();
      this.cPage = 6
      this.next();
    }
    else if(step == 'Summary'){
      this.summaryForm.controls['profile_summary'].disable();
      this.isSummarySkipped = true;
      const element = document.getElementById("Summary");
      if(element){
        element.classList.add("circle-skipped")
      }
      this.summaryForm.controls['profile_summary'].clearValidators();
      this.cPage = 8
      this.next();
    }
    else if(step == 'Project'){
      this.projectFields.disable();
      this.isProjectsSkipped = true;
      const element = document.getElementById("Project");
      if(element){
        element.classList.add("circle-skipped")
      }
      // this.projectForm.controls['projects'].clearValidators();
      this.cPage = 10
      this.next();
    }
    else if(step == 'Achievement'){ 
      this.achievementForm.controls['achievement'].disable();
      this.isAchievementsSkipped = true;
      const element = document.getElementById("Achievement");
      if(element){
        element.classList.add("circle-skipped")
      }
      this.achievementForm.controls['achievement'].clearValidators();
      this.cPage = 12
      this.next();
    }
  }

  addSectionHandler(step : String) : void{
    if(step == 'Work_History'){
      this.workFields.enable();
      this.isWorkHistorySkipped = false;
      const element = document.getElementById("Work_History");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.WorkHistoryFormGroup.controls['work_history'].addValidators([Validators.required]);
    }
    else if(step == 'Education'){
      this.eduFields.enable();
      this.isEducationSkipped = false;
      const element = document.getElementById("Education");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.educationForm.controls['education'].addValidators([Validators.required]);
    }
    else if(step == 'Skills'){
      this.skillsForm.controls['skills'].enable();
      this.isSkillsSkipped = false;
      const element = document.getElementById("Skills");
      if(element){
        element.classList.remove("circle-skipped")
      }
      this.skillsForm.controls['skills'].addValidators([Validators.required]);
    }
    else if(step == 'Summary'){
      this.summaryForm.controls['profile_summary'].enable();
      this.isSummarySkipped = false;
      const element = document.getElementById("Summary");
      if(element){
        element.classList.remove("circle-skipped")
      }
      this.summaryForm.controls['profile_summary'].addValidators([Validators.required]);
    }
    else if(step == 'Project'){
      this.projectFields.enable();
      this.isProjectsSkipped = false;
      const element = document.getElementById("Project");
      if(element){
        element.classList.remove("circle-skipped")
      }
      // this.projectForm.controls['projects'].addValidators([Validators.required]);
    }
    else if(step == 'Achievement'){ 
      this.achievementForm.controls['achievement'].enable();
      this.isAchievementsSkipped = false;
      const element = document.getElementById("Achievement");
      if(element){
        element.classList.remove("circle-skipped")
      }
      this.achievementForm.controls['achievement'].addValidators([Validators.required]);
    }
  }

  handleGenAIResponse(step : String, selectedAIResponse : any){
    if(step == 'Work_History'){
      // let output = ""
      // this.workHistoryList?.map((item)=>{
      //   output = output + 
      //   `${item.job_title}
      //    ${item.company_name} | ${item.dates_of_employment}
      //    ${item.roles_and_responsibilities.map((res, index)=>{
      //      return `${index + 1}. ${res}\n`
      //    })}
      //   `
      // })
      // this.WorkHistoryFormGroup.controls['work_history'].setValue(output.trim().replace(/^\s+/gm, ''));
      // const element = document.getElementById("exp-card-info");
      //     if(element && this.educationGeminiResponse){
      //       element.classList.add("card-focused");
      //     }
      (this.workFields.at(this.currentWorkExpIndex) as FormGroup).controls['description'].setValue(this.workHistoryList?.join('\n'));
    }
    else if(step == "Summary"){
      this.summaryForm.controls['profile_summary'].setValue(selectedAIResponse);
    }
    else if(step == "Achievement"){
      if(this.achievement_genai){
        this.achievementForm.controls['achievement'].setValue(this.achievement_genai?.join('\n'))
      }
    }
    else if(step == "Project"){
      (this.projectFields.at(this.currentProjectIndex) as FormGroup).controls['description'].setValue(this.projectList_genai?.join('\n'));
    }
  }

  panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: true}
  ];

  work_panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: true}
  ];

  project_panels: { id : number, title: string, expanded: boolean}[] = [
    { id: 0, title: '...', expanded: true}
  ];

  toggleExpansion(index:number) {
    this.panels[index].expanded = !this.panels[index].expanded;
  }

  toggleWorkExpansion(index : number){
    this.work_panels[index].expanded = !this.work_panels[index].expanded
  }

  toggleProjectExpansion(index : number){
    this.project_panels[index].expanded = !this.project_panels[index].expanded
  }

  addEducation(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.panels = [...this.panels, panel];
    this.addEducationField();
  }

  addWorkExp(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.work_panels = [...this.work_panels, panel];
    this.addWorkField();
  }

  addProject(){
    let panel = { id : this.panels.length, title : "...", expanded : true}
    this.project_panels = [...this.project_panels, panel];
    this.addProjectField();
  }

  addSkill(skill : any){
    if(this.skillsForm.controls['skills'].value){
      this.skillsForm.controls['skills'].setValue(this.skillsForm.controls['skills'].value + ', ' + skill)
    }
    else{
      this.skillsForm.controls['skills'].setValue(skill)
    }
  }

  checkHandler(index : number){
    if(this.workFields.at(index).get('current_work_check')?.value){
      (this.workFields.at(index) as FormGroup).controls['end_month'].setValue("Present");
      (this.workFields.at(index) as FormGroup).controls['end_month'].disable();
      (this.workFields.at(index) as FormGroup).controls['end_year'].disable();
    }
    else{
      (this.workFields.at(index) as FormGroup).controls['end_month'].setValue("");
      (this.workFields.at(index) as FormGroup).controls['end_month'].enable();
      (this.workFields.at(index) as FormGroup).controls['end_year'].enable();
    }
  }

  optimizeWorkHistory(index : number){
    this.currentWorkExpIndex = index
    if(this.workFields.at(index).get('description')?.value){
      this.is_work_history_loading = true;
      const experience_prompt = this.promptService.get_NEW_Experience_prompt(this.workFields.at(index).get('description')?.value);
      console.log(experience_prompt);
      this.genaiService.getGeminiProResponse(experience_prompt).then((response)=>{
        console.log(response);
        this.workHistoryList = response.split("###").filter((item)=>{return item != ""});;
        this.is_work_history_loading = false;
      });
    }
  }

  optimizeProject(index : number){
    this.currentProjectIndex = index;
    if(this.projectFields.at(index).get('description')?.value){
      this.is_projects_loading = true;
      const project_prompt = this.promptService.get_New_Project_Prompt(this.projectFields.at(index).get('description')?.value);
      this.genaiService.getGeminiProResponse(project_prompt).then((response)=>{
      console.log(response);
      this.projectList_genai = response.split("###").filter((item)=>{return item != ""});
      this.is_projects_loading = false;
    });
    }
  }
}
