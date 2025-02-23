import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { IssuesSummaryService } from './issues-summary.service';

@Component({
    selector: 'app-issues-summary',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './issues-summary.component.html',
    styleUrl: './issues-summary.component.scss'
})
export class IssuesSummaryComponent {

    constructor(
        private issuesSummaryService: IssuesSummaryService
    ) {}

    ngOnInit(): void {
        this.issuesSummaryService.loadChart();
    }

}