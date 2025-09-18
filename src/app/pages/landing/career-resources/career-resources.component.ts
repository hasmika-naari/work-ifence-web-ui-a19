import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-career-resources',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './career-resources.component.html',
  styleUrls: ['./career-resources.component.scss']
})
export class CareerResourcesComponent {
  // Blog posts/resources
  resources = [
    {
      title: 'Top 10 Resume Mistakes to Avoid in 2025',
      excerpt: 'Learn about the most common resume mistakes that could be costing you interviews and how to fix them.',
      image: 'assets/img/blog/blog1.jpg',
      date: '20 Sept 2025',
      category: 'Resume Tips'
    },
    {
      title: 'How to Stand Out in Virtual Interviews',
      excerpt: 'Master the art of virtual interviews with these proven techniques for making a lasting impression.',
      image: 'assets/img/blog/blog2.jpg',
      date: '15 Sept 2025',
      category: 'Interview Skills'
    },
    {
      title: 'Using AI to Customize Your Job Applications',
      excerpt: 'Discover how artificial intelligence can help you tailor your job applications for better results.',
      image: 'assets/img/blog/blog3.jpg',
      date: '10 Sept 2025',
      category: 'Technology'
    }
  ];
  
  // Resource categories
  resourceCategories = [
    'Resume Tips',
    'Interview Skills',
    'Career Advice',
    'Job Search',
    'Technology',
    'Workplace Success'
  ];
}