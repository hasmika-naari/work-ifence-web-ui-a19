import { Injectable } from '@angular/core';
import SimpleBar from 'simplebar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  scrollbar!: SimpleBar;

  private isSticky = new BehaviorSubject<boolean>(false);
  isSticky$ = this.isSticky.asObservable();

  constructor() {
  }

  setSticky(isSticky: boolean) {
    this.isSticky.next(isSticky);
  }
}
