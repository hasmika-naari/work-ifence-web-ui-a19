import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-locked-overlay',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './locked-overlay.component.html',
  styleUrl: './locked-overlay.component.scss',
})
export class LockedOverlayComponent {
  @Input() title = 'Locked';
  @Input() message = 'Upgrade to unlock';
  @Input() actionLabel = 'Upgrade';

  @Output() actionClick = new EventEmitter<void>();
}
