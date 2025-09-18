import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent {
  // Partners list
  partners = [
    { name: 'Company 1', logo: 'assets/img/partner/partner1.png' },
    { name: 'Company 2', logo: 'assets/img/partner/partner2.png' },
    { name: 'Company 3', logo: 'assets/img/partner/partner3.png' },
    { name: 'Company 4', logo: 'assets/img/partner/partner4.png' },
    { name: 'Company 5', logo: 'assets/img/partner/partner5.png' },
    { name: 'Company 6', logo: 'assets/img/partner/partner6.png' }
  ];
  
  // Integrations
  integrations = [
    { name: 'LinkedIn', icon: 'language', description: 'Connect your profile for seamless importing' },
    { name: 'Google Drive', icon: 'cloud', description: 'Store and access your documents anywhere' },
    { name: 'Gmail', icon: 'email', description: 'Track application emails automatically' },
    { name: 'Calendar', icon: 'event', description: 'Schedule interviews and reminders' }
  ];
}