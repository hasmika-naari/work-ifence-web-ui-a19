import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, 
          OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { ResumeTemplate } from 'src/app/services/bee-compete.model';
import { ResumeTemplateDto } from 'src/app/services/store/user-store';
import { Resume } from 'src/app/services/resume.model';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-template-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage ],
  templateUrl: './resume-template-list.component.html',
  styleUrls: ['./resume-template-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplateListComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeForm : Signal<Resume> = this.userStore.getResumeForm();

  @Output() contact = new EventEmitter();
  subs: Array<Subscription> = [];

  templates: ResumeTemplate[] = [
    {
      id: 1,
      name: 'MonoPro',
      companyName : '',
      template_name: 'TEMPLATE_1',
      imgPath : 'assets/img/templates/template1.jpg'
    },
    // {
    //   id: 2,
    //   name: 'Template 2',
    //   companyName : '',
    //   template_name: 'TEMPLATE_2',
    //   imgPath : 'assets/img/template_2.png'
    // },
    // {
    //   id: 3,
    //   name: 'Template 3',
    //   companyName : '',
    //   template_name: 'TEMPLATE_3',
    //   imgPath : 'assets/img/template_3.png'
    // },
    // {
    //   id: 4,
    //   name: 'Template 4',
    //   companyName : '',
    //   template_name: 'TEMPLATE_4',
    //   imgPath : 'assets/img/template_4.png'
    // },
    // {
    //   id: 5,
    //   name: 'Template 5',
    //   companyName : '',
    //   template_name: 'TEMPLATE_5',
    //   imgPath : 'assets/img/template_5.png'
    // },
    // {
    //   id: 6,
    //   name: 'Template 6',
    //   companyName : '',
    //   template_name: 'TEMPLATE_6',
    //   imgPath : 'assets/img/template_6.png'
    // },
    // {
    //   id: 7,
    //   name: 'Template 7',
    //   companyName : '',
    //   template_name: 'TEMPLATE_7',
    //   imgPath : 'assets/img/template_7.png'
    // },
    // {
    //   id: 8,
    //   name: 'Template 8',
    //   companyName : '',
    //   template_name: 'TEMPLATE_8',
    //   imgPath : 'assets/img/template_8.png'
    // }
    {
      id: 9,
      name: 'DualEdge',
      companyName : '',
      template_name: 'TEMPLATE_9',
      imgPath : 'assets/img/templates/template9.jpg'
    },
    {
      id: 10,
      name: 'Modern',
      companyName : '',
      template_name: 'TEMPLATE_10',
      imgPath : 'assets/img/templates/template10.jpg'
    },
  ];

  constructor(
      private router : Router, 
      public templateService : TemplatesService) {
       
      }


  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
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
  }

  selectTemplateHandler($event: any, template: ResumeTemplate){
    this.userStore.updateResumeTemplate(template);
    this.contact.emit();

  }


}
