
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'summary-profile-form',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, EditorModule],
  templateUrl: './summary-form.page.html',
  styleUrls: ['./summary-form.page.scss'],
})

export class SummaryProfileFormPage implements OnInit {
  @Input() summary: string = '';
  @Output() edit = new EventEmitter<void>();

  ngOnInit() {}
}
