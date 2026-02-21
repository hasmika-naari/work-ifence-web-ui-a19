import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NavbarStateService } from '../../../core/navbar/navbar-state.service';

@Component({
  selector: 'app-user-settings-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatListModule,
  ],
  templateUrl: './user-settings-shell.component.html',
  styleUrls: ['./user-settings-shell.component.scss'],
})
export class UserSettingsShellComponent implements OnInit {
  private readonly navbarStateService = inject(NavbarStateService);
  readonly navbar$ = this.navbarStateService.navbar$;

  ngOnInit(): void {
    this.navbarStateService.initOnce();
  }
}

@Component({
  selector: 'app-user-settings-account',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Account</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Account settings content goes here.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class UserSettingsAccountComponent {}

@Component({
  selector: 'app-user-settings-password',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Password</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Password settings content goes here.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class UserSettingsPasswordComponent {}

@Component({
  selector: 'app-user-settings-menu-preferences',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Menu Preferences</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Menu preferences content goes here.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class UserSettingsMenuPreferencesComponent {}
