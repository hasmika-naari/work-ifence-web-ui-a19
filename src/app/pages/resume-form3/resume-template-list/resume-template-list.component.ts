import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, 
          OnDestroy, OnInit, Output, Signal, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { Resume } from 'src/app/services/resume.model';
import { ResumeTemplateDto } from 'src/app/services/store/user-store';
import { ResumeTemplateFacadeService } from 'src/app/resume-portal/data/resume-template-facade.service';
import { ResumeTemplateSelectionService } from 'src/app/services/resume-template-selection.service';
import type { ResumeTemplateUi } from 'src/app/resume-portal/data/resume-template.ui.model';
import {
  buildResumeTemplateIdentity,
  resolveCanonicalTemplateKey,
} from 'src/app/resume-portal/utils/resume-template-key.util';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-resume-template-list',
  standalone: true,
  imports: [RouterModule, MatSnackBarModule],
  templateUrl: './resume-template-list.component.html',
  styleUrls: ['./resume-template-list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class ResumeTemplateListComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes

  private userStore: UserStoreService = inject(UserStoreService);
  private templateFacade: ResumeTemplateFacadeService = inject(ResumeTemplateFacadeService);
  private templateSelection = inject(ResumeTemplateSelectionService);
  private snackBar = inject(MatSnackBar);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  resumeForm : Signal<Resume> = this.userStore.getResumeForm();

  @Output() contact = new EventEmitter();
  subs: Array<Subscription> = [];

  templates = computed(() => this.templateFacade.templates());

  constructor(
      private router : Router, 
      public templateService : TemplatesService) {
       
      }


  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }


  ngOnInit() {
    this.templateFacade.loadTemplates('available');
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

  selectTemplateHandler($event: Event, template: ResumeTemplateUi){
    const gate = this.templateFacade.canUseTemplate(template);
    if (!gate.allowed) {
      this.snackBar.open(this.templateFacade.explainReason(gate.reason), 'View plans', { duration: 3200 });
      this.templateFacade.handleDenied(gate.reason, this.router.url);
      return;
    }

    const resumeTemplate = this.toResumeTemplate(template);
    this.templateSelection.setCatalogSelection({
      templateId: template.id ?? '',
      templateKey: resumeTemplate.templateKey ?? resumeTemplate.template_name,
      componentKey: resumeTemplate.componentKey ?? resumeTemplate.templateKey,
      version: template.version ?? '1.0',
      title: template.title ?? resumeTemplate.name,
      previewUrl: template.imageUrl ?? '',
      accessLevel: template.accessLevel ?? resumeTemplate.accessLevel,
    });
    this.userStore.updateResumeTemplate(resumeTemplate);
    this.userStore.setFlagOnTemplateSelected(resumeTemplate.template_name);
    this.contact.emit();

  }

  isSelected(template: ResumeTemplateUi): boolean {
    const currentTemplateKey = resolveCanonicalTemplateKey({
      id: this.resumeForm().template_details.id,
      templateKey: this.resumeForm().template_details.templateKey,
      componentKey: this.resumeForm().template_details.componentKey,
      template_name: this.resumeForm().template_details.template_name,
      imgPath: this.resumeForm().template_details.imgPath,
    });
    const selectedTemplateKey = resolveCanonicalTemplateKey({
      id: template.id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.imageUrl,
    });

    if (currentTemplateKey && selectedTemplateKey) {
      return currentTemplateKey === selectedTemplateKey;
    }

    const currentId = Number(this.resumeForm().template_details.id ?? 0);
    const templateId = Number(template.id ?? 0);
    return Number.isFinite(templateId) && templateId === currentId;
  }

  isPremium(template: ResumeTemplateUi): boolean {
    return this.templateFacade.isPremium(template);
  }

  isLocked(template: ResumeTemplateUi): boolean {
    return this.templateFacade.isLocked(template);
  }

  private toResumeTemplate(template: ResumeTemplateUi): ResumeTemplateDto {
    const parsedId = Number(template.id);
    const id = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 1;
    const identity = buildResumeTemplateIdentity({
      id,
      templateKey: template.templateKey,
      componentKey: template.componentKey,
      imageUrl: template.imageUrl,
    });

    return {
      id,
      name: template.title ?? `Template ${id}`,
      companyName: '',
      template_name: identity.template_name,
      imgPath: template.imageUrl ?? '',
      templateKey: identity.templateKey,
      componentKey: identity.componentKey,
      version: template.version ?? '1.0',
      accessLevel: template.accessLevel ?? '',
    } as ResumeTemplateDto;
  }

}
