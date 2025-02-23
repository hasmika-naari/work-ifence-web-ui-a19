import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { LiveCallsService } from './live-calls.service';

@Component({
    selector: 'app-live-calls',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './live-calls.component.html',
    styleUrl: './live-calls.component.scss'
})
export class LiveCallsComponent {

    constructor(
        private liveCallsService: LiveCallsService
    ) {}

    ngOnInit(): void {
        this.liveCallsService.loadChart();
    }

}