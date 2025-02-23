import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-basic',
    imports: [MatCardModule],
    templateUrl: './basic.component.html',
    styleUrl: './basic.component.scss'
})
export class BasicComponent {}