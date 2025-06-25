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

    currentSections! : Signal<SectionDesc[]>

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
      sections.map((e)=>{
        let sec = this.currentSections().find(s=> s.section == e.section)
        if(!sec){
          this.add_sections = [...this.add_sections, e]
        }
      })

  }

  addSection(section : SectionDesc){
    this.userStore.setResumeSections([...this.currentSections(), section])
    this.dialogRef.close()
  }

   
  }
