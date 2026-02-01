import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private readonly collapsedSubject = new BehaviorSubject<boolean>(false);
  readonly isCollapsed$ = this.collapsedSubject.asObservable();

  private readonly expandedSubject = new BehaviorSubject<boolean>(true);
  readonly isExpanded$ = this.expandedSubject.asObservable();

  private readonly mouseOverSubject = new BehaviorSubject<boolean>(false);
  readonly isMouseOver$ = this.mouseOverSubject.asObservable();

  private readonly itemsSubject = new BehaviorSubject<any[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  setCollapsed(value: boolean): void {
    this.collapsedSubject.next(value);
  }

  toggleCollapsed(): void {
    this.setCollapsed(!this.collapsedSubject.value);
  }

  setExpanded(value: boolean): void {
    this.expandedSubject.next(value);
  }

  setMouseOver(value: boolean): void {
    this.mouseOverSubject.next(value);
  }

  setItems(items: any[]): void {
    this.itemsSubject.next(items);
  }

  addItems(items: any[]): void {
    this.itemsSubject.next([...this.itemsSubject.value, ...items]);
  }

  getItemsSnapshot(): any[] {
    return this.itemsSubject.value;
  }

}
