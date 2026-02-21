import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs/operators';

import { NavbarItemDTO } from '../../../core/navbar/navbar.model';
import { NavbarStateService } from '../../../core/navbar/navbar-state.service';

interface FeatureItem {
  title: string;
  entitlementKey: string;
  lockReason?: string;
}

interface PlanAccessViewModel {
  role: string;
  planCode: string;
  subscriptionStatus: string;
  enabledFeatures: FeatureItem[];
  lockedFeatures: FeatureItem[];
  canUpgrade: boolean;
}

@Component({
  selector: 'app-user-plan-access',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './user-plan-access.component.html',
  styleUrls: ['./user-plan-access.component.scss'],
})
export class UserPlanAccessComponent implements OnInit {
  private readonly navbarStateService = inject(NavbarStateService);

  readonly vm$ = this.navbarStateService.navbar$.pipe(
    map((navbar): PlanAccessViewModel => {
      const user = (navbar?.user ?? {}) as Record<string, unknown>;
      const role = this.toText(user['role']);
      const planCode = this.toText(user['planCode'] ?? user['plan']);
      const subscriptionStatus = this.toText(user['subscriptionStatus']);
      const items = (navbar?.sections ?? []).flatMap((section) => section.items ?? []);

      const enabledFeatures = this.buildEnabledFeatures(items);
      const lockedFeatures = this.buildLockedFeatures(items);
      const canUpgrade = items.some((item) => this.isActive(item) && item.locked !== true && item.allowed !== false && (item.route ?? '') === '/user/billing/upgrade');

      return {
        role,
        planCode,
        subscriptionStatus,
        enabledFeatures,
        lockedFeatures,
        canUpgrade,
      };
    }),
  );

  ngOnInit(): void {
    this.navbarStateService.initOnce();
  }

  private buildEnabledFeatures(items: NavbarItemDTO[]): FeatureItem[] {
    const included = items.filter(
      (item) => this.isActive(item) && item.locked !== true && item.allowed !== false && !!this.toText(item.entitlementKey),
    );

    return this.uniqueBy(included, (item) => this.toText(item.entitlementKey).toUpperCase()).map((item) => ({
      title: this.toText(item.title) || this.toText(item.entitlementKey),
      entitlementKey: this.toText(item.entitlementKey),
    }));
  }

  private buildLockedFeatures(items: NavbarItemDTO[]): FeatureItem[] {
    const locked = items.filter((item) => item.locked === true);

    return this.uniqueBy(locked, (item) => this.toText(item.itemKey).toUpperCase()).map((item) => ({
      title: this.toText(item.title) || this.toText(item.itemKey),
      entitlementKey: this.toText(item.entitlementKey),
      lockReason: this.toText(item.lockReason) || undefined,
    }));
  }

  private isActive(item: NavbarItemDTO): boolean {
    return this.toText(item.featureStatus).toUpperCase() !== 'DISABLED';
  }

  private uniqueBy<T>(items: T[], keyFn: (item: T) => string): T[] {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = keyFn(item);
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private toText(value: unknown): string {
    return (value ?? '').toString().trim();
  }
}
