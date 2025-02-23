import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DailyAverageIncomeService } from './daily-average-income.service';

@Component({
    selector: 'app-daily-average-income',
    imports: [MatCardModule],
    templateUrl: './daily-average-income.component.html',
    styleUrl: './daily-average-income.component.scss'
})
export class DailyAverageIncomeComponent {

    constructor(
        private dailyAverageIncomeService: DailyAverageIncomeService
    ) {}

    ngOnInit(): void {
        this.dailyAverageIncomeService.loadChart();
    }

}