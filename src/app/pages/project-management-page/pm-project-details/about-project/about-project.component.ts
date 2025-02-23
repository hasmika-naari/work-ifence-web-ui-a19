import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';

@Component({
    selector: 'app-about-project',
    imports: [MatCardModule, MatButtonModule, FeathericonsModule],
    templateUrl: './about-project.component.html',
    styleUrl: './about-project.component.scss'
})
export class AboutProjectComponent {}