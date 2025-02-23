import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';

@Component({
    selector: 'app-p-user-profile',
    imports: [MatCardModule, FeathericonsModule],
    templateUrl: './p-user-profile.component.html',
    styleUrl: './p-user-profile.component.scss'
})
export class PUserProfileComponent {}