import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/services/store/user-store.service';

import { ButtonModule } from 'primeng/button';
import { IconsModule } from 'src/app/shared/icons.module';

@Component({
  selector: 'resume-contact-section',
  standalone: true,
  imports: [ButtonModule, IconsModule],
  template: `
    <div class="section contact-info template1-section template1-contact-section resume-contact-details" (mouseenter)="showEdit=true" (mouseleave)="showEdit=false" style="position:relative;">
      @if (showEdit && !isFormPanleClosed) {
        <p-button
          icon="pi pi-pencil"
          [rounded]="true"
          [text]="true"
          severity="success"
          class="resume-contact-edit-icon"
          (click)="showContact()">
        </p-button>
      }
      <div class="resume-contact-name-line">
        <span class="resume-contact-name">{{ data.fname }} {{ data.lname }}</span>
      </div>
      <div class="resume-contact-subtitle-line">
        <span class="resume-contact-subtitle">{{ data.subTitle }}</span>
      </div>
      <div class="resume-contact-icons-line">
        <span class="icon fa-icon phone-icon"></span> <span class="resume-contact-label">{{ data.phone_number }}</span>
        @if (data.email_address || data.linkedIn_profile_display_name || data.github_profile_display_name) {
          <span class="resume-contact-separator">|</span>
        }
        @if (data.email_address) {
          <span class="icon fa-icon email-icon"></span> <span class="resume-contact-label">{{ data.email_address }}</span>
          @if (data.linkedIn_profile_display_name || data.github_profile_display_name) {
            <span class="resume-contact-separator">|</span>
          }
        }
        @if (data.linkedIn_profile_display_name) {
          <span class="icon fa-icon linkedin-icon"></span>
        }
        @if (data.linkedIn_profile_display_name) {
          <a class="resume-contact-link" [href]="data.linkedIn_profile" target="_blank">{{ data.linkedIn_profile_display_name }}</a>
          @if (data.github_profile_display_name) {
            <span class="resume-contact-separator">|</span>
          }
        }
        @if (data.github_profile_display_name) {
          <span class="icon fa-icon github-icon"></span>
        }
        @if (data.github_profile_display_name) {
          <a class="resume-contact-link" [href]="data.github_profile" target="_blank">{{ data.github_profile_display_name }}</a>
        }
      </div>
    </div>
    `,
  styleUrls: ['./contact-section.component.scss']
})
export class ContactSectionComponent {
  @Input() data: any;
  @Input() sectionConfig: any;
  @Input() isFormPanleClosed: boolean = false;
  @Input() isPrintMode: boolean = false;
  showEdit = false;
  @Output() editContact = new EventEmitter<any>();
  @Output() dataChange = new EventEmitter<void>();

  ngOnChanges() {
    this.dataChange.emit();
  }

  showContact() {
    this.editContact.emit(this.data);
  }
}
