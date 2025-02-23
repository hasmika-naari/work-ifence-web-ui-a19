import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { DealsStatisticsService } from './deals-statistics.service';

@Component({
    selector: 'app-deals-statistics',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './deals-statistics.component.html',
    styleUrl: './deals-statistics.component.scss'
})
export class DealsStatisticsComponent {

    constructor(
        private dealsStatisticsService: DealsStatisticsService
    ) {}

    ngOnInit(): void {
        this.dealsStatisticsService.loadChart();
    }

}