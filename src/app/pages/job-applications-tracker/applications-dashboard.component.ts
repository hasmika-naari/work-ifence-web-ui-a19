import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { UpcomingInterviewsComponent } from './upcoming-interviews/upcoming-interviews.component';
import { RecentUpdatesComponent } from './recent-updates/recent-updates.component';
import { ApplicationsTableComponent } from './applications-table/applications-table.component';

@Component({
  selector: 'app-applications-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardHeaderComponent, UpcomingInterviewsComponent, RecentUpdatesComponent, ApplicationsTableComponent],
  templateUrl: './applications-dashboard.component.html',
  styleUrls: ['./applications-dashboard.component.scss']
})
export class ApplicationsDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}