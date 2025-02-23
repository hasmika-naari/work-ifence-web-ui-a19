import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TotalRevenueService } from './total-revenue.service';

@Component({
    selector: 'app-total-revenue',
    imports: [MatCardModule],
    templateUrl: './total-revenue.component.html',
    styleUrl: './total-revenue.component.scss'
})
export class TotalRevenueComponent {

    constructor(
        private totalRevenueService: TotalRevenueService
    ) {}

    ngOnInit(): void {
        this.totalRevenueService.loadChart();
    }

}