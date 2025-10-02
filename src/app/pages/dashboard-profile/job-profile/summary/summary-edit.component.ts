import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'summary-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    EditorModule,
    ProgressBarModule
  ],
  templateUrl: './summary-edit.component.html',
  styleUrls: ['./summary-edit.component.scss']
})
export class SummaryProfileEditComponent implements OnInit, OnChanges {
  @Input() summary: string = '';
  @Output() saveSummary = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      summary: [this.summary || '', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['summary'] && this.form) {
      const incoming = this.summary || '';
      if (this.form.value.summary !== incoming) {
        this.form.patchValue({ summary: incoming });
      }
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.saveSummary.emit(this.form.value.summary);
      this.close.emit();
    }, 1000); // Simulate save delay
  }
}
