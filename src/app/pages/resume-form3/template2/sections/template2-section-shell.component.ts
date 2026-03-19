import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TEMPLATE2_ACTION_ICONS, TEMPLATE2_SECTION_ICON_CLASSES } from '../template2-icons';

@Component({
  selector: 'app-template2-section-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template2-section-shell.component.html',
})
export class Template2SectionShellComponent {
  @Input() title: string = '';
  @Input() iconClass: string = TEMPLATE2_SECTION_ICON_CLASSES.DEFAULT;
  @Input() variant: 'sidebar' | 'main' = 'main';
  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Input() canAdd: boolean = false;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  readonly actionIcons = TEMPLATE2_ACTION_ICONS;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}