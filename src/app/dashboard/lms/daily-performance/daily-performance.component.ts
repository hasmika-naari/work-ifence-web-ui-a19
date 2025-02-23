import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { DailyPerformanceService } from './daily-performance.service';

@Component({
    selector: 'app-daily-performance',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './daily-performance.component.html',
    styleUrl: './daily-performance.component.scss'
})
export class DailyPerformanceComponent {

    constructor(
        private dailyPerformanceService: DailyPerformanceService
    ) {}

    ngOnInit(): void {
        this.dailyPerformanceService.loadChart();
    }

}