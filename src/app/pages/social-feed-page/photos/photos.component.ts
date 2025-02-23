import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-photos',
    imports: [MatCardModule],
    templateUrl: './photos.component.html',
    styleUrl: './photos.component.scss'
})
export class PhotosComponent {}