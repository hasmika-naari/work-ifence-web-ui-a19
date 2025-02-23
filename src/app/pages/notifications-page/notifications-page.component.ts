import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-notifications-page',
    imports: [MatCardModule],
    templateUrl: './notifications-page.component.html',
    styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {}