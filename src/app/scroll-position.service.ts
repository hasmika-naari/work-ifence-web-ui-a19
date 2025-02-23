import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  private positions: { [url: string]: number } = {};

  savePosition(url: string, position: number): void {
    this.positions[url] = position;
  }

  getPosition(url: string): number {
    return this.positions[url] || 0;
  }
}
