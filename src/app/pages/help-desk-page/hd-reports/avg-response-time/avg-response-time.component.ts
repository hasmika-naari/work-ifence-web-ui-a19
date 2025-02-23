import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AvgResponseTimeService } from './avg-response-time.service';

@Component({
    selector: 'app-avg-response-time',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './avg-response-time.component.html',
    styleUrl: './avg-response-time.component.scss'
})
export class AvgResponseTimeComponent {

    constructor(
        private avgResponseTimeService: AvgResponseTimeService
    ) {}

    ngOnInit(): void {
        this.avgResponseTimeService.loadChart();
    }

}