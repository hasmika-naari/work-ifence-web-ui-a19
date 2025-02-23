import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TotalGrowthService } from './total-growth.service';

@Component({
    selector: 'app-total-growth',
    imports: [MatCardModule],
    templateUrl: './total-growth.component.html',
    styleUrl: './total-growth.component.scss'
})
export class TotalGrowthComponent {

    constructor(
        private totalGrowthService: TotalGrowthService
    ) {}

    ngOnInit(): void {
        this.totalGrowthService.loadChart();
    }

}