import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { CoursesOverviewService } from './courses-overview.service';

@Component({
    selector: 'app-courses-overview',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './courses-overview.component.html',
    styleUrl: './courses-overview.component.scss'
})
export class CoursesOverviewComponent {

    constructor(
        private coursesOverviewService: CoursesOverviewService
    ) {}

    ngOnInit(): void {
        this.coursesOverviewService.loadChart();
    }

}