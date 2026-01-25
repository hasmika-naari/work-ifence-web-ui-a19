import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ListColumn } from './list-column.model';

@Component({
  selector: 'fury-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements AfterViewInit {

  @Input() name!: string;
  @Input() columns!: ListColumn[];

  @ViewChild('filter') filter!: ElementRef<HTMLInputElement>;
  @Output() filterChange = new EventEmitter<string>();

  @Input() hideHeader = false;

  constructor(private readonly cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    if (!this.hideHeader) {
      fromEvent(this.filter.nativeElement, 'keyup').pipe(
        distinctUntilChanged(),
        debounceTime(150)
      ).subscribe(() => {
        this.filterChange.emit(this.filter.nativeElement.value);
      });
    }
  }

  toggleColumnVisibility(column: ListColumn, event: Event): void {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
    this.cd.markForCheck();
  }
}
