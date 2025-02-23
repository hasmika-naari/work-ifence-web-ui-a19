import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-friends',
    imports: [MatCardModule],
    templateUrl: './friends.component.html',
    styleUrl: './friends.component.scss'
})
export class FriendsComponent {}