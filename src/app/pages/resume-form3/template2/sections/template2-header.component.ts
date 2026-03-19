import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TEMPLATE2_ACTION_ICONS, TEMPLATE2_CONTACT_ICON_CLASSES } from '../template2-icons';

@Component({
  selector: 'app-template2-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './template2-header.component.html',
})
export class Template2HeaderComponent {
  @Input() contact: any = {};
  @Input() imageSrc: string | null = null;
  @Input() initials: string = 'WF';
  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Output() edit = new EventEmitter<void>();
  readonly actionIcons = TEMPLATE2_ACTION_ICONS;

  get fullName(): string {
    const name = `${this.contact?.fname || ''} ${this.contact?.lname || ''}`.trim();
    return name || 'Your Name';
  }

  get email(): string {
    return this.contact?.email || this.contact?.email_address || this.contact?.emailId || '';
  }

  get portfolio(): string {
    return this.contact?.portfolio_url || this.contact?.portfolio_link || '';
  }

  get linkedInLabel(): string {
    return this.contact?.linkedIn_profile_display_name || 'LinkedIn';
  }

  get githubLabel(): string {
    return this.contact?.github_profile_display_name || 'GitHub';
  }

  get portfolioLabel(): string {
    const portfolio = this.portfolio;
    if (!portfolio) {
      return '';
    }

    try {
      return new URL(portfolio).hostname.replace(/^www\./, '');
    } catch {
      return portfolio;
    }
  }

  get contactMeta(): Array<{ iconClass: string; text: string; href?: string }> {
    const items: Array<{ iconClass: string; text: string; href?: string }> = [];

    if (this.email) {
      items.push({ iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.email, text: this.email, href: `mailto:${this.email}` });
    }

    if (this.contact?.phone_number) {
      items.push({ iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.phone, text: this.contact.phone_number, href: `tel:${this.contact.phone_number}` });
    }

    if (this.contact?.linkedIn_profile) {
      items.push({ iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.linkedin, text: this.linkedInLabel, href: this.contact.linkedIn_profile });
    }

    if (this.contact?.github_profile) {
      items.push({ iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.github, text: this.githubLabel, href: this.contact.github_profile });
    }

    if (this.portfolio) {
      items.push({ iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.portfolio, text: this.portfolioLabel, href: this.portfolio });
    }

    return items;
  }
}