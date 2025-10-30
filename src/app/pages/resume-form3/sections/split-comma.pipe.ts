import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'splitComma', standalone: true })
export class SplitCommaPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    if (!value) return [];
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }
}