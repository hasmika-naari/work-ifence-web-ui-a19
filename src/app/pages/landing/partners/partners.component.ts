import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit, AfterViewInit {
  // Partners list
  partners = [
    { name: 'Company 1', logo: '/images/partner/partner1.png' },
    { name: 'Company 2', logo: '/images/partner/partner2.png' },
    { name: 'Company 3', logo: '/images/partner/partner3.png' },
    { name: 'Company 4', logo: '/images/partner/partner4.png' },
    { name: 'Company 5', logo: '/images/partner/partner5.png' },
    { name: 'Company 6', logo: '/images/partner/partner6.png' },
    { name: 'Company 7', logo: '/images/partner/partner7.png' },
    { name: 'Company 8', logo: '/images/partner/partner8.png' },
    { name: 'Company 9', logo: '/images/partner/partner9.png' },
    { name: 'Company 10', logo: '/images/partner/partner10.png' }
  ];
  
  // Integrations
  integrations = [
    { name: 'LinkedIn', icon: 'language', description: 'Connect your profile for seamless importing', colorType: 'primary' },
    { name: 'Google Drive', icon: 'cloud', description: 'Store and access your documents anywhere', colorType: 'secondary' },
    { name: 'Gmail', icon: 'email', description: 'Track application emails automatically', colorType: 'primary' },
    { name: 'Calendar', icon: 'event', description: 'Schedule interviews and reminders', colorType: 'secondary' }
  ];

  ngOnInit(): void {
    // Initialization code if needed
  }

  ngAfterViewInit(): void {
    // After view is initialized
    this.adjustCarouselSpeed();
  }

  private adjustCarouselSpeed(): void {
    // Optional: Adjust animation speed based on screen width
    const partners = document.querySelectorAll('.partner-item');
    if (partners.length > 0) {
      // The animation speed could be adjusted based on the number of partners
      const track = document.querySelector('.partners-track') as HTMLElement;
      if (track) {
        // Optional dynamic speed adjustment
        const speed = Math.min(30, Math.max(15, partners.length * 2));
        track.style.animationDuration = `${speed}s`;
      }
    }
  }
}