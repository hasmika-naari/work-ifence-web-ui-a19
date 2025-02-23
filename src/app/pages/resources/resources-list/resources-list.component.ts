import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ResumeOptiFlowStepsComponent } from '../../intro/resume-optimizer-intro/resume-opti-flow-steps/resume-opti-flow-steps.component';
import { ResumeOptiFlowSteps2Component } from '../../intro/resume-optimizer-intro/resume-opti-flow-steps2/resume-opti-flow-steps2.component';
import { FooterWorkifenceComponent } from '../../landing/footer-wifence/footer-wifence.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';

@Component({
    selector: 'app-resources-list',
    imports: [CommonModule, RouterLink,NgOptimizedImage,  FooterWorkifenceComponent,
        HeaderWorkIfenceComponent, 
        ResumeOptiFlowStepsComponent, ResumeOptiFlowSteps2Component],
    templateUrl: './resources.component.html',
    styleUrl: './resources.component.scss'
})
export class ResourcesComponent {


    ngAfterViewInit() {
    }

}
