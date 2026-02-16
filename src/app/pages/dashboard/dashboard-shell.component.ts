import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';
import { DashboardComponent } from './dashboard.component';

@Component({
  selector: 'wif-dashboard-shell',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardShellComponent {
  private readonly router = inject(Router);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly dashboardContext = inject(DashboardContextService);

  readonly accessMe = this.accessFacade.accessMeSignal;

  readonly canShowEnterprise = computed(() => {
    const mode = (this.accessMe()?.mode ?? 'PERSONAL').toString();
    return mode === 'ENTERPRISE_EMPLOYEE' || mode === 'ENTERPRISE_ADMIN';
  });

  readonly ctx = this.dashboardContext.context;

  constructor() {
    effect(() => {
      const me = this.accessMe();

      // Platform admin has a dedicated dashboard.
      // Important: use the active profile key, not overall authorities/mode.
      // Users may *have* admin access but still be in Personal profile.
      if ((me?.activeProfileKey ?? '').toString() === 'ROLE_ADMIN') {
        if (!this.router.url.startsWith('/user/dashboard-admin')) {
          this.router.navigateByUrl('/user/dashboard-admin');
        }
        return;
      }

      // Initialize default context once based on access.
      this.dashboardContext.ensureDefaultForAccess(me);

      // If user can't access enterprise context, force personal.
      if (!this.canShowEnterprise() && this.ctx() === 'ENTERPRISE') {
        this.dashboardContext.setPersonal();
      }
    });
  }

  setPersonal() {
    this.dashboardContext.setPersonal();
  }

  setEnterprise() {
    if (!this.canShowEnterprise()) return;
    this.dashboardContext.setEnterprise();
  }
}
