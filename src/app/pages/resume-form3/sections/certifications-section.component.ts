

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'resume-certifications-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section certifications">
      <ul *ngIf="certifications && certifications.length; else dummyCertifications" class="certifications-list">
        <li *ngFor="let cert of certifications; let i = index" class="certification-item">
          <span class="cert-icon"><i class="pi pi-certificate"></i></span>
          <span class="cert-details">
            <span class="cert-title">{{ cert.title || cert.name || cert }}</span>
            <span class="cert-org" *ngIf="cert.organization || cert.company || cert.issuer">{{ cert.organization || cert.company || cert.issuer }}</span>
          </span>
          <span class="cert-year" *ngIf="cert.year || cert.passed || cert.date">{{ cert.year || cert.passed || cert.date }}</span>
          <span class="cert-actions" *ngIf="!isPreview">
            <button class="cert-action-btn" pButton pTooltip="Edit" icon="pi pi-pencil" (click)="edit.emit(i)"></button>
            <button class="cert-action-btn" pButton pTooltip="Delete" icon="pi pi-trash" (click)="delete.emit(i)"></button>
          </span>
        </li>
      </ul>
      <ng-template #dummyCertifications>
        <li class="certification-item">
          <span class="cert-icon"><i class="pi pi-certificate"></i></span>
          <span class="cert-details">
            <span class="cert-title">Certified Scrum Master</span>
            <span class="cert-org">Scrum Alliance</span>
          </span>
          <span class="cert-year">2022</span>
        </li>
        <li class="certification-item">
          <span class="cert-icon"><i class="pi pi-certificate"></i></span>
          <span class="cert-details">
            <span class="cert-title">Google Cloud Professional Developer</span>
            <span class="cert-org">Google</span>
          </span>
          <span class="cert-year">2021</span>
        </li>
        <li class="certification-item">
          <span class="cert-icon"><i class="pi pi-certificate"></i></span>
          <span class="cert-details">
            <span class="cert-title">Microsoft Azure Fundamentals</span>
            <span class="cert-org">Microsoft</span>
          </span>
          <span class="cert-year">2020</span>
        </li>
      </ng-template>
    </div>
  `,
  styleUrls: ['./certifications-section.component.scss']
})
export class CertificationsSectionComponent {
  /**
   * Accepts an array of either strings or objects with shape:
   * { title: string, organization?: string, year?: string, ... }
   */
  @Input() certifications: any[] = [];
  @Input() isPreview: boolean = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
}
