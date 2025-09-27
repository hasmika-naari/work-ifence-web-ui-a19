import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AppUtilService } from '../../services/app.util.service';

@Component({
    selector: 'app-logout',
    imports: [RouterLink, MatButtonModule],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss'
})
export class LogoutComponent {
        constructor(private appUtilService: AppUtilService) {
            this.appUtilService.logoutAndReset();
        }
}