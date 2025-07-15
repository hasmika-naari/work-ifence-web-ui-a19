import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, DialogData } from '../confirm-dialog/confirm-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MatCardModule } from '@angular/material/card';
import { SectionDesc, sections } from 'src/app/services/store/user-store';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Resume } from 'src/app/services/resume.model';


@Component({
  selector: 'app-add-section',
  standalone: true,
  imports: 
  [CommonModule, RouterLink, RouterOutlet, RouterModule,
  NgOptimizedImage,FooterComponent,CarouselModule,HeaderWorkIfenceComponent, MatDialogModule,
  MatInputModule,ButtonModule,ConfirmDialogComponent,MatButtonModule,MatIconModule, MatCardModule],
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AddSectionComponent implements OnInit, OnDestroy {

    isUserNameCheckInProgress = false;
    isToggled = false;
    selectedTemplateName : String = ""
    private themeToggleSubscription: Subscription;


    public dialogRef: MatDialogRef<AddSectionComponent> = inject( MatDialogRef<AddSectionComponent>);
    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    public data: DialogData = inject(MAT_DIALOG_DATA);
    resumeForm!: Signal<Resume>;

    currentSections! : Signal<SectionDesc[]>
    multipleSections! : Signal<SectionDesc[][]>

    add_sections : Array<SectionDesc> = []

    constructor(private router: Router, public userStore : UserStoreService) {
      this.selectedTemplateName = this.data.name;
      this.themeToggleSubscription = this.themeService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
      });
       this.currentSections = this.userStore.getCurrentSections()
    }
    ngOnDestroy(): void {
      if (this.themeToggleSubscription) {
        this.themeToggleSubscription.unsubscribe();
      }
    }
 
    ngOnInit(): void {
      this.resumeForm = this.userStore.getResumeForm();
      this.multipleSections= this.userStore.getMultipleColumnTemplateSections()

      if(this.resumeForm().template_details.template_name != 'TEMPLATE_9'){
      sections.map((e)=>{
        let sec = this.currentSections().find(s=> s.section == e.section)
        if(!sec){
          this.add_sections = [...this.add_sections, e]
        }
      })
    }
    else{
      sections.map((e)=>{
        let sec_right = this.multipleSections()[0].find(s=> s.section == e.section)
        let sec_left = this.multipleSections()[1].find(s=> s.section == e.section)
        if(!sec_right && !sec_left){
          this.add_sections = [...this.add_sections, e]
        }
      })
    }

  }

  addSection(section : SectionDesc){
    if(this.resumeForm().template_details.template_name != 'TEMPLATE_9'){
      this.userStore.setResumeSections([...this.currentSections(), section])
    }
    else{
      if(["PROFILE_SUMMARY","WORK_EXPERIENCE", "PROJECT", "SKILLS_CATEGORY", "ACHIEVEMENT_WITH_DESC", "CERTIFICATIONS"].includes(section.section)){
        this.userStore.setMultipleColumnTemplateSections([ [...this.multipleSections()[0], section], [...this.multipleSections()[1]]])
      }
      else{
        this.userStore.setMultipleColumnTemplateSections([ [...this.multipleSections()[0]], [...this.multipleSections()[1], section]])
      }
    }
    this.dialogRef.close()
  }

   
  }
