import { MessageService } from 'primeng/api';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, inject, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TooltipModule } from 'primeng/tooltip';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, DialogData } from '../confirm-dialog/confirm-dialog.component';
import { Resume1TemplateComponent } from '../template/template.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { ResumeTemplate2Component } from '../template2/template2.component';
import { ResumeTemplate3Component } from '../template3/template3.component';
import { ResumeTemplate4Component } from '../template4/template4.component';
import { ResumeTemplate5Component } from '../template5/template5.component';
import { ResumeTemplate6Component } from '../template6/template6.component';
import { ResumeTemplate7Component } from '../template7/template7.component';
import { ResumeTemplate8Component } from '../template8/template8.component';
import { Subscription } from 'rxjs';
import { ResumeTemplate9Component } from '../template9/template9.component';
import { ResumeTemplate10Component } from '../template10/template10.component';


@Component({
  selector: 'app-preview-resume',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule, MatDialogModule,
    MatInputModule,ButtonModule,ConfirmDialogComponent,
    MatButtonModule,AccordionModule,TextareaModule,TooltipModule,
    MatIconModule,MatExpansionModule, Resume1TemplateComponent, ResumeTemplate2Component, ResumeTemplate3Component,
    ResumeTemplate4Component, ResumeTemplate5Component, ResumeTemplate6Component, ResumeTemplate7Component, ResumeTemplate8Component, ResumeTemplate9Component
    , ResumeTemplate10Component],
  templateUrl: './preview-resume.component.html',
  styleUrls: ['./preview-resume.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class PreviewResumeComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private messageService: MessageService) {
    // Prefer @Input if provided; otherwise use dialog data if available
    this.selectedTemplateName = this.templateName || (this.data as any)?.name || '';
    this.themeToggleSubscription = this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  isUserNameCheckInProgress = false;
  isToggled = false;
  selectedTemplateName: string = '';
    private themeToggleSubscription: Subscription;


  @Input() templateName: string | undefined;
  @Output() download = new EventEmitter<'pdf' | 'word'>();
  @Output() close = new EventEmitter<void>();

  public dialogRef: MatDialogRef<PreviewResumeComponent> | null = inject(MatDialogRef<PreviewResumeComponent>, { optional: true });
  public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
  public data: DialogData | undefined = inject(MAT_DIALOG_DATA, { optional: true });

    ngOnDestroy(): void {
      if (this.themeToggleSubscription) {
        this.themeToggleSubscription.unsubscribe();
      }
    }
 
    ngOnInit(): void {
      // When used inside a drawer, @Input templateName is set before ngOnInit
      // When used as a dialog, fall back to injected data
      this.selectedTemplateName = this.templateName || (this.data as any)?.name || '';
  }

  onConfirmHandler(){
    if (this.dialogRef) {
      this.dialogRef.close({event : 'CONFIRM'});
    }
  }


  onDownloadHandler(format: 'pdf' | 'word' = 'pdf') {
    try {
      if (this.dialogRef) {
        this.dialogRef.close({ event: 'DOWNLOAD', format });
      } else {
        this.download.emit(format);
      }
    } catch (error: any) {
      // Always show error toast at top-right
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Download Error',
        detail: error?.message || error?.toString() || 'An error occurred during download.',
        life: 7000
      });
    }
  }

  onNoClick(){
    if (this.dialogRef) {
      this.dialogRef.close({event : 'CANCEL'});
    } else {
      this.close.emit();
    }
  }

   
  }
