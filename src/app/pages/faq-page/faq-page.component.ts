import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-faq-page',
    imports: [MatCardModule, MatButtonModule, MatExpansionModule],
    templateUrl: './faq-page.component.html',
    styleUrl: './faq-page.component.scss'
})
export class FaqPageComponent {

    // Expansion
    panelOpenState = false;

}