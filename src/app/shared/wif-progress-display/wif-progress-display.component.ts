import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import moment from 'moment';
import { ScrollbarComponent } from 'src/@navan/shared/scrollbar/scrollbar.component';
@Component({
  selector: 'wif-progress-display',
  standalone: true,
  imports: [CommonModule, ScrollbarComponent, MatTabsModule, MatNavList, MatDividerModule, MatListModule,
  MatProgressBarModule],
  templateUrl: './wif-progress-display.component.html',
  styleUrls: ['./wif-progress-display.component.scss']
})
export class WifProgressDisplayComponent implements OnInit {

  @Input() message: string = 'Loading, please wait...';

  constructor() { }

  ngOnInit() {
  }

}
