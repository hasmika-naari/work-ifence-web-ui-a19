import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnDestroy, OnInit, Optional, Output, Signal, effect, inject, PLATFORM_ID, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { JobDescriptionAIResponse, Resume } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { ResumeService } from 'src/app/services/resume.service';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-resume-job-description',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    NgxEditorModule
],
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})
export class JobDescriptionComponent implements OnInit, OnDestroy {

  // Helper method to extract JSON from markdown code blocks
  private extractJSONFromMarkdown(content: string): string {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1].trim();
    }
    return content.trim();
  }

  private userStore: UserStoreService = inject(UserStoreService);
  private _formBuilder: FormBuilder = inject(FormBuilder);
  
  resumeSignalForm: Signal<Resume> = this.userStore.getResumeForm();
  
  experienceCategory: Array<string> = ["Internship", "Entry Level", "Associate", "Junior Level", "Mid-Senior Level", "Director", "Executive"];
  
  experienceOptions = this.experienceCategory.map(category => ({
    label: category,
    value: category
  }));

  // ngx-editor properties
  editor!: Editor | null;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }],
  ];

  is_summary_loading: boolean = false;

  @Output() contact = new EventEmitter();

  subs: Array<Subscription> = [];

  summaryForm = this._formBuilder.group({
    experience_level: [''],
    profile_summary: ['']
  });

  constructor(
      private router: Router,
      public promptService: PromptService,
      public resumeService: ResumeService,
      @Optional() private messageService: MessageService,
      @Inject(PLATFORM_ID) private platformId: Object) {
        effect(() => {
          this.setSummaryValues();
        });
      }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    // Destroy ngx-editor
    if (isPlatformBrowser(this.platformId) && this.editor) {
      this.editor.destroy();
    }
  }

  ngOnInit() {
    // Initialize ngx-editor only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.editor = new Editor();
    }

    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
      }
    }));
  }

  setSummaryValues() {
    // Can be extended if needed to sync form with store values
  }

  optimizeText(): void {
    const profileSummaryValue = this.summaryForm.controls['profile_summary'].value;

    // Validation checks
    if (!profileSummaryValue || profileSummaryValue.trim() === '') {
      if (this.messageService) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please enter a job description before using BotBro AI optimization.',
          life: 4000
        });
      }
      return;
    }

    if (profileSummaryValue.trim().length < 10) {
      if (this.messageService) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please provide a more detailed job description for better AI optimization.',
          life: 4000
        });
      }
      return;
    }

    this.is_summary_loading = true;
    const objective_prompt = this.promptService.prompt_testing(profileSummaryValue);
    
    this.resumeService.requestOpenAI({ "prompt": objective_prompt }).subscribe({
      next: (res: any) => {
        try {
          console.log(res['choices'][0]['message']['content']);
          const rawContent = res['choices'][0]['message']['content'];
          const jsonContent = this.extractJSONFromMarkdown(rawContent);
          let content: JobDescriptionAIResponse = JSON.parse(jsonContent);
          this.userStore.addJobDescriptionAIResponse(content);
          let resume_form = this.resumeSignalForm();
          resume_form.title = content.Job_Title;
          this.userStore.updateResumeForm(resume_form);
          
          this.is_summary_loading = false;
          
          if (this.messageService) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Job description analyzed successfully! AI insights have been generated.',
              life: 3000
            });
          }
          
          this.contact.emit();
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          this.is_summary_loading = false;
          
          if (this.messageService) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to process AI response. Please try again.',
              life: 5000
            });
          }
        }
      },
      error: (error) => {
        console.error('Error optimizing job description:', error);
        this.is_summary_loading = false;
        
        let errorMessage = 'Failed to optimize job description. Please try again.';
        
        if (error.status === 0) {
          errorMessage = 'Network connection error. Please check your internet connection and try again.';
        } else if (error.status === 401) {
          errorMessage = 'Authentication error. Please refresh the page and try again.';
        } else if (error.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Our team has been notified. Please try again later.';
        }
        
        if (this.messageService) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
          });
        }
      }
    });
  }

  goback($event: any) {
    this.userStore.updateSidebar(false);
    this.router.navigateByUrl('/user/resumes');
  }
}
