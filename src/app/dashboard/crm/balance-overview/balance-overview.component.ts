import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { BalanceOverviewService } from './balance-overview.service';

@Component({
    selector: 'app-balance-overview',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './balance-overview.component.html',
    styleUrl: './balance-overview.component.scss'
})
export class BalanceOverviewComponent {

    constructor(
        private balanceOverviewService: BalanceOverviewService
    ) {}

    ngOnInit(): void {
        this.balanceOverviewService.loadChart();
    }

}