import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface UpdateItem {
  title: string;
  subtitle: string;
  time: string;
  type: 'offer' | 'interview' | 'rejected' | 'applied';
}

@Component({
  selector: 'app-recent-updates',
  standalone: true,
  imports: [CommonModule, MatCardModule , MatIconModule],
  templateUrl: './recent-updates.component.html',
  styleUrls: ['./recent-updates.component.scss']
})
export class RecentUpdatesComponent implements OnInit {

  updates: UpdateItem[] = [
    {
      title: 'Offer Received',
      subtitle: 'Data Analyst at FinCorp',
      time: '2 days ago',
      type: 'offer'
    },
    {
      title: 'Interview Scheduled',
      subtitle: 'Product Manager at WebSolutions',
      time: '3 days ago',
      type: 'interview'
    },
    {
      title: 'Rejected',
      subtitle: 'Software Engineer at CodeWorks',
      time: '5 days ago',
      type: 'rejected'
    },
    {
      title: 'Application Submitted',
      subtitle: 'Sales Associate at RetailPro',
      time: '1 week ago',
      type: 'applied'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}