import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    CdkDragDrop,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-pm-kanban-board',
    imports: [MatCardModule, FeathericonsModule, MatButtonModule, MatCheckboxModule, CdkDropList, CdkDrag, CdkDropListGroup],
    templateUrl: './pm-kanban-board.component.html',
    styleUrl: './pm-kanban-board.component.scss'
})
export class PmKanbanBoardComponent {

    // New Project
    newProject : any = [
        {
            title: `Integrate Counter Component`,
            category: `Mobile App`,
            totalTask: `10`,
            completedTask: `0`
        },
        {
            title: `Multipurpose Landing Template`,
            category: `Angular App`,
            totalTask: `12`,
            completedTask: `2`
        },
        {
            title: `E-Commerce Development`,
            category: `Website`,
            totalTask: `15`,
            completedTask: `0`
        },
        {
            title: `Digital Marketing`,
            category: `Mobile App`,
            totalTask: `14`,
            completedTask: `0`
        },
        {
            title: `DataFetcher Component Into App.js`,
            category: `Data App`,
            totalTask: `11`,
            completedTask: `5`
        }
    ]

    // To Do
    toDo : any = [
        {
            title: `Digital Marketing`,
            category: `Mobile App`,
            totalTask: `14`,
            completedTask: `0`
        },
        {
            title: `Multipurpose Landing Template`,
            category: `Angular App`,
            totalTask: `12`,
            completedTask: `2`
        },
        {
            title: `DataFetcher Component Into App.js`,
            category: `Data App`,
            totalTask: `11`,
            completedTask: `5`
        },
        {
            title: `E-Commerce Development`,
            category: `Website`,
            totalTask: `15`,
            completedTask: `0`
        },
        {
            title: `Integrate Counter Component`,
            category: `Mobile App`,
            totalTask: `10`,
            completedTask: `0`
        }
    ]

    // In Progress
    inProgress : any = [
        {
            title: `DataFetcher Component Into App.js`,
            category: `Data App`,
            totalTask: `11`,
            completedTask: `5`
        },
        {
            title: `E-Commerce Development`,
            category: `Website`,
            totalTask: `15`,
            completedTask: `0`
        },
        {
            title: `Integrate Counter Component`,
            category: `Mobile App`,
            totalTask: `10`,
            completedTask: `0`
        },
        {
            title: `Multipurpose Landing Template`,
            category: `Angular App`,
            totalTask: `12`,
            completedTask: `2`
        },
        {
            title: `Digital Marketing`,
            category: `Mobile App`,
            totalTask: `14`,
            completedTask: `0`
        }
    ]

    // On Review
    onReview : any = [
        {
            title: `Integrate Counter Component`,
            category: `Mobile App`,
            totalTask: `10`,
            completedTask: `0`
        },
        {
            title: `Multipurpose Landing Template`,
            category: `Angular App`,
            totalTask: `12`,
            completedTask: `2`
        },
        {
            title: `E-Commerce Development`,
            category: `Website`,
            totalTask: `15`,
            completedTask: `0`
        },
        {
            title: `Digital Marketing`,
            category: `Mobile App`,
            totalTask: `14`,
            completedTask: `0`
        },
        {
            title: `DataFetcher Component Into App.js`,
            category: `Data App`,
            totalTask: `11`,
            completedTask: `5`
        }
    ]

    // Completed
    completed : any = [
        {
            title: `E-Commerce Development`,
            category: `Website`,
            totalTask: `15`,
            completedTask: `0`
        },
        {
            title: `Multipurpose Landing Template`,
            category: `Angular App`,
            totalTask: `12`,
            completedTask: `2`
        },
        {
            title: `Integrate Counter Component`,
            category: `Mobile App`,
            totalTask: `10`,
            completedTask: `0`
        },
        {
            title: `Digital Marketing`,
            category: `Mobile App`,
            totalTask: `14`,
            completedTask: `0`
        },
        {
            title: `DataFetcher Component Into App.js`,
            category: `Data App`,
            totalTask: `11`,
            completedTask: `5`
        }
    ]

    // Drag and Drop
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

}