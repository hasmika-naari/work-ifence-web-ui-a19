import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SalesForecastService } from './sales-forecast.service';

@Component({
    selector: 'app-sales-forecast',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './sales-forecast.component.html',
    styleUrl: './sales-forecast.component.scss'
})
export class SalesForecastComponent {

    constructor(
        private salesForecastService: SalesForecastService
    ) {}

    ngOnInit(): void {
        this.salesForecastService.loadChart();
    }

}