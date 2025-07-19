import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackToTopComponent } from '../back-to-top/back-to-top.component';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink, BackToTopComponent],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}