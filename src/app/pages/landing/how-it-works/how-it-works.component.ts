import { Component } from '@angular/core';


@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [],
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent {
  // Steps for the process
  steps = [
    {
      number: '01',
      icon: 'upload_file',
      title: 'Upload Your Resume',
      description: 'Upload your existing resume or create a new one using our intuitive builder with professionally designed templates.'
    },
    {
      number: '02',
      icon: 'auto_fix_high',
      title: 'Optimize with AI',
      description: 'Our AI-powered tools analyze your resume, suggesting improvements to match job requirements and industry standards.'
    },
    {
      number: '03',
      icon: 'search',
      title: 'Apply to Jobs',
      description: 'Use your optimized resume to apply for positions that match your skills and career goals.'
    },
    {
      number: '04',
      icon: 'track_changes',
      title: 'Track Applications',
      description: 'Monitor all your applications in one centralized dashboard to stay organized throughout your job search.'
    }
  ];
}