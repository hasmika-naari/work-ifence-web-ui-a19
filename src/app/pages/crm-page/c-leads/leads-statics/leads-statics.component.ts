import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { LeadsStaticsService } from './leads-statics.service';

@Component({
    selector: 'app-leads-statics',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './leads-statics.component.html',
    styleUrl: './leads-statics.component.scss'
})
export class LeadsStaticsComponent {

    constructor(
        private leadsStaticsService: LeadsStaticsService
    ) {}

    ngOnInit(): void {
        this.leadsStaticsService.loadChart();
    }

}