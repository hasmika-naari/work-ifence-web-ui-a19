import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Skill } from 'src/app/services/resume.model';

@Component({
  selector: 'skills-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, DragDropModule],
  templateUrl: './skills-profile-edit.component.html',
  styleUrls: ['./skills-profile-edit.component.scss']
})
export class SkillsProfileEditComponent implements OnChanges {
  @Input() skills: Skill[] | null = null;
  @Output() saveSkills = new EventEmitter<Skill[]>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  skillList: Skill[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      skill: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skills']) {
      this.skillList = (this.skills ?? []).map((skill) => ({
        name: skill.name,
        selected: skill.selected ?? false
      }));
    }
  }

  addSkill(): void {
    const value = (this.form.controls['skill'].value ?? '').trim();
    if (!value) {
      return;
    }

    const exists = this.skillList.some((skill) => skill.name.toLowerCase() === value.toLowerCase());
    if (exists) {
      this.form.reset();
      return;
    }

    this.skillList = [...this.skillList, { name: value, selected: false }];
    this.form.reset({ skill: '' });
  }

  removeSkill(index: number): void {
    this.skillList = this.skillList.filter((_, i) => i !== index);
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
}
