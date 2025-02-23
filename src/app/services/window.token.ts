import { InjectionToken, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const WINDOW = new InjectionToken<Window>('Window', {
  factory: () => inject(DOCUMENT).defaultView!,
});