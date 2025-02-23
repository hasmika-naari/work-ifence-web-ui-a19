import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';

@Component({
    selector: 'app-activity',
    imports: [MatCardModule, FeathericonsModule],
    templateUrl: './activity.component.html',
    styleUrl: './activity.component.scss'
})
export class ActivityComponent {}