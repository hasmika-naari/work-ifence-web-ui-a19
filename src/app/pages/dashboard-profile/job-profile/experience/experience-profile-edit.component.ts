import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { ProgressBarModule } from 'primeng/progressbar';
import { EditorModule } from 'primeng/editor';
import { finalize } from 'rxjs/operators';
import { ExperienceProfileItem } from './experience-profile-display.component';
import { ExperienceAiService } from './experience-ai.service';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    DrawerModule,
    ProgressBarModule,
    EditorModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
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
  aiResponseControl: FormControl<string>;
  isGenerating = false;
  aiError: string | null = null;
  readonly separatorKeys = [ENTER, COMMA] as const;
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
      keySkills: this.fb.nonNullable.control<string[]>([]),
      responsibilities: ['', Validators.required]
    });

  this.aiPromptControl = this.fb.nonNullable.control('');
  this.aiResponseControl = this.fb.nonNullable.control('');

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

    if (
      changes['isEditing'] &&
      !this.isEditing &&
      !changes['isEditing'].firstChange &&
      changes['isEditing'].previousValue === true
    ) {
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
        keySkills: [],
        responsibilities: ''
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
    this.aiResponseControl.setValue('');
    this.aiResponseControl.markAsPristine();
    this.aiResponseControl.markAsUntouched();
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
    this.aiResponseControl.setValue('');
    this.aiResponseControl.markAsPristine();
    this.aiResponseControl.markAsUntouched();
    this.aiError = null;
  }

  generateResponsibilitiesFromAi(): void {
    const prompt = this.aiPromptControl.value.trim();
    if (!prompt) {
      this.aiPromptControl.setValue('');
      return;
    }

    this.isGenerating = true;
    this.aiError = null;
    this.aiResponseControl.setValue('');
    this.aiResponseControl.markAsPristine();
    this.aiResponseControl.markAsUntouched();

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

          this.aiResponseControl.setValue(this.normalizeResponsibilities(text));
          this.aiResponseControl.markAsDirty();
          this.aiResponseControl.markAsTouched();
        },
        error: () => {
          this.aiError = 'Something went wrong while contacting the assistant. Please try again in a bit.';
        }
      });
  }

  resetAiResponse(): void {
    if (this.isGenerating) {
      return;
    }
    this.aiResponseControl.setValue('');
    this.aiResponseControl.markAsPristine();
    this.aiResponseControl.markAsUntouched();
  }

  applyAiResponse(mode: 'append' | 'replace' = 'append'): void {
    const generated = (this.aiResponseControl.value ?? '').trim();
    if (!generated) {
      return;
    }

    const responsibilitiesControl = this.form.get('responsibilities');
    if (!responsibilitiesControl) {
      return;
    }

    const current = (responsibilitiesControl.value ?? '').toString().trim();
    const nextValue =
      mode === 'replace'
        ? generated
        : current
          ? `${current}${this.mergeSeparator(current)}${generated}`
          : generated;

    responsibilitiesControl.setValue(nextValue);
    responsibilitiesControl.markAsDirty();
    responsibilitiesControl.markAsTouched();

    this.closeAiAssist();
  }

  private mergeSeparator(existing: string): string {
    return existing.endsWith('</p>') || existing.endsWith('</li>') || existing.endsWith('</ul>')
      ? ''
      : '<p><br></p>';
  }

  private getFormValue(): ExperienceProfileItem {
    const raw = this.form.getRawValue();
    const responsibilities = (raw.responsibilities ?? '').trim();
    const keySkillsArray = this.keySkillsControl.value ?? [];
    const keySkills = keySkillsArray
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
      .join(', ');

    return {
      title: raw.title?.trim(),
      companyName: raw.companyName?.trim() || undefined,
      location: raw.location?.trim() || undefined,
      startMonth: raw.startMonth,
      startYear: raw.startYear,
      endMonth: raw.isCurrent ? undefined : raw.endMonth,
      endYear: raw.isCurrent ? undefined : raw.endYear,
      isCurrent: !!raw.isCurrent,
      responsibilities,
      keySkills: keySkills || undefined
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
      keySkills: this.parseKeySkillsArray(item.keySkills),
      responsibilities: this.normalizeResponsibilities(item.responsibilities ?? '')
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

  get keySkillsControl(): FormControl<string[]> {
    return this.form.get('keySkills') as FormControl<string[]>;
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (!value) {
      event.chipInput?.clear();
      return;
    }

    const control = this.keySkillsControl;
    const current = control.value ?? [];
    const exists = current.some((skill) => skill.toLowerCase() === value.toLowerCase());
    if (exists) {
      event.chipInput?.clear();
      return;
    }

    control.setValue([...current, value]);
    control.markAsDirty();
    control.markAsTouched();
    event.chipInput?.clear();
  }

  removeSkill(index: number): void {
    const control = this.keySkillsControl;
    const current = control.value ?? [];
    if (index < 0 || index >= current.length) {
      return;
    }

    const next = current.filter((_, i) => i !== index);
    control.setValue(next);
    control.markAsDirty();
    control.markAsTouched();
  }

  private parseKeySkillsArray(value?: string): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }

  private normalizeResponsibilities(value: string): string {
    if (!value) {
      return '';
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }

    if (/[<][a-z\s/"'=]+>/i.test(trimmed)) {
      return trimmed;
    }

    const bulletLines = trimmed
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-•\s]+/, '').trim())
      .filter((line) => line.length > 0);

    if (!bulletLines.length) {
      return trimmed;
    }

    const items = bulletLines.map((line) => `<li>${this.escapeHtml(line)}</li>`).join('');
    return `<ul>${items}</ul>`;
  }

  private escapeHtml(value: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return value.replace(/[&<>"']/g, (char) => map[char]);
  }
}
