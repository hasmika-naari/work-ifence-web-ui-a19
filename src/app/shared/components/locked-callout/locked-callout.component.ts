import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-locked-callout',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './locked-callout.component.html',
  styleUrl: './locked-callout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockedCalloutComponent {
  @Input() title = 'Locked';
  @Input() message = 'Upgrade to unlock this feature.';
  @Input() actionLabel = 'View pricing';
  @Input() icon: string = 'lock';

  @Output() actionClick = new EventEmitter<void>();
}
