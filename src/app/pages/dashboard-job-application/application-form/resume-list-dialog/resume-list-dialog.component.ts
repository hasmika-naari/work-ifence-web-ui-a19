import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, Signal, inject} from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { Subscription } from 'rxjs';
import { ResumeService } from 'src/app/services/resume.service';
import { Account } from 'src/app/services/profile.model';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { ResumeListDataItem } from 'src/app/services/work-ifence-data.model';
import { PdfToImageService } from 'src/app/services/shared/pdf-image-conversion.service';
import { Resume } from 'src/app/services/resume.model';
import { SectionDesc } from 'src/app/services/store/user-store';



export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-list-dialog',
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
    HeaderWorkIfenceComponent,
    MatFormFieldModule,MatAutocompleteModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './resume-list-dialog.component.html',
  styleUrls: ['./resume-list-dialog.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeListDialogComponent {
  
  resumes : ResumeListDataItem[] = []
  filteredResumes :ResumeListDataItem[] = [];
  selectedResume: ResumeListDataItem = new ResumeListDataItem();

  private userStore: UserStoreService = inject(UserStoreService);
  
  searchQuery: string = '';
  subs: Array<Subscription> = [];
  userAccount: Signal<Account> = this.userStore.getUserAccount();
  resumeDataItemList: Signal<ResumeListDataItem[]> = this.userStore.getResumeDataItemList();

  imageCache: { [url: string]: string } = {};

    template1_sections  : Array<SectionDesc> = [
        {
          section : 'PROFILE_SUMMARY',
          title : 'Profile summary'
        },
        {
          section : 'EDUCATION',
          title : 'Education'
        },
        {
          section : 'RELEVANT_COURSEWORK',
          title : 'Relevant coursework'
        },
        {
          section : 'SKILLS_BULLET_POINTS',
          title : 'Skills with bullet points'
        },
        {
          section : 'WORK_EXPERIENCE',
          title : 'Work experience'
        },
        {
          section : 'PROJECT',
          title : 'Project'
        },
        {
          section : 'CERTIFICATIONS',
          title : 'Certification'
        },
        {
          section : 'ACHIEVEMENTS_BULLET_POINTS',
          title : 'Achievements with bullet points'
        }
      ]
  
    template9right_sections  : Array<SectionDesc> = [
        {
        section : 'PROFILE_SUMMARY',
        title : 'Profile summary'
      },
      {
        section : 'WORK_EXPERIENCE',
        title : 'Work experience'
      },
      {
        section : 'PROJECT',
        title : 'Project'
      }
      ]
  
      template9left_sections : Array<SectionDesc> = [
     
      {
        section : 'RELEVANT_COURSEWORK',
        title : 'Relevant coursework'
      },
      {
        section : 'SKILLS_BULLET_POINTS',
        title : 'Skills with bullet points'
      },
       {
        section : 'EDUCATION',
        title : 'Education'
      },
      {
        section : 'CERTIFICATIONS_BULLET_POINTS',
        title : 'Certification with bullet points'
      },
      {
        section : 'ACHIEVEMENTS_BULLET_POINTS',
        title : 'Achievements with bullet points'
      }
    ]
  
    template10_sections : Array<SectionDesc> = [
      {
        section : 'PROFILE_SUMMARY',
        title : 'Profile summary'
      },
      {
        section : 'EDUCATION',
        title : 'Education'
      },
      {
        section : 'SKILLS_CATEGORY',
        title : 'Skills category'
      },
      {
        section : 'WORK_EXPERIENCE',
        title : 'Work experience'
      },
      {
        section : 'PROJECT',
        title : 'Project'
      },
      {
        section : 'ACHIEVEMENT_WITH_DESC',
        title : 'Accomplishments'
      }
    ]


  constructor(
    public dialogRef: MatDialogRef<ResumeListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public resumeService : ResumeService,
    public pdfToImageService : PdfToImageService
  ) {}

  ngOnInit(): void {
    console.log(this.resumeDataItemList().length + "Lengthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", this.resumeDataItemList().length == 0);
    
    if(this.resumeDataItemList().length == 0){
        this.subs.push(this.resumeService.getResumeListByOwnerId(
            this.userAccount().id).subscribe((data: ResumeListDataItem[])=> {
            data.map(async (e : ResumeListDataItem)=>{
            await this.pdfToImageService.convertPdfToImageBytesThroughUrl("https://workifence.s3.amazonaws.com/" + e.documentUrl).then((bytes)=>{
                e.imageBytes = bytes;
                 let resume : Resume = JSON.parse(e.resumeJson);
                              if(!resume?.sections && !resume?.multipleSections){
                                if(resume.template_details.template_name == 'TEMPLATE_1'){
                                  resume.sections= this.template1_sections
                                  resume.multipleSections = []
                                }
                                else if(resume.template_details.template_name == 'TEMPLATE_9'){
                                  resume.multipleSections = [this.template9right_sections, this.template9left_sections]
                                  resume.sections = []
                                }
                                else if(resume.template_details.template_name == 'TEMPLATE_10'){
                                  resume.sections= this.template10_sections
                                  resume.multipleSections = []
                                }
                              }
                              e.resumeJson = JSON.stringify(resume)
                this.resumes = [...this.resumes, e]
                this.filteredResumes = [...this.filteredResumes, e]
            })
            this.userStore.setResumeDataListItems(this.resumes);
            })
            }));
    }
    else{
        this.resumes = [...this.resumeDataItemList()];
        this.filteredResumes = [...this.resumeDataItemList()];
    }
  }

  filterResumes(): void {
    this.filteredResumes = this.resumes.filter((resume) =>
      resume.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectResume(resume: ResumeListDataItem): void {
    this.selectedResume = resume;
  }

  onCancel(): void {
    this.dialogRef.close({event : 'CANCEL'});

  }

  onConfirm(): void {
    this.userStore.updateSelectedResumeListItem(this.selectedResume);
    this.dialogRef.close({event : 'CONFIRM'});
  }

}
