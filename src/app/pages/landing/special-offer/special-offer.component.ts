import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-special-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './special-offer.component.html',
  styleUrls: ['./special-offer.component.scss']
})
export class SpecialOfferComponent {
  // Benefits included in the special offer
  benefits = [
    'Unlimited resume storage',
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