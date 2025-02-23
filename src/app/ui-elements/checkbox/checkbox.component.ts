import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';

export interface Task {
    name: string;
    completed: boolean;
    subtasks?: Task[];
}

@Component({
    selector: 'app-checkbox',
    imports: [RouterLink, MatCardModule, MatCheckboxModule, FormsModule, ReactiveFormsModule],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {

    readonly task = signal<Task>({
        name: 'Parent task',
        completed: false,
        subtasks: [
            {name: 'Child task 1', completed: false},
            {name: 'Child task 2', completed: false},
            {name: 'Child task 3', completed: false},
        ],
    });
    readonly partiallyComplete = computed(() => {
        const task = this.task();
        if (!task.subtasks) {
            return false;
        }
        return task.subtasks.some(t => t.completed) && !task.subtasks.every(t => t.completed);
    });
    update(completed: boolean, index?: number) {
        this.task.update(task => {
            if (index === undefined) {
                task.completed = completed;
                task.subtasks?.forEach(t => (t.completed = completed));
            } else {
                task.subtasks![index].completed = completed;
                task.completed = task.subtasks?.every(t => t.completed) ?? true;
            }
            return {...task};
        });
    }

}