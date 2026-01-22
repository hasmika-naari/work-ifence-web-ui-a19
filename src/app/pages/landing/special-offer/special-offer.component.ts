import { Component } from '@angular/core';


@Component({
  selector: 'app-special-offer',
  standalone: true,
  imports: [],
  templateUrl: './special-offer.component.html',
  styleUrls: ['./special-offer.component.scss']
})
export class SpecialOfferComponent {
  // Benefits included in the special offer
  benefits = [
    'Up to 5 resumes storage',
    'Basic AI-powered resume analysis',
    'Track up to 10 job applications',
    'Access to resume templates',
    'Export to PDF and Word formats'
  ];

  // Premium benefits
  premiumBenefits = [
    'Advanced AI optimization suggestions',
    'Unlimited application tracking',
    'Job match recommendations',
    'Priority support',
    'ATS compatibility check'
  ];
}