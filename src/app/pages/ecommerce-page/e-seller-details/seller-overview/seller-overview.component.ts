import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SellerOverviewService } from './seller-overview.service';

@Component({
    selector: 'app-seller-overview',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './seller-overview.component.html',
    styleUrl: './seller-overview.component.scss'
})
export class SellerOverviewComponent {

    constructor(
        private sellerOverviewService: SellerOverviewService
    ) {}

    ngOnInit(): void {
        this.sellerOverviewService.loadChart();
    }

}