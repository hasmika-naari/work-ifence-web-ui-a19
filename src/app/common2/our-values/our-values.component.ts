import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-our-values',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './our-values.component.html',
    styleUrls: ['./our-values.component.scss']
})
export class OurValuesComponent {}