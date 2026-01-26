import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-table-shell',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './admin-table-shell.component.html',
  styleUrls: ['./admin-table-shell.component.scss'],
})
export class AdminTableShellComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;

  @Input() loading = false;

  @Input() length = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 20;
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  @Output() readonly pageChange = new EventEmitter<PageEvent>();

  onPage(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
