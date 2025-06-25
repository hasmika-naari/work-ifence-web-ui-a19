import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, inject } from '@angular/core';
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
    MatButtonModule,AccordionModule,TextareaModule,
    MatIconModule,MatExpansionModule, Resume1TemplateComponent, ResumeTemplate2Component, ResumeTemplate3Component,
    ResumeTemplate4Component, ResumeTemplate5Component, ResumeTemplate6Component, ResumeTemplate7Component, ResumeTemplate8Component, ResumeTemplate9Component
    , ResumeTemplate10Component],
  templateUrl: './preview-resume.component.html',
  styleUrls: ['./preview-resume.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class PreviewResumeComponent implements OnInit, OnDestroy {

    isUserNameCheckInProgress = false;
    isToggled = false;
    selectedTemplateName : String = ""
    private themeToggleSubscription: Subscription;


    public dialogRef: MatDialogRef<PreviewResumeComponent> = inject( MatDialogRef<PreviewResumeComponent>);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    public data: DialogData = inject(MAT_DIALOG_DATA);

    constructor(private router: Router) {
      this.selectedTemplateName = this.data.name;
      this.themeToggleSubscription = this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
      });
    }
    ngOnDestroy(): void {
      if (this.themeToggleSubscription) {
        this.themeToggleSubscription.unsubscribe();
      }
    }
 
    ngOnInit(): void {

  }

  onConfirmHandler(){
    this.dialogRef.close({event : 'CONFIRM'});
  }

  onDownloadHandler(){
    this.dialogRef.close({event : 'DOWNLOAD'});
  }

  onNoClick(){
    this.dialogRef.close({event : 'CANCEL'});
  }

   
  }
