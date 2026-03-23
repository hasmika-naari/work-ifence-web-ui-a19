import { MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnChanges, OnDestroy, OnInit, Optional, Output, Signal, SimpleChanges, inject, Input } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
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
import { DialogData } from '../confirm-dialog/confirm-dialog.component';
import { Resume1TemplateComponent } from '../template/template.component';
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
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-preview-resume',
  standalone: true,
  imports: [RouterModule, CarouselModule, ReactiveFormsModule, FormsModule, MatStepperModule, ToastModule, MatFormFieldModule, InputTextModule, MatDialogModule, MatInputModule, ButtonModule, MatButtonModule, AccordionModule, TextareaModule, TooltipModule, MatIconModule, MatExpansionModule, Resume1TemplateComponent, ResumeTemplate2Component, ResumeTemplate3Component, ResumeTemplate4Component, ResumeTemplate5Component, ResumeTemplate6Component, ResumeTemplate7Component, ResumeTemplate8Component, ResumeTemplate9Component, ResumeTemplate10Component],
  templateUrl: './preview-resume.component.html',
  styleUrls: ['./preview-resume.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class PreviewResumeComponent implements OnInit, OnDestroy, OnChanges {
  private messageService = inject(MessageService, { optional: true });
  private router = inject(Router, { optional: true });

  isUserNameCheckInProgress = false;
  isToggled = false;
  selectedTemplateName: string = '';
  private themeToggleSubscription: Subscription;
  isDownloading = false;


  @Input() templateName: string | undefined;
  @Input() downloadInProgress = false;
  @Input() downloadRestricted = false;
  @Input() downloadRestrictionTooltip = 'Upgrade your plan to download this premium template';
  @Output() download = new EventEmitter<'pdf' | 'word'>();
  @Output() upgrade = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  public dialogRef: MatDialogRef<PreviewResumeComponent> | null = inject(MatDialogRef<PreviewResumeComponent>, { optional: true });
  public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
  public data: DialogData | undefined = inject(MAT_DIALOG_DATA, { optional: true });

  constructor(
  ) {
    // Prefer @Input if provided; otherwise use dialog data if available
    this.selectedTemplateName = this.templateName || (this.data as any)?.name || '';
    this.themeToggleSubscription = this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }


    ngOnDestroy(): void {
      if (this.themeToggleSubscription) {
        this.themeToggleSubscription.unsubscribe();
      }
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['downloadInProgress'] && !changes['downloadInProgress'].currentValue) {
        this.isDownloading = false;
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
      this.isDownloading = true;
      
      if (this.dialogRef) {
        this.dialogRef.close({ event: 'DOWNLOAD', format });
      } else {
        this.download.emit(format);
        setTimeout(() => {
          if (!this.downloadInProgress) {
            this.isDownloading = false;
          }
        }, 300);
      }
    } catch (error: any) {
      this.isDownloading = false;
      
      // Always show error toast at top-right
      if (this.messageService) {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Download Error',
          detail: error?.message || error?.toString() || 'An error occurred during download.',
          life: 7000
        });
      }
    }
  }

  onNoClick(){
    if (this.dialogRef) {
      this.dialogRef.close({event : 'CANCEL'});
    } else {
      this.close.emit();
    }
  }

  onUpgradeHandler(): void {
    this.upgrade.emit();
  }

  getDownloadTooltip(format: 'pdf' | 'word'): string {
    if (this.downloadRestricted) {
      return this.downloadRestrictionTooltip;
    }

    return format === 'pdf' ? 'Download as PDF' : 'Download as Word';
  }

  getDownloadLabel(format: 'pdf' | 'word'): string {
    const base = format === 'pdf' ? 'Download PDF' : 'Download Word';
    return this.downloadRestricted ? `${base} (Upgrade Required)` : base;
  }

   
  }
