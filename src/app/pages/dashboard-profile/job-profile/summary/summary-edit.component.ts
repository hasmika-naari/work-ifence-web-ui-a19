import { Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { ProgressBarModule } from 'primeng/progressbar';

import { SidebarModule } from 'primeng/sidebar';
import { InputTextarea } from 'primeng/inputtextarea';
import { SummaryAiService } from './summary-ai.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'summary-profile-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
    ProgressBarModule,
    SidebarModule,
    InputTextarea
],
  templateUrl: './summary-edit.component.html',
  styleUrls: ['./summary-edit.component.scss']
})
export class SummaryProfileEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() summary: string = '';
  @Output() saveSummary = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  saving = false;
  aiForm: FormGroup;
  aiDrawerVisible = false;
  aiGenerating = false;
  aiError: string | null = null;

  private aiGenerationSub?: Subscription;

  constructor(private fb: FormBuilder, private readonly aiService: SummaryAiService) {
    this.aiForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(10)]],
      generated: ['']
    });
  }

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

  ngOnDestroy(): void {
    this.aiGenerationSub?.unsubscribe();
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

  openAiDrawer(): void {
    if (!this.aiDrawerVisible) {
      const preset = this.stripHtml(this.form.value.summary ?? '');
      if (preset && !this.aiForm.controls['prompt'].dirty) {
        this.aiForm.patchValue({ prompt: preset });
      }
      this.aiError = null;
      this.aiForm.patchValue({ generated: '' });
    }
    this.aiDrawerVisible = true;
  }

  closeAiDrawer(): void {
    this.aiDrawerVisible = false;
    this.aiGenerating = false;
    this.aiError = null;
    this.aiGenerationSub?.unsubscribe();
    this.aiGenerationSub = undefined;
    this.aiForm.controls['generated'].setValue('');
    this.aiForm.controls['generated'].markAsPristine();
    this.aiForm.controls['generated'].markAsUntouched();
  }

  generateWithAi(): void {
    if (this.aiForm.invalid) {
      this.aiForm.markAllAsTouched();
      return;
    }

    const prompt = (this.aiForm.controls['prompt'].value ?? '').trim();
    if (!prompt) {
      return;
    }

    this.aiGenerating = true;
    this.aiError = null;
    this.aiForm.patchValue({ generated: '' });
    this.aiGenerationSub?.unsubscribe();

    this.aiGenerationSub = this.aiService.generateSummary(prompt).subscribe({
      next: (html: string) => {
        this.aiGenerating = false;
        this.aiForm.controls['generated'].setValue(html);
        this.aiForm.controls['generated'].markAsDirty();
        this.aiForm.controls['generated'].markAsTouched();
      },
      error: () => {
        this.aiGenerating = false;
        this.aiError = 'Unable to generate a summary right now. Please try again in a moment.';
      }
    });
  }

  resetGenerated(): void {
    if (this.aiGenerating) {
      return;
    }
    this.aiForm.controls['generated'].setValue('');
    this.aiForm.controls['generated'].markAsPristine();
    this.aiForm.controls['generated'].markAsUntouched();
  }

  applyGeneratedSummary(): void {
    const generated = (this.aiForm.controls['generated'].value ?? '').trim();
    if (!generated) {
      return;
    }

    const current = (this.form.controls['summary'].value ?? '').trim();
    const merged = current ? `${current}<p><br></p>${generated}` : generated;
    this.form.patchValue({ summary: merged });
    this.form.markAsDirty();
    this.form.markAsTouched();
    this.closeAiDrawer();
  }

  private stripHtml(value: string): string {
    return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
