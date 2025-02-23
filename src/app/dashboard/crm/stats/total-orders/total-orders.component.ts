import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TotalOrdersService } from './total-orders.service';

@Component({
    selector: 'app-total-orders',
    imports: [MatCardModule],
    templateUrl: './total-orders.component.html',
    styleUrl: './total-orders.component.scss'
})
export class TotalOrdersComponent {

    constructor(
        private totalOrdersService: TotalOrdersService
    ) {}

    ngOnInit(): void {
        this.totalOrdersService.loadChart();
    }

}