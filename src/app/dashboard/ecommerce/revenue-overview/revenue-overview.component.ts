import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RevenueOverviewService } from './revenue-overview.service';

@Component({
    selector: 'app-revenue-overview',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './revenue-overview.component.html',
    styleUrl: './revenue-overview.component.scss'
})
export class RevenueOverviewComponent {

    constructor(
        private revenueOverviewService: RevenueOverviewService
    ) {}

    ngOnInit(): void {
        this.revenueOverviewService.loadChart();
    }

}