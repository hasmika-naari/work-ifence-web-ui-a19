
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
  selector: 'resume-contact-section',
  standalone: true,
  imports: [CommonModule, ButtonModule, IconsModule],
  template: `
    <div class="resume-contact-details" (mouseenter)="showEdit=true" (mouseleave)="showEdit=false" style="position:relative;">
      <p-button *ngIf="showEdit"
        icon="pi pi-pencil"
        [rounded]="true"
        [text]="true"
        severity="success"
        class="resume-contact-edit-icon"
        (click)="showContact()">
      </p-button>
      <ng-container *ngIf="!isEmpty; else dummyContact">
        <div class="resume-contact-name-line">
          <span class="resume-contact-name">{{ data.fname }} {{ data.lname }}</span>
        </div>
        <div class="resume-contact-subtitle-line">
          <span class="resume-contact-subtitle">{{ data.subTitle }}</span>
        </div>
        <div class="resume-contact-icons-line">
          <span class="icon"><i class="pi pi-phone"></i></span> <span class="resume-contact-label">{{ data.phone_number }}</span>
          <span class="icon"><i class="pi pi-envelope"></i></span> <span class="resume-contact-label">{{ data.email }}</span>
          <span *ngIf="data.linkedIn_profile_display_name" class="icon"><i class="pi pi-linkedin"></i></span>
          <a *ngIf="data.linkedIn_profile_display_name" class="resume-contact-link" [href]="data.linkedIn_profile" target="_blank">{{ data.linkedIn_profile_display_name }}</a>
          <span *ngIf="data.github_profile_display_name" class="icon"><i class="pi pi-github"></i></span>
          <a *ngIf="data.github_profile_display_name" class="resume-contact-link" [href]="data.github_profile" target="_blank">{{ data.github_profile_display_name }}</a>
        </div>
      </ng-container>
      <ng-template #dummyContact>
        <div class="resume-contact-name-line">
          <span class="resume-contact-name">Alexandra Rodriguez</span>
        </div>
        <div class="resume-contact-subtitle-line">
          <span class="resume-contact-subtitle">Senior Full-Stack Developer &amp; Technical Lead</span>
        </div>
        <div class="resume-contact-icons-line">
          <span class="icon"><i class="pi pi-phone"></i></span> <span class="resume-contact-label">+1 (415) 789-0123</span>
          <span class="icon"><i class="pi pi-envelope"></i></span> <span class="resume-contact-label">{{ 'alexandra.rodriguez@email.com' }}</span>
          <span class="icon"><i class="pi pi-linkedin"></i></span>
          <a class="resume-contact-link" href="https://linkedin.com/in/alexrodriguez-dev" target="_blank">alexrodriguez-dev</a>
          <span class="icon"><i class="pi pi-github"></i></span>
          <a class="resume-contact-link" href="https://github.com/alexrodriguez-dev" target="_blank">alexrodriguez-dev</a>
        </div>
      </ng-template>
    </div>
      `,
      styleUrls: ['./contact-section.component.scss']
    })
    export class ContactSectionComponent {
      @Input() data: any;
      @Input() sectionConfig: any;
      showEdit = false;

      get isEmpty(): boolean {
        return !this.data || (!this.data.fname && !this.data.lname && !this.data.email && !this.data.phone_number);
      }

      @Output() editContact = new EventEmitter<void>();

      showContact() {
        this.editContact.emit();
      }
    }
