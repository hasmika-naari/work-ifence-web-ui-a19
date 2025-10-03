import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ProgressBarModule } from 'primeng/progressbar';
import { finalize } from 'rxjs/operators';
import { ExperienceProfileItem } from './experience-profile-display.component';
import { ExperienceAiService } from './experience-ai.service';

const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

@Component({
  selector: 'experience-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    DrawerModule,
    ProgressBarModule
  ],
  templateUrl: './experience-profile-edit.component.html',
  styleUrls: ['./experience-profile-edit.component.scss']
})
export class ExperienceProfileEditComponent implements OnChanges {
  @Input() experience: ExperienceProfileItem | null = null;
  @Input() isEditing = false;
  @Input() editingIndex: number | null = null;
  @Output() saveExperience = new EventEmitter<{ experience: ExperienceProfileItem; index: number | null }>();
  @Output() createNewExperience = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  readonly months = MONTH_OPTIONS.map((label) => ({ label, value: label }));

  form: FormGroup;
  aiDrawerVisible = false;
  aiPromptControl: FormControl<string>;
  isGenerating = false;
  aiError: string | null = null;

  constructor(private fb: FormBuilder, private aiService: ExperienceAiService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      companyName: [''],
      location: [''],
      startMonth: ['', Validators.required],
      startYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      endMonth: [''],
      endYear: [''],
      isCurrent: [false],
      responsibilities: ['', Validators.required],
      keySkills: ['']
    });

    this.aiPromptControl = this.fb.nonNullable.control('', Validators.required);

    this.form.get('isCurrent')?.valueChanges.subscribe((isCurrent) => {
      if (isCurrent) {
        this.form.patchValue({ endMonth: '', endYear: '' }, { emitEvent: false });
        this.form.get('endMonth')?.disable({ emitEvent: false });
        this.form.get('endYear')?.disable({ emitEvent: false });
      } else {
        this.form.get('endMonth')?.enable({ emitEvent: false });
        this.form.get('endYear')?.enable({ emitEvent: false });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experience']) {
      const next = this.experience;
      if (next) {
        this.patchForm(next);
      } else {
        this.resetForm();
      }
    }

    if (changes['isEditing'] && !this.isEditing) {
      this.resetForm();
    }
  }

  submitExperience(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.getFormValue();
    this.saveExperience.emit({
      experience: value,
      index: this.isEditing ? this.editingIndex ?? null : null
    });
  }

  save(): void {
    this.submitExperience();
  }

  cancel(): void {
    this.resetForm();
    this.close.emit();
  }

  newExperience(): void {
    this.resetForm('blank');
    this.createNewExperience.emit();
  }

  resetForm(mode: 'blank' | 'current' = this.isEditing ? 'current' : 'blank'): void {
    if (mode === 'current' && this.experience) {
      this.patchForm(this.experience);
    } else {
      this.form.reset({
        title: '',
        companyName: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        isCurrent: false,
        responsibilities: '',
        keySkills: ''
      });
      this.form.get('endMonth')?.enable({ emitEvent: false });
      this.form.get('endYear')?.enable({ emitEvent: false });
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  openAiAssist(): void {
    this.aiError = null;
    this.aiPromptControl.reset('');
    this.aiPromptControl.markAsPristine();
    this.aiPromptControl.markAsUntouched();
    this.aiDrawerVisible = true;
  }

  closeAiAssist(): void {
    if (this.isGenerating) {
      this.aiDrawerVisible = true;
      return;
    }
    this.aiDrawerVisible = false;
    this.aiPromptControl.reset('');
    this.aiPromptControl.markAsPristine();
    this.aiPromptControl.markAsUntouched();
    this.aiError = null;
  }

  generateResponsibilitiesFromAi(): void {
    if (this.aiPromptControl.invalid) {
      this.aiPromptControl.markAsTouched();
      return;
    }

    const prompt = this.aiPromptControl.value.trim();
    if (!prompt) {
      this.aiPromptControl.setValue('');
      this.aiPromptControl.markAsTouched();
      return;
    }

    this.isGenerating = true;
    this.aiError = null;

    this.aiService
      .generateResponsibilities(prompt)
      .pipe(finalize(() => (this.isGenerating = false)))
      .subscribe({
        next: (response: string) => {
          const text = (response ?? '').trim();
          if (!text) {
            this.aiError = 'We could not craft any responsibilities from that prompt. Try expanding your request.';
            return;
          }

          const responsibilitiesControl = this.form.get('responsibilities');
          responsibilitiesControl?.setValue(text);
          responsibilitiesControl?.markAsDirty();
          responsibilitiesControl?.markAsTouched();

          this.aiDrawerVisible = false;
          this.aiPromptControl.reset('');
          this.aiPromptControl.markAsPristine();
          this.aiPromptControl.markAsUntouched();
        },
        error: () => {
          this.aiError = 'Something went wrong while contacting the assistant. Please try again in a bit.';
        }
      });
  }

  private getFormValue(): ExperienceProfileItem {
    const raw = this.form.getRawValue();
    return {
      title: raw.title?.trim(),
      companyName: raw.companyName?.trim() || undefined,
      location: raw.location?.trim() || undefined,
      startMonth: raw.startMonth,
      startYear: raw.startYear,
      endMonth: raw.isCurrent ? undefined : raw.endMonth,
      endYear: raw.isCurrent ? undefined : raw.endYear,
      isCurrent: !!raw.isCurrent,
      responsibilities: raw.responsibilities?.trim(),
      keySkills: raw.keySkills?.trim() || undefined
    };
  }

  private patchForm(item: ExperienceProfileItem): void {
    this.form.reset({
      title: item.title ?? '',
      companyName: item.companyName ?? '',
      location: item.location ?? '',
      startMonth: item.startMonth ?? '',
      startYear: item.startYear ?? '',
      endMonth: item.endMonth ?? '',
      endYear: item.endYear ?? '',
      isCurrent: !!item.isCurrent,
      responsibilities: item.responsibilities ?? '',
      keySkills: item.keySkills ?? ''
    });

    if (item.isCurrent) {
      this.form.get('endMonth')?.disable({ emitEvent: false });
      this.form.get('endYear')?.disable({ emitEvent: false });
    } else {
      this.form.get('endMonth')?.enable({ emitEvent: false });
      this.form.get('endYear')?.enable({ emitEvent: false });
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
