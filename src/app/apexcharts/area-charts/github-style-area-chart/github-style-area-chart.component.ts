import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GithubStyleAreaChartService } from './github-style-area-chart.service';
import { GithubStyleAreaChart2Service } from './github-style-area-chart2.service';

@Component({
    selector: 'app-github-style-area-chart',
    imports: [MatCardModule],
    templateUrl: './github-style-area-chart.component.html',
    styleUrl: './github-style-area-chart.component.scss'
})
export class GithubStyleAreaChartComponent {

    constructor(
        private githubStyleAreaChartService: GithubStyleAreaChartService,
        private githubStyleAreaChart2Service: GithubStyleAreaChart2Service
    ) {}

    ngOnInit(): void {
        this.githubStyleAreaChartService.loadChart();
        this.githubStyleAreaChart2Service.loadChart();
    }

}