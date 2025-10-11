import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Define a simple interface for the illustration function
interface IllustrationFunc {
  (sectionType: string): SafeHtml;
}

@Pipe({
  name: 'safeHtmlCache',
  standalone: true
})
export class SafeHtmlCachePipe implements PipeTransform {
  private cache = new Map<string, SafeHtml>();

  constructor(private sanitizer: DomSanitizer) {}

  transform(sectionType: string, illustrationFn: IllustrationFunc): SafeHtml {
    if (!sectionType || !illustrationFn) {
      return '';
    }

    // Check if the result is already cached
    if (this.cache.has(sectionType)) {
      return this.cache.get(sectionType)!;
    }

    // If not cached, call the function and store the result
    const result = illustrationFn(sectionType);
    this.cache.set(sectionType, result);
    
    return result;
  }
}
