import { Component } from '@angular/core';


@Component({
  selector: 'app-trust-indicators',
  standalone: true,
  imports: [],
  templateUrl: './trust-indicators.component.html',
  styleUrls: ['./trust-indicators.component.scss']
})
export class TrustIndicatorsComponent {
  // Trust indicators with icons and messages
  trustIndicators = [
    {
      icon: 'security',
      title: 'Privacy First',
      description: 'Your data is always protected with enterprise-grade security and encryption'
    },
    {
      icon: 'verified_user',
      title: 'Industry Standards',
      description: 'Built on best practices for resume optimization and job search strategies'
    },
    {
      icon: 'people',
      title: 'Community Backed',
      description: 'Developed with input from HR professionals and career coaches'
    },
    {
      icon: 'support_agent',
      title: 'Expert Support',
      description: 'Access to knowledgeable support when you need assistance'
    }
  ];
}