import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-contact-leads',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './contact-leads.component.html',
    styleUrl: './contact-leads.component.scss'
})
export class ContactLeadsComponent {}