import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AverageResponseTimeService } from './average-response-time.service';

@Component({
    selector: 'app-average-response-time',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './average-response-time.component.html',
    styleUrl: './average-response-time.component.scss'
})
export class AverageResponseTimeComponent {

    constructor(
        private averageResponseTimeService: AverageResponseTimeService
    ) {}

    ngOnInit(): void {
        this.averageResponseTimeService.loadChart();
    }

}