

import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'resume-certifications-section',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="section certifications" style="text-align: left;">
      @if (certifications && certifications.length) {
        <ul class="certifications-list">
          @for (cert of certifications; track cert; let i = $index) {
            <li class="certification-item" style="display: flex; align-items: center; gap: 0em; padding: 0;">
              <span class="cert-details" style="flex: 1 1 auto;">
                <span class="cert-title" style="font-weight: 500;">{{ cert.data?.name || cert.data?.title }}</span>
                @if (cert.data?.authority || cert.data?.organization || cert.data?.issuer) {
                  <span class="cert-org" style="margin-left: 1.2em; color: #555;">
                    {{ cert.data?.authority || cert.data?.organization || cert.data?.issuer }}
                  </span>
                }
              </span>
              @if (cert.data?.date || cert.data?.year) {
                <span class="cert-year" style="min-width: 80px; text-align: right; color: #888;">
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
        <div class="no-certifications-message" style="color: #b0b0b0; font-size: 1em; padding: 1em 0; text-align: left;">
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
