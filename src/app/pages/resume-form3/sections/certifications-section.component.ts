

import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-certifications-section',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="section certifications">
      @if (certifications && certifications.length) {
        <ul class="certifications-list">
          @for (cert of certifications; track cert; let i = $index) {
            <li class="certification-item">
              <span class="cert-details">
                <span class="cert-title">{{ cert.data?.name || cert.data?.title }}</span>
                @if (cert.data?.authority || cert.data?.organization || cert.data?.issuer) {
                  <span class="cert-org">
                    {{ cert.data?.authority || cert.data?.organization || cert.data?.issuer }}
                  </span>
                }
              </span>
              @if (cert.data?.date || cert.data?.year) {
                <span class="cert-year">
                  {{ cert.data?.date || cert.data?.year }}
                </span>
              }
              <span class="cert-actions">
                <button  class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Edit" icon="pi pi-pencil" (click)="onEdit(i)" [disabled]="cert.actions && cert.actions.edit === false"></button>
                <button  class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Delete" icon="pi pi-trash" (click)="onDelete(i)" [disabled]="cert.actions && cert.actions.delete === false"></button>
                <button  class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Move Up" icon="pi pi-arrow-up" (click)="onMoveUp(i)" [disabled]="i === 0 || (cert.actions && cert.actions.moveUp === false)"></button>
                <button  class="p-button-rounded p-button-text p-button-sm" pButton pTooltip="Move Down" icon="pi pi-arrow-down" (click)="onMoveDown(i)" [disabled]="i === certifications.length - 1 || (cert.actions && cert.actions.moveDown === false)"></button>
              </span>
            </li>
          }
        </ul>
      } @else {
        <div class="no-certifications-message">
          No certifications added yet.
        </div>
      }
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
  @Input() isPrintMode: boolean = false;

  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();

  onEdit(i: number) { this.edit.emit(i); }
  onDelete(i: number) { this.delete.emit(i); }
  onMoveUp(i: number) { this.moveUp.emit(i); }
  onMoveDown(i: number) { this.moveDown.emit(i); }

}
