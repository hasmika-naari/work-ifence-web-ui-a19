import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { COpportunitiesService } from './c-opportunities.service';

@Component({
    selector: 'app-c-opportunities',
    imports: [MatCardModule, MatButtonModule, MatMenuModule, FeathericonsModule],
    templateUrl: './c-opportunities.component.html',
    styleUrl: './c-opportunities.component.scss'
})
export class COpportunitiesComponent {

    constructor(
        private cOpportunitiesService: COpportunitiesService
    ) {}

    ngOnInit(): void {
        this.cOpportunitiesService.loadChart();
    }

}