import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TotalPerformanceService } from './total-performance.service';

@Component({
    selector: 'app-total-performance',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './total-performance.component.html',
    styleUrl: './total-performance.component.scss'
})
export class TotalPerformanceComponent {

    constructor(
        private totalPerformanceService: TotalPerformanceService
    ) {}

    ngOnInit(): void {
        this.totalPerformanceService.loadChart();
    }

}