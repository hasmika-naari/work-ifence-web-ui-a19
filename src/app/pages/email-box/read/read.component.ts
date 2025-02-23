import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-read',
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './read.component.html',
    styleUrl: './read.component.scss'
})
export class ReadComponent {}