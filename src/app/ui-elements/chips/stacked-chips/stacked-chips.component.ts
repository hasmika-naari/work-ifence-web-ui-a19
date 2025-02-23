import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-stacked-chips',
    imports: [MatChipsModule, MatCardModule],
    templateUrl: './stacked-chips.component.html',
    styleUrl: './stacked-chips.component.scss'
})
export class StackedChipsComponent {

    readonly bestBoys: string[] = ['Samoyed', 'Akita Inu', 'Alaskan Malamute', 'Siberian Husky'];

}