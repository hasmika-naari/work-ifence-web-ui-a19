import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-sales-by-locations',
    imports: [MatCardModule, MatMenuModule, MatButtonModule],
    templateUrl: './sales-by-locations.component.html',
    styleUrl: './sales-by-locations.component.scss'
})
export class SalesByLocationsComponent {}