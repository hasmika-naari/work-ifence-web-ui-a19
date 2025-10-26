import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sectionItems',
  standalone: true
})
export class SectionItemsPipe implements PipeTransform {
  transform(sections: any[], sectionName: string): any[] {
    if (!sections || !sectionName) return [];
    const section = sections.find((s: any) => s.section === sectionName);
    return section?.items?.map((i: any) => i.data) ?? [];
  }
}
