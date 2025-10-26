
import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/services/store/user-store.service';
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
      <div class="resume-contact-name-line">
        <span class="resume-contact-name">{{ data.fname }} {{ data.lname }}</span>
      </div>
      <div class="resume-contact-subtitle-line">
        <span class="resume-contact-subtitle">{{ data.subTitle }}</span>
      </div>
      <div class="resume-contact-icons-line">
        <span class="icon"><i class="pi pi-phone"></i></span> <span class="resume-contact-label">{{ data.phone_number }}</span>
        <span class="icon"><i class="pi pi-envelope"></i></span> <span class="resume-contact-label">{{ data.email_address }}</span>
        <span *ngIf="data.linkedIn_profile_display_name" class="icon"><i class="pi pi-linkedin"></i></span>
        <a *ngIf="data.linkedIn_profile_display_name" class="resume-contact-link" [href]="data.linkedIn_profile" target="_blank">{{ data.linkedIn_profile_display_name }}</a>
        <span *ngIf="data.github_profile_display_name" class="icon"><i class="pi pi-github"></i></span>
        <a *ngIf="data.github_profile_display_name" class="resume-contact-link" [href]="data.github_profile" target="_blank">{{ data.github_profile_display_name }}</a>
      </div>
    </div>
      `,
      styleUrls: ['./contact-section.component.scss']
    })
    export class ContactSectionComponent {
      @Input() data: any;
      @Input() sectionConfig: any;
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
