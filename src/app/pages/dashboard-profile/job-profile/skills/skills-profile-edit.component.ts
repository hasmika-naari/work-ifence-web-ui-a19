import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Skill } from 'src/app/services/resume.model';
import { SkillsSuggestionService } from './skills-suggestion.service';

@Component({
  selector: 'skills-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, AutoCompleteModule, DragDropModule],
  templateUrl: './skills-profile-edit.component.html',
  styleUrls: ['./skills-profile-edit.component.scss']
})
export class SkillsProfileEditComponent implements OnInit, OnChanges {
  @Input() skills: Skill[] | null = null;
  @Output() saveSkills = new EventEmitter<Skill[]>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  skillList: Skill[] = [];
  filteredSuggestions: string[] = [];
  private allSuggestions: string[] = [];

  constructor(private fb: FormBuilder, private readonly suggestionService: SkillsSuggestionService) {
    this.form = this.fb.group({
      skill: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suggestionService.getSkillSuggestions().subscribe({
      next: (skills) => {
        this.allSuggestions = (skills ?? []).map((skill) => skill.trim()).filter((skill) => !!skill);
        this.primeInitialSuggestions();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skills']) {
      this.skillList = (this.skills ?? []).map((skill) => ({
        name: skill.name,
        selected: skill.selected ?? false
      }));
      this.primeInitialSuggestions();
    }
  }

  addSkill(): void {
    const value = (this.form.controls['skill'].value ?? '').trim();
    if (!value) {
      return;
    }

    this.addSkillFromValue(value);
  }

  removeSkill(index: number): void {
    this.skillList = this.skillList.filter((_, i) => i !== index);
    this.primeInitialSuggestions();
  }

  drop(event: CdkDragDrop<Skill[]>): void {
    moveItemInArray(this.skillList, event.previousIndex, event.currentIndex);
  }

  save(): void {
    const sanitized = this.skillList.map((skill) => ({
      name: skill.name.trim(),
      selected: skill.selected ?? false
    }));
    this.saveSkills.emit(sanitized);
  }

  cancel(): void {
    this.close.emit();
  }

  filterSkills(event: AutoCompleteCompleteEvent): void {
    const query = (event.query ?? '').toString().toLowerCase();
    const existing = new Set(this.skillList.map((skill) => skill.name.toLowerCase()));

    this.filteredSuggestions = this.allSuggestions
      .filter((skill) => !existing.has(skill.toLowerCase()))
      .filter((skill) => !query || skill.toLowerCase().includes(query))
      .slice(0, 15);
  }

  handleFocus(): void {
    if (!this.filteredSuggestions.length) {
      this.primeInitialSuggestions();
    }
  }

  handleEnter(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.form.invalid) {
      return;
    }

    this.addSkill();
  }

  suggestionSelected(event: AutoCompleteSelectEvent): void {
    const value = (event.value ?? '').toString().trim();
    if (!value) {
      return;
    }

    this.addSkillFromValue(value);
  }

  private addSkillFromValue(value: string): void {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }

    const exists = this.skillList.some((skill) => skill.name.toLowerCase() === normalized.toLowerCase());
    if (exists) {
      this.form.reset({ skill: '' });
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.filteredSuggestions = [];
      return;
    }

    this.skillList = [...this.skillList, { name: normalized, selected: false }];
    this.form.reset({ skill: '' });
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.filteredSuggestions = [];
    this.primeInitialSuggestions();
  }

  private primeInitialSuggestions(): void {
    if (!this.allSuggestions.length) {
      return;
    }
    const existing = new Set(this.skillList.map((skill) => skill.name.toLowerCase()));
    this.filteredSuggestions = this.allSuggestions
      .filter((skill) => !existing.has(skill.toLowerCase()))
      .slice(0, 10);
  }
}
