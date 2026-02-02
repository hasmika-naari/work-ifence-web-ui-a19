import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule , MatIconModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

stats: StatItem[] = [
    { label: 'Applied', value: 24, icon: 'work', color: 'blue' },
    { label: 'Interviews', value: 5, icon: 'event', color: 'purple' },
    { label: 'Offers', value: 2, icon: 'handshake', color: 'green' },
    { label: 'Rejected', value: 6, icon: 'cancel', color: 'red' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}