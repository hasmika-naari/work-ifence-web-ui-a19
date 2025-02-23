import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TicketsStatusService } from './tickets-status.service';

@Component({
    selector: 'app-tickets-status',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './tickets-status.component.html',
    styleUrl: './tickets-status.component.scss'
})
export class TicketsStatusComponent {

    constructor(
        private ticketsStatusService: TicketsStatusService
    ) {}

    ngOnInit(): void {
        this.ticketsStatusService.loadChart();
    }

}