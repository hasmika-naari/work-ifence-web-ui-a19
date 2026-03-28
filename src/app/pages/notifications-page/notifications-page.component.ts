import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { LockedCalloutComponent } from 'src/app/shared/components/locked-callout/locked-callout.component';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';

@Component({
    selector: 'app-notifications-page',
    standalone: true,
    imports: [CommonModule, MatCardModule, LockedCalloutComponent],
    templateUrl: './notifications-page.component.html',
    styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {
    private readonly router = inject(Router);
    private readonly accessFacade = inject(AccessFacadeService);
    private readonly upgradeDrawer = inject(UpgradeDrawerService);

    readonly canUseAlerts = computed(() => this.accessFacade.can('ALERTS'));
    readonly alertsLockMessage = computed(() => this.accessFacade.denyMessage('ALERTS'));

    goToPricing(): void {
        this.upgradeDrawer.openForContext('PERSONAL', {
            title: 'Upgrade for job alerts',
            message: this.alertsLockMessage() || 'Upgrade your plan to receive saved-search and job alert notifications.',
            returnUrl: this.router.url,
        });
    }
}