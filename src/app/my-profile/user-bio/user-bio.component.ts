import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';

@Component({
    selector: 'app-user-bio',
    imports: [MatCardModule, FeathericonsModule],
    templateUrl: './user-bio.component.html',
    styleUrl: './user-bio.component.scss'
})
export class UserBioComponent {}