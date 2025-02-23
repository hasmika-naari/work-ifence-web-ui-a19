// item-list.component.ts
import { Component, Input, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListOption, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-experiance-ai',
  standalone: true,
  imports: [MatSelectionList, MatListOption, MatCardModule],
  templateUrl: './experiance-ai.component.html',
  styleUrls: ['./experiance-ai.component.scss']
})
export class ExperianceAIComponent {
  // @Input() itemList: { title: string; description: string; }[] = [];

  @ViewChild('items') selectionList!: MatSelectionList;

  @Input() itemList: { title: string; description: string; }[] = [
    { title: 'Item 1', description: 'Description for Item 1' },
    { title: 'Item 2', description: 'Description for Item 2' },
    { title: 'Item 3', description: 'Description for Item 3' },
    { title: 'Item 4', description: 'Description for Item 4' },
    { title: 'Item 5', description: 'Description for Item 5' },
  ];


  onSelectionChange() {
    const selectedItems = this.selectionList.selectedOptions.selected.map(option => option.value);
    console.log('Selected Items:', selectedItems);
  }
}