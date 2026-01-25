import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { UpgradeRouterService } from 'src/app/services/upgrade-router.service';
import { LockedCalloutComponent } from 'src/app/shared/components/locked-callout/locked-callout.component';

@Component({
    selector: 'app-notifications-page',
    standalone: true,
    imports: [CommonModule, MatCardModule, LockedCalloutComponent],
    templateUrl: './notifications-page.component.html',
    styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {
    private readonly accessFacade = inject(AccessFacadeService);
    private readonly upgradeRouter = inject(UpgradeRouterService);

    readonly canUseAlerts = computed(() => this.accessFacade.can('ALERTS'));
    readonly alertsLockMessage = computed(() => this.accessFacade.denyMessage('ALERTS'));

    goToPricing(): void {
        this.upgradeRouter.goToPricingForContext('PERSONAL');
    }
}