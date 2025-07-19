import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-gym-trainer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './gym-trainer.component.html',
    styleUrls: ['./gym-trainer.component.scss']
})
export class GymTrainerComponent {}