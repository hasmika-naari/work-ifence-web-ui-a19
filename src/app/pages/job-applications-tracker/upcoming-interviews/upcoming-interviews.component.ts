import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

interface Interview {
  role: string;
  company: string;
  datetime: string;
  type: 'Zoom' | 'On-site';
}


@Component({
  selector: 'app-upcoming-interviews',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './upcoming-interviews.component.html',
  styleUrls: ['./upcoming-interviews.component.scss']
})
export class UpcomingInterviewsComponent implements OnInit {

interviews: Interview[] = [
    {
      role: 'UX Designer',
      company: 'Creative Labs',
      datetime: 'Tomorrow, 10:00 AM',
      type: 'Zoom'
    },
    {
      role: 'Marketing Specialist',
      company: 'Innovatech',
      datetime: 'May 5, 2:00 PM',
      type: 'On-site'
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}