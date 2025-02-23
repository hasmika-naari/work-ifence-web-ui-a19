import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AnnualProfitService } from './annual-profit.service';

@Component({
    selector: 'app-annual-profit',
    imports: [MatCardModule],
    templateUrl: './annual-profit.component.html',
    styleUrl: './annual-profit.component.scss'
})
export class AnnualProfitComponent {

    constructor(
        private annualProfitService: AnnualProfitService
    ) {}

    ngOnInit(): void {
        this.annualProfitService.loadChart();
    }

}