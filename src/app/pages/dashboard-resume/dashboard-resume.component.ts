import { Component, OnInit, OnDestroy, inject, Signal, AfterViewInit, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA, 
          Output, EventEmitter, effect, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ResumeList2Component } from '../resume-list2/resume-list2.component';
import { ResumeFormTabbedComponent } from '../resume-form-tabbed/resume-form-tabbed.component';
import { ResumeForm2Component } from '../resume-form2/resume-form2.component';
import { ResumeFormComponent } from '../resume-form/resume-form.component';
import { TemplatesPageComponent } from '../templates-page/templates-page.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { LayoutService } from 'src/app/layout/layout.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JobApplication, Resume, RoundDetails } from 'src/app/services/resume.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ResumeService } from 'src/app/services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { JobApplicationRequest, ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import moment from 'moment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JobApplicationStatus } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { SelectModule } from 'primeng/select';
import { ApplicationListComponent } from '../dashboard-job-application/application-list/application-list.component';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { SectionDesc } from 'src/app/services/store/user-store';
import { ImportExistingResumeComponent } from '../import-existing-resume/import-existing-resume.component';

interface Option {
  name : string;
  code : string;
}

@Component({
    selector: 'app-resume-dashboard',
    standalone: true,
    imports: [RouterLink, RouterModule, StyleClassModule, NgOptimizedImage, MenuModule, ChartModule, FormsModule, ChartModule, ReactiveFormsModule, MenuModule, DividerModule, MatFormFieldModule, MatInputModule, TableModule, DialogModule, InputTextModule, MatProgressBarModule, StyleClassModule, ResumeList2Component, PanelMenuModule, ResumeFormTabbedComponent, ResumeForm2Component, ButtonModule, TemplatesPageComponent, ResumeFormComponent, ApplicationListComponent, MatMenuModule, MatIconModule, MatToolbarModule, MatSelectModule, MatMenuModule, SelectModule, ImportExistingResumeComponent],
    templateUrl: './dashboard-resume.component.html',
    styleUrl : './dashboard-resume.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class DashboardResumeComponent implements OnInit, OnDestroy, AfterViewInit {

  isActionInProgress: boolean = true;

  items!: MenuItem[];

  chartData: any;

  chartOptions: any;

  subscriptions: Array<Subscription> = [];

  showResumeGenerator = false;

  productDialog: boolean = false;

  showResumeGeneratorHeader =  false;

  searchQuery = new FormControl();

  filteredRoleCategoryValue = new FormControl()
  filteredResumeCategoryValue = new FormControl()
  roleCategories : Array<Option> = []
  resumeCategories : Array<Option> = []
  tempResumes : ResumeListDataItem[] = []

  template1_sections  : Array<SectionDesc> = [
     {
        section: 'PROFILE_SUMMARY',
        description: 'A brief summary of your skills and experience.',
        isAdded: false,
        isPremium: false,
        tags: 'summary, profile, objective',
        label: 'Summary',
        title : 'Profile summary',
        editable_section_title : 'Profile Summary'
    },
    {
        section: 'EDUCATION',
        description: 'Details about your educational background.',
        isAdded: false,
        isPremium: false,
        tags: 'education, school, degree',
        label: 'Education',
        title : 'Education',
        editable_section_title : "Education"
    },
    {
        section: 'RELEVANT_COURSEWORK',
        description: 'Relevant coursework you have completed.',
        isAdded: false,
        isPremium: false,
        tags: 'coursework, classes, subjects',
        label: 'Coursework',
        title : 'Relevant coursework',
        editable_section_title :'Relevant Coursework'
    },
    {
        section: 'SKILLS_BULLET_POINTS',
        description: 'A list of your skills in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, abilities, competencies',
        label: 'Skills (B.P.)',
        title : 'Skills with bullet points',
        editable_section_title : 'Skills'
    },
    {
        section: 'SKILLS_CATEGORY',
        description: 'Categorized list of your skills.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, categorized, grouped',
        label: 'Skills (Category)',
        title : 'Skills category',
        editable_section_title : 'Skills'
    },
    {
        section: 'WORK_EXPERIENCE',
        description: 'Your professional work experience.',
        isAdded: false,
        isPremium: false,
        tags: 'experience, work, job',
        label: 'Experience',
        title : 'Work experience',
        editable_section_title : 'Experience'
    },
    {
        section: 'PROJECT',
        description: 'Projects you have worked on.',
        isAdded: false,
        isPremium: false,
        tags: 'projects, portfolio, work',
        label: 'Projects',
        title : 'Project',
        editable_section_title : 'Project'
    },
    {
        section: 'CERTIFICATIONS',
        description: 'Certifications you have earned.',
        isAdded: false,
        isPremium: false,
        tags: 'certifications, licenses, credentials',
        label: 'Certifications',
        title : 'Certification',
        editable_section_title : 'Certifications'
    },
    {
        section: 'CERTIFICATIONS_BULLET_POINTS',
        description: 'A list of your certifications in bullet points.',
        isAdded: false,
        isPremium: true,
        tags: 'certifications, bullet points, list',
        label: 'Certs (B.P.)',
        title : 'Certification with bullet points',
        editable_section_title : 'Certifications'
    },
    {
        section: 'ACHIEVEMENTS_BULLET_POINTS',
        description: 'Your achievements in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'achievements, accomplishments, awards',
        label: 'Achievements',
        title : 'Achievements with bullet points',
        editable_section_title : 'Achievements'
    },
    {
        section: 'ACHIEVEMENT_WITH_DESC',
        description: 'Detailed description of your achievements.',
        isAdded: false,
        isPremium: true,
        tags: 'achievements, description, details',
        label: 'Accomplishments',
        title : 'Accomplishments',
        editable_section_title : 'Accomplishments'
    }
  ];

  template9right_sections: Array<SectionDesc> = [
    {
      section: 'PROFILE_SUMMARY',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      description: 'A brief summary of your skills and experience.',
      isAdded: true,
      isPremium: false,
      tags: 'summary, profile, objective',
      label: 'Summary'
    },
    {
      section: 'WORK_EXPERIENCE',
      title: 'Work experience',
      editable_section_title: 'Experience',
      description: 'Your professional work experience.',
      isAdded: true,
      isPremium: false,
      tags: 'experience, work, job',
      label: 'Experience'
    },
    {
      section: 'PROJECT',
      title: 'Project',
      editable_section_title: 'Project',
      description: 'Projects you have worked on.',
      isAdded: true,
      isPremium: false,
      tags: 'projects, portfolio, work',
      label: 'Projects'
    }
  ]

    template9left_sections: Array<SectionDesc> = [
      {
        section: 'RELEVANT_COURSEWORK',
        title: 'Relevant coursework',
        editable_section_title: 'Relevant Coursework',
        description: 'Relevant coursework you have completed.',
        isAdded: true,
        isPremium: false,
        tags: 'coursework, classes, subjects',
        label: 'Coursework'
      },
      {
        section: 'SKILLS_BULLET_POINTS',
        title: 'Skills with bullet points',
        editable_section_title: 'Skills',
        description: 'A list of your skills in bullet points.',
        isAdded: true,
        isPremium: false,
        tags: 'skills, abilities, competencies',
        label: 'Skills (B.P.)'
      },
      {
        section: 'EDUCATION',
        title: 'Education',
        editable_section_title: 'Education',
        description: 'Details about your educational background.',
        isAdded: true,
        isPremium: false,
        tags: 'education, school, degree',
        label: 'Education'
      },
      {
        section: 'CERTIFICATIONS_BULLET_POINTS',
        title: 'Certification with bullet points',
        editable_section_title: 'Certifications',
        description: 'A list of your certifications in bullet points.',
        isAdded: true,
        isPremium: true,
        tags: 'certifications, bullet points, list',
        label: 'Certs (B.P.)'
      },
      {
        section: 'ACHIEVEMENTS_BULLET_POINTS',
        title: 'Achievements with bullet points',
        editable_section_title: 'Achievements',
        description: 'Your achievements in bullet points.',
        isAdded: true,
        isPremium: false,
        tags: 'achievements, accomplishments, awards',
        label: 'Achievements'
      }
    ]

  template10_sections: Array<SectionDesc> = [
    {
      section: 'PROFILE_SUMMARY',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      description: 'A brief summary of your skills and experience.',
      isAdded: true,
      isPremium: false,
      tags: 'summary, profile, objective',
      label: 'Summary'
    },
    {
      section: 'EDUCATION',
      title: 'Education',
      editable_section_title: 'Education',
      description: 'Details about your educational background.',
      isAdded: true,
      isPremium: false,
      tags: 'education, school, degree',
      label: 'Education'
    },
    {
      section: 'SKILLS_CATEGORY',
      title: 'Skills category',
      editable_section_title: 'Skills',
      description: 'A list of your skills by category.',
      isAdded: true,
      isPremium: false,
      tags: 'skills, abilities, competencies',
      label: 'Skills'
    },
    {
      section: 'WORK_EXPERIENCE',
      title: 'Work experience',
      editable_section_title: 'Experience',
      description: 'Your professional work experience.',
      isAdded: true,
      isPremium: false,
      tags: 'experience, work, job',
      label: 'Experience'
    },
    {
      section: 'PROJECT',
      title: 'Project',
      editable_section_title: 'Project',
      description: 'Projects you have worked on.',
      isAdded: true,
      isPremium: false,
      tags: 'projects, portfolio, work',
      label: 'Projects'
    },
    {
      section: 'ACHIEVEMENT_WITH_DESC',
      title: 'Accomplishments',
      editable_section_title: 'Accomplishments',
      description: 'Your accomplishments with descriptions.',
      isAdded: true,
      isPremium: false,
      tags: 'achievements, accomplishments, awards',
      label: 'Accomplishments'
    }
  ]

  private resumeService: ResumeService = inject(ResumeService);
  private pdfToImageService: PdfToImageService = inject(PdfToImageService);
  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  private platformId: object =  inject(PLATFORM_ID);
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  isFilterOff : boolean = true
  isSearchOff : boolean = true
  resumeList : Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();
  filteredResumesList : Signal<ResumeListDataItem[]> = this.userStore.getFilteredResumes();
  loginStatus : Signal<boolean> = this.userStore.getUserLoginStatus();
  subs: Array<Subscription> = [];
  resumes : ResumeListDataItem[] = []
  filteredResumes : ResumeListDataItem[] = []
  isFirstTimeCalling : boolean = true;

  locations = [];
  filteredLocationValue: string = '';

  constructor(private router: Router, public layoutService: LayoutService) {
      effect(()=>{
        this.setFilterValues();
        console.log(this.loginStatus());

        if(this.loginStatus() && this.isFirstTimeCalling){
          console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

          this.isFirstTimeCalling = false;
          this.loadResumeData()
        }
      })
  }

  ngOnInit() {
      // this.sidenavService.toggleCollapsed();

      this.filteredResumeCategoryValue.setValue("");
      this.filteredRoleCategoryValue.setValue("");
      this.searchQuery.setValue("");
      this.userStore.setFilteredResumes(this.resumeList());
      
      this.searchQuery.valueChanges.subscribe((e)=>{
          if(e.length == 0){
            this.isSearchOff = true
          }
          else{
            this.isSearchOff = false
          }
          this.filteredResumes = this.resumeList().filter((resume) =>
            resume.title.toLowerCase().includes(this.searchQuery.value.toLowerCase())
          );
          this.userStore.setFilteredResumes(this.filteredResumes);
        
      })

      this.items = [
          { label: 'Add New', icon: 'pi pi-fw pi-plus' },
          { label: 'Remove', icon: 'pi pi-fw pi-minus' }
      ];

      if(isPlatformBrowser(this.platformId)){
         setTimeout(() => {
           this.getResumes();
         }, 50);
      }

       
  }

  getResumes(){
    // if(this.resumeList().length == 0){
    //   this.isActionInProgress = true;
    //   this.subs.push(this.resumeService.getResumeListByOwnerId(
    //       this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
    //         console.log(data);
    //       data.map(async (e : ResumeListDataItem)=>{
    //       await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.us-east-1.amazonaws.com/" + e.documentUrl).then((bytes)=>{
    //           e.imageBytes = bytes;
    //           this.resumes = [...this.resumes, e]
    //           let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
    //           if (!roleExists && e.roleCategory.length > 0) {
    //             this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
    //           }

    //           let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
    //           if (!resumeCategoryExists && e.resumeCategory.length > 0) {
    //             this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
    //           }
    //       })
    //       this.userStore.setResumeDataListItems(this.resumes);
    //       this.userStore.setFilteredResumes([...this.resumes]);
    //       setTimeout(() => {
    //         this.isActionInProgress = false;
    //       }, 100);

    //       })
    //       }, (err: any) => {
    //          console.log("Error: " + err);
    //          debugger;
    //       }));
    // }
    // else{

    //     this.resumeList().map((e)=>{
    //       let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
    //           if (!roleExists && e.roleCategory.length > 0) {
    //             this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
    //           }

    //           let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
    //           if (!resumeCategoryExists && e.resumeCategory.length > 0) {
    //             this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
    //           }
    //     })
    //     setTimeout(() => {
    //       this.isActionInProgress = false;
    //     }, 100);
    // }   
    if(this.loginStatus() && this.isFirstTimeCalling){
      this.isFirstTimeCalling = false;
      this.loadResumeData()
    }
  }

  private async loadResumeData() {
    try {
      await this.getResumeData(); // Ensure it completes before proceeding
      console.log("Resume data loaded successfully");
    } catch (error) {
      console.error("Error loading resume data", error);
    }
  }

  getResumeData(){
    if(this.resumeList().length == 0 && this.loginStatus()){
      this.isActionInProgress = true;
      this.subs.push(this.resumeService.getResumeListByOwnerId(
          this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
            console.log(data);
            if(data.length>0){
              data.map(async (e : ResumeListDataItem)=>{
          await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.us-east-1.amazonaws.com/" + e.documentUrl).then((bytes)=>{
              e.imageBytes = bytes;
              let resume : Resume = JSON.parse(e.resumeJson);
              if(!resume?.sections && !resume?.multipleSections){
                if(resume.template_details.template_name == 'TEMPLATE_1'){
                  resume.sections= this.template1_sections
                  resume.multipleSections = []
                }
                else if(resume.template_details.template_name == 'TEMPLATE_9'){
                  resume.multipleSections = [[...this.template9right_sections], [...this.template9left_sections]]
                  resume.sections = []
                }
                else if(resume.template_details.template_name == 'TEMPLATE_10'){
                  resume.sections= this.template10_sections
                  resume.multipleSections = []
                }
              }
              console.log(resume);
              
              e.resumeJson = JSON.stringify(resume)
              this.resumes = [...this.resumes, e]
              let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
              if (!roleExists && e.roleCategory.length > 0) {
                this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
              }

              let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
              if (!resumeCategoryExists && e.resumeCategory.length > 0) {
                this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
              }
          },
         (error : any)=>{
          if(error.status == 403){
            console.log("PDF Fetching Error");
          }
         })
          this.userStore.setResumeDataListItems(this.resumes);
          this.userStore.setFilteredResumes([...this.resumes]);
          this.isActionInProgress = false;
          })
            }
          else{
            this.isActionInProgress = false;
          }
          
          }));
        }
      else{
        this.resumeList().map((e)=>{
          let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
              if (!roleExists && e.roleCategory.length > 0) {
                this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
              }

              let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
              if (!resumeCategoryExists && e.resumeCategory.length > 0) {
                this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
              }
        })
        this.isActionInProgress = false;
      }      
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
          // //this.sidenavService.setCollapsed(true);
          }, 100);
  }

  receiveFromChild(isActionInProgress: boolean) {
    this.isActionInProgress = isActionInProgress; 
  }

  setFilterValues(){
    this.resumeList().map((e)=>{
      let roleExists = this.roleCategories.some(role => role.name.includes(e.roleCategory));
          if (!roleExists && e.roleCategory.length > 0) {
            this.roleCategories = [...this.roleCategories , { name: e.roleCategory, code: '' }];
          }

          let resumeCategoryExists = this.resumeCategories.some(category => category.name.includes(e.resumeCategory));
          if (!resumeCategoryExists && e.resumeCategory.length > 0) {
            this.resumeCategories = [...this.resumeCategories , { name: e.resumeCategory, code: '' }];
          }
    })
  }

  

  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Handles the "Add Job Application" button click.
   */
  onAddResume(): void {
    this.userStore.setResumeForm(new Resume());
    this.userStore.updateSelectedResumeListItem(new ResumeListDataItem());
    this.userStore.setIsChangeInNewResume(false);
    this.router.navigateByUrl('/user/resumes/resume');
  }

  filterApplications(){    
    this.isFilterOff = false
    this.searchQuery.disable()
    console.log(this.filteredResumeCategoryValue.value?.name, this.filteredRoleCategoryValue.value?.name);
    if((this.filteredResumeCategoryValue.value?.name?this.filteredResumeCategoryValue.value?.name.length > 0 : false) && (this.filteredRoleCategoryValue.value?.name?this.filteredRoleCategoryValue.value?.name.length > 0 : false)){
    this.filteredResumes = this.resumeList().filter(resume => (resume.roleCategory == this.filteredRoleCategoryValue.value?.name) && (resume.resumeCategory == this.filteredResumeCategoryValue.value?.name))
    }
    else if(this.filteredRoleCategoryValue.value?.name?this.filteredRoleCategoryValue.value?.name.length > 0 : false){
    this.filteredResumes = this.resumeList().filter(resume => (resume.roleCategory == this.filteredRoleCategoryValue.value?.name))
    }
    else if(this.filteredResumeCategoryValue.value?.name?this.filteredResumeCategoryValue.value?.name.length > 0 : false){
    this.filteredResumes = this.resumeList().filter(resume => (resume.resumeCategory == this.filteredResumeCategoryValue.value?.name))
    }
    this.userStore.setFilteredResumes(this.filteredResumes);
  }


  unselectFilter(){
    this.isFilterOff = true
    this.searchQuery.enable()
    this.filteredResumeCategoryValue.setValue("");
    this.filteredRoleCategoryValue.setValue("")
    this.userStore.setFilteredResumes(this.resumeList());
  }

  onSearch(){
    
  }

  onFilter(){

  }
}
