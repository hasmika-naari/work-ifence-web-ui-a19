import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { SkillV2 } from 'src/app/services/resume.model';
import { SkillsSuggestionService } from './skills-suggestion.service';

@Component({
  selector: 'skills-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, AutoCompleteModule, DragDropModule],
  templateUrl: './skills-profile-edit.component.html',
  styleUrls: ['./skills-profile-edit.component.scss']
})
export class SkillsProfileEditComponent implements OnInit, OnChanges {
  @Input() skillSection: SkillV2 | null = null;
  @Output() saveSkill = new EventEmitter<SkillV2>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  skills: string[] = [];
  filteredSuggestions: string[] = [];
  allSuggestions: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly suggestionService: SkillsSuggestionService
  ) {
    this.form = this.fb.group({
      sub_title: ['', Validators.required],
      skillInput: ['']
    });
  }

  ngOnInit(): void {
    this.suggestionService.getSkillSuggestions().subscribe({
      next: (skills) => {
        this.allSuggestions = (skills ?? []).map((skill) => skill.trim()).filter((skill) => !!skill);
        this.initializeForm();
      }
    });
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skillSection'] && !changes['skillSection'].firstChange) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    const title = this.skillSection?.sub_title ?? '';
    const skills = [...(this.skillSection?.skills ?? [])];

    this.form.patchValue({
      sub_title: title,
      skillInput: ''
    }, { emitEvent: false });

    this.skills = skills;
    this.updateFilteredSuggestions();
  }

  addSkill(): void {
    const value = (this.form.controls['skillInput'].value ?? '').toString().trim();
    if (!value) {
      return;
    }

    if (!this.skills.includes(value)) {
      this.skills.push(value);
    }

    this.form.controls['skillInput'].setValue('');
    this.updateFilteredSuggestions();
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
    this.updateFilteredSuggestions();
  }

  dropSkill(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.skills, event.previousIndex, event.currentIndex);
  }

  filterSkills(event: AutoCompleteCompleteEvent): void {
    const query = (event.query ?? '').toString().toLowerCase();
    const existing = new Set(this.skills.map((skill) => skill.toLowerCase()));
    this.filteredSuggestions = this.allSuggestions
      .filter((skill) => !existing.has(skill.toLowerCase()))
      .filter((skill) => !query || skill.toLowerCase().includes(query))
      .slice(0, 15);
  }

  suggestionSelected(event: AutoCompleteSelectEvent): void {
    const value = (event.value ?? '').toString().trim();
    if (!value) {
      return;
    }

    if (!this.skills.includes(value)) {
      this.skills.push(value);
    }

    this.form.controls['skillInput'].setValue('');
    this.updateFilteredSuggestions();
  }

  handleEnter(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addSkill();
  }

  private updateFilteredSuggestions(): void {
    const existing = new Set(this.skills.map((skill) => skill.toLowerCase()));
    this.filteredSuggestions = this.allSuggestions
      .filter((skill) => !existing.has(skill.toLowerCase()))
      .slice(0, 10);
  }

  save(): void {
    const subTitle = this.form.controls['sub_title'].value?.toString().trim() ?? '';
    const sanitizedSkills = this.skills
      .map((skill) => (skill ?? '').toString().trim())
      .filter((skill) => !!skill);

    if (!subTitle || !sanitizedSkills.length) {
      return;
    }

    this.saveSkill.emit({
      sub_title: subTitle,
      skills: sanitizedSkills
    });
  }

  cancel(): void {
    this.close.emit();
  }

  get subTitleControl(): FormControl {
    return this.form.controls['sub_title'] as FormControl;
  }

  get skillInputControl(): FormControl {
    return this.form.controls['skillInput'] as FormControl;
  }

  get hasValidSection(): boolean {
    return this.subTitleControl.valid && this.skills.length > 0;
  }
}
