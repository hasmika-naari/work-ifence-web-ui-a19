import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LeadConversationsService } from './lead-conversations.service';

@Component({
    selector: 'app-lead-conversations',
    imports: [MatCardModule],
    templateUrl: './lead-conversations.component.html',
    styleUrl: './lead-conversations.component.scss'
})
export class LeadConversationsComponent {

    constructor(
        private leadConversationsService: LeadConversationsService
    ) {}

    ngOnInit(): void {
        this.leadConversationsService.loadChart();
    }

}