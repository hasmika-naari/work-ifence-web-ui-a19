import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { OrderStatisticsService } from './order-statistics.service';

@Component({
    selector: 'app-order-statistics',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './order-statistics.component.html',
    styleUrl: './order-statistics.component.scss'
})
export class OrderStatisticsComponent {

    constructor(
        private orderStatisticsService: OrderStatisticsService
    ) {}

    ngOnInit(): void {
        this.orderStatisticsService.loadChart();
    }

}