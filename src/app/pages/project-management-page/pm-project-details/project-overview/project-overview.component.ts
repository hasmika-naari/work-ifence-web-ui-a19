import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ProjectOverviewService } from './project-overview.service';

@Component({
    selector: 'app-project-overview',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './project-overview.component.html',
    styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent {

    constructor(
        private projectOverviewService: ProjectOverviewService
    ) {}

    ngOnInit(): void {
        this.projectOverviewService.loadChart();
    }

}