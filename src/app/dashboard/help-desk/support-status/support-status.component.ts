import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-support-status',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './support-status.component.html',
    styleUrl: './support-status.component.scss'
})
export class SupportStatusComponent {}