import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-autosize-sidenav',
    imports: [MatSidenavModule, MatButtonModule],
    templateUrl: './autosize-sidenav.component.html',
    styleUrl: './autosize-sidenav.component.scss'
})
export class AutosizeSidenavComponent {

    showFiller = false;

}