import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-team-members',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './team-members.component.html',
    styleUrl: './team-members.component.scss'
})
export class TeamMembersComponent {}