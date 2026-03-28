import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { SubscriptionFacadeService } from 'src/app/facades/subscription-facade.service';
import type { SubscriptionPlan, SubscriptionScope } from 'src/app/models/subscription.model';
import { ResumeLimitService } from 'src/app/resume-portal/services/resume-limit.service';
import { parseBackendError, toFriendlyErrorMessage } from 'src/app/utils/api-error';
import { UpgradeDrawerService } from './upgrade-drawer.service';

interface UpgradePlanView {
  planId?: string | number;
  code: string;
  name: string;
  marketingTitle?: string;
  marketingSubtitle?: string;
  price?: number | null;
  currency?: string;
  billingInterval?: string;
  badgeText?: string;
  recommended?: boolean;
  featureBullets: string[];
  trialDays?: number;
}

interface UsageView {
  used: number;
  allowed: number | null;
  remaining: number | null;
  progressPercent: number | null;
}

@Component({
  selector: 'app-upgrade-drawer',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule],
  templateUrl: './upgrade-drawer.component.html',
  styleUrl: './upgrade-drawer.component.scss',
})
export class UpgradeDrawerComponent {
  private readonly upgradeDrawer = inject(UpgradeDrawerService);
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly subscriptionFacade = inject(SubscriptionFacadeService);
  private readonly resumeLimit = inject(ResumeLimitService);
  private readonly messageService = inject(MessageService);

  readonly state = this.upgradeDrawer.snapshot;
  readonly visible = this.upgradeDrawer.visible;
  readonly scope = computed<SubscriptionScope>(() => this.state().scope);
  readonly payload = computed<Record<string, unknown> | null>(() => this.toRecord(this.state().payload));
  readonly me = this.accessFacade.accessMeSignal;
  readonly subscription = computed(() => this.me().subscription);
  readonly entitlements = computed(() => this.me().entitlements);
  readonly planLoadError = computed(() => this.subscriptionFacade.planLoadError(this.scope()));
  readonly plans = computed(() => {
    const items = [...this.subscriptionFacade.plansSignal(this.scope())()];
    return items.sort((left, right) => {
      const leftOrder = Number(left.sortOrder ?? Number.MAX_SAFE_INTEGER);
      const rightOrder = Number(right.sortOrder ?? Number.MAX_SAFE_INTEGER);
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return Number(left.price ?? 0) - Number(right.price ?? 0);
    });
  });
  readonly currentPlan = computed<SubscriptionPlan | undefined>(() => {
    const payloadPlan = this.payloadCurrentPlan();
    const payloadCode = payloadPlan ? this.firstText(payloadPlan, ['code', 'planCode', 'id']).toUpperCase() : '';
    if (payloadCode) {
      const matched = this.plans().find((plan) => (plan.code ?? '').toString().toUpperCase() === payloadCode);
      if (matched) {
        return matched;
      }
    }

    const currentCode = (this.subscription()?.planCode ?? '').toString().toUpperCase();
    if (!currentCode) {
      return undefined;
    }

    return this.plans().find((plan) => (plan.code ?? '').toString().toUpperCase() === currentCode);
  });
  readonly currentPlanLabel = computed(() => {
    const payloadPlan = this.payloadCurrentPlan();
    return (payloadPlan ? this.firstText(payloadPlan, ['marketingTitle', 'planName', 'name', 'title']) : '')
      || this.currentPlan()?.marketingTitle
      || this.currentPlan()?.name
      || this.subscription()?.planCode
      || 'FREE';
  });
  readonly currentPlanPrice = computed(() => {
    const payloadPlan = this.payloadCurrentPlan();
    return (payloadPlan ? this.firstNullableNumber(payloadPlan, ['price', 'amount', 'monthlyPrice']) : null)
      ?? this.currentPlan()?.price
      ?? null;
  });
  readonly currentPlanCurrency = computed(() => {
    const payloadPlan = this.payloadCurrentPlan();
    return ((payloadPlan ? this.firstText(payloadPlan, ['currency']) : '') || this.currentPlan()?.currency || 'USD').toString();
  });
  readonly currentPlanBillingInterval = computed(() =>
    (((() => {
      const payloadPlan = this.payloadCurrentPlan();
      return payloadPlan ? this.firstText(payloadPlan, ['billingInterval', 'interval', 'period']) : '';
    })()) || this.currentPlan()?.billingInterval || '').toString().trim()
  );
  readonly currentPlanBadge = computed(() => {
    const payloadPlan = this.payloadCurrentPlan();
    return (payloadPlan ? this.firstText(payloadPlan, ['badgeText', 'badge', 'badgeLabel', 'marketingSubtitle']) : '')
      || this.planBadgeText(this.currentPlan());
  });
  readonly currentTemplateAccess = computed(() => {
    const payloadPlan = this.payloadCurrentPlan();
    return this.templateAccessText(
      (payloadPlan ? this.firstText(payloadPlan, ['templateAccessLevel']) : '')
        || this.currentPlan()?.templateAccessLevel
        || this.entitlements()?.templateAccessLevel
        || 'BASIC'
    );
  });
  readonly usage = computed<UsageView>(() => {
    const payloadUsage = this.payloadUsage();
    if (payloadUsage) {
      return payloadUsage;
    }

    const used = this.resumeLimit.resumeCount();
    const allowed = this.resumeLimit.hasResumeLimit() ? (this.resumeLimit.resumeLimit() ?? null) : null;
    const remaining = this.resumeLimit.remaining();
    return {
      used,
      allowed,
      remaining,
      progressPercent: typeof allowed === 'number' && allowed > 0 ? Math.min(100, Math.max(0, (used / allowed) * 100)) : null,
    };
  });
  readonly upgradePlans = computed<UpgradePlanView[]>(() => {
    const payloadOptions = this.payloadUpgradeOptions();
    if (payloadOptions.length > 0) {
      return payloadOptions;
    }

    return this.plans()
      .filter((plan) => !this.isCurrentPlan(plan))
      .map((plan) => ({
        planId: plan.id ?? plan.code,
        code: (plan.code ?? '').toString(),
        name: (plan.name ?? plan.code ?? 'Plan').toString(),
        marketingTitle: (plan.marketingTitle ?? '').toString() || undefined,
        marketingSubtitle: (plan.marketingSubtitle ?? '').toString() || undefined,
        price: this.toNumber(plan.price),
        currency: (plan.currency ?? 'USD').toString(),
        billingInterval: (plan.billingInterval ?? '').toString(),
        badgeText: this.planBadgeText(plan),
        recommended: this.isRecommendedFallback(plan),
        featureBullets: this.planFeatureBullets(plan),
        trialDays: this.toNumber(plan.trialDays) ?? undefined,
      }));
  });
  readonly recommendedPlan = computed<UpgradePlanView | undefined>(() => this.upgradePlans().find((plan) => plan.recommended) ?? this.upgradePlans()[0]);

  readonly activePlanCode = signal<string | null>(null);
  readonly requestingPlanId = signal<string | null>(null);
  readonly requestReasonByPlan = signal<Record<string, string>>({});
  readonly pendingRequestPlanIds = signal<Record<string, true>>({});

  close(): void {
    this.upgradeDrawer.close();
  }

  retryPlanLoad(): void {
    this.subscriptionFacade.reloadPlans(this.scope());
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.close();
    }
  }

  isCurrentPlan(plan: SubscriptionPlan): boolean {
    const currentCode = (this.subscription()?.planCode ?? '').toString().toUpperCase();
    return (plan.code ?? '').toString().toUpperCase() === currentCode;
  }

  isUpgrading(plan: UpgradePlanView): boolean {
    return this.activePlanCode() === plan.code;
  }

  isRecommended(plan: UpgradePlanView): boolean {
    return !!plan.recommended;
  }

  isRequesting(plan: UpgradePlanView): boolean {
    return this.requestingPlanId() === this.requestKey(plan);
  }

  hasPendingRequest(plan: UpgradePlanView): boolean {
    return !!this.pendingRequestPlanIds()[this.requestKey(plan)];
  }

  requestReason(plan: UpgradePlanView): string {
    return this.requestReasonByPlan()[this.requestKey(plan)] ?? '';
  }

  updateRequestReason(plan: UpgradePlanView, value: string): void {
    const key = this.requestKey(plan);
    this.requestReasonByPlan.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  selectPlan(plan: UpgradePlanView): void {
    const planCode = (plan.code ?? '').toString();
    if (!planCode || this.isUpgrading(plan)) {
      return;
    }

    this.activePlanCode.set(planCode);
    this.subscriptionFacade.upgradeToPlan({
      code: planCode,
      trialDays: plan.trialDays,
      scope: this.scope(),
    }).pipe(
      finalize(() => this.activePlanCode.set(null))
    ).subscribe({
      next: () => {
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Subscription updated',
          detail: `Your ${plan.marketingTitle || plan.name || planCode} plan is now active.`,
          life: 5000,
        });
        this.close();
      },
      error: (error) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Upgrade failed',
          detail: error?.error?.detail || error?.message || 'Unable to update subscription right now.',
          life: 7000,
        });
      },
    });
  }

  submitUpgradeRequest(plan: UpgradePlanView): void {
    const requestedPlanId = plan.planId;
    if (requestedPlanId === undefined || requestedPlanId === null || this.isRequesting(plan) || this.hasPendingRequest(plan)) {
      return;
    }

    const key = this.requestKey(plan);
    const requestReason = this.requestReason(plan).trim();

    this.requestingPlanId.set(key);
    this.subscriptionFacade.submitUpgradeRequest({
      requestedPlanId,
      requestReason: requestReason || undefined,
    }).pipe(
      finalize(() => this.requestingPlanId.set(null))
    ).subscribe({
      next: () => {
        this.markPlanPending(key);
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Trial request submitted',
          detail: 'Trial request submitted',
          life: 5000,
        });
        this.requestReasonByPlan.update((current) => ({
          ...current,
          [key]: '',
        }));
      },
      error: (error) => {
        if (this.isDuplicatePendingRequestError(error)) {
          this.markPlanPending(key);
          this.messageService.add({
            key: 'global',
            severity: 'warn',
            summary: 'Trial request already pending',
            detail: 'You already have a pending trial request',
            life: 5000,
          });
          return;
        }

        const parsed = parseBackendError(error);
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Request failed',
          detail: error?.error?.detail || toFriendlyErrorMessage(parsed) || error?.message || 'Unable to submit the trial request right now.',
          life: 7000,
        });
      },
    });
  }

  formatPlanPrice(priceValue: unknown, currencyValue: unknown, intervalValue: unknown): string {
    const price = Number(priceValue ?? 0);
    const currency = (currencyValue ?? 'USD').toString();
    const interval = (intervalValue ?? 'MONTHLY').toString().toLowerCase();

    if (!Number.isFinite(price) || price <= 0) {
      return 'Free';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price) + ` / ${interval === 'yearly' ? 'year' : 'month'}`;
  }

  formatPrice(plan: UpgradePlanView | SubscriptionPlan | undefined): string {
    if (!plan) {
      return 'Free';
    }

    return this.formatPlanPrice(plan.price, plan.currency, plan.billingInterval);
  }

  formatBillingInterval(value: unknown): string {
    const text = (value ?? '').toString().trim().toLowerCase();
    if (!text) {
      return 'Not specified';
    }

    if (text === 'monthly') return 'Billed monthly';
    if (text === 'yearly' || text === 'annual') return 'Billed yearly';
    return text.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  statusText(status: unknown): string {
    const text = (status ?? 'FREE').toString().trim();
    if (!text) {
      return 'Free';
    }

    return text
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  planStatusLabel(plan: UpgradePlanView): string {
    if (plan.badgeText?.trim()) {
      return plan.badgeText.trim();
    }

    if (plan.recommended) {
      return 'Recommended';
    }

    return this.formatBillingInterval(plan.billingInterval);
  }

  templateAccessText(value: unknown): string {
    const text = (value ?? 'BASIC').toString().trim().toUpperCase();

    if (text === 'ALL') {
      return 'All templates';
    }

    if (text === 'PREMIUM' || text === 'PRO') {
      return 'Pro templates';
    }

    return 'Basic templates';
  }

  storageText(value: unknown): string {
    const amount = Number(value ?? NaN);
    if (!Number.isFinite(amount) || amount <= 0) {
      return '—';
    }

    if (amount >= 1024) {
      const gb = amount / 1024;
      return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB`;
    }

    return `${amount} MB`;
  }

  planSubtitle(plan: UpgradePlanView): string {
    return (plan.marketingSubtitle ?? '').toString().trim();
  }

  actionLabel(plan: UpgradePlanView): string {
    if ((plan.trialDays ?? 0) > 0) {
      return `Start ${plan.trialDays}-day trial`;
    }

    return Number(plan.price ?? 0) > 0 ? 'Upgrade now' : 'Choose plan';
  }

  actionNote(plan: UpgradePlanView): string {
    if ((plan.trialDays ?? 0) > 0) {
      return 'Start with a trial and keep it only if it works for you.';
    }

    return 'Your access updates right away.';
  }

  private featureTextsFromApi(plan: SubscriptionPlan, preferredKeys: string[]): string[] {
    const parsed = this.parseFeaturesJson(plan.featuresJson);
    if (!parsed) {
      return [];
    }

    if (Array.isArray(parsed)) {
      return this.toTextList(parsed);
    }

    if (typeof parsed === 'object') {
      const keyedValues = preferredKeys.flatMap((key) => this.toTextList((parsed as Record<string, unknown>)[key]));
      if (keyedValues.length > 0) {
        return keyedValues;
      }

      return Object.values(parsed as Record<string, unknown>).flatMap((value) => this.toTextList(value));
    }

    return [];
  }

  private parseFeaturesJson(value: unknown): unknown {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }

    return value;
  }

  private toTextList(value: unknown): string[] {
    if (!value) {
      return [];
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? [trimmed] : [];
    }

    if (Array.isArray(value)) {
      return value.flatMap((item) => this.toTextList(item));
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      for (const key of ['label', 'title', 'name', 'text', 'value']) {
        const candidate = record[key];
        if (typeof candidate === 'string' && candidate.trim()) {
          return [candidate.trim()];
        }
      }
    }

    return [];
  }

  private planFeatureBullets(plan: SubscriptionPlan): string[] {
    const direct = this.featureTextsFromApi(plan, ['featureBullets', 'bullets', 'features', 'included', 'benefits']);
    if (direct.length > 0) {
      return [...new Set(direct)].slice(0, 6);
    }

    const items: string[] = [];
    if (typeof plan.resumeLimit === 'number') {
      items.push(`${plan.resumeLimit} resume slots`);
    }
    if (plan.templateAccessLevel) {
      items.push(this.templateAccessText(plan.templateAccessLevel));
    }
    if (plan.jobTrackingEnabled) {
      items.push('Job tracking');
    }
    if (plan.courseCentralEnabled) {
      items.push('Course central');
    }
    if (plan.alertsEnabled) {
      items.push('Alerts');
    }
    if (typeof plan.enterpriseUsersLimit === 'number') {
      items.push(`${plan.enterpriseUsersLimit} seats`);
    }
    if (typeof plan.storageLimitMb === 'number') {
      items.push(`${this.storageText(plan.storageLimitMb)} storage`);
    }

    return [...new Set(items)].slice(0, 6);
  }

  private isRecommendedFallback(plan: SubscriptionPlan): boolean {
    const availablePlans = this.plans().filter((candidate) => !this.isCurrentPlan(candidate));
    if (availablePlans.length === 0) {
      return false;
    }

    const currentSortOrder = Number(this.currentPlan()?.sortOrder ?? -1);
    const orderedUpgrade = availablePlans.find((candidate) => Number(candidate.sortOrder ?? Number.MAX_SAFE_INTEGER) > currentSortOrder);
    const recommendedCode = (orderedUpgrade ?? availablePlans[0]).code ?? null;
    return (plan.code ?? '').toString() === (recommendedCode ?? '').toString();
  }

  private payloadCurrentPlan(): Record<string, unknown> | null {
    const payload = this.payload();
    if (!payload) {
      return null;
    }

    return this.firstRecord(payload, ['currentPlan', 'current', 'plan', 'subscription', 'currentSubscription']);
  }

  private payloadUsage(): UsageView | null {
    const payload = this.payload();
    if (!payload) {
      return null;
    }

    const usage = this.firstRecord(payload, ['usage', 'resumeUsage', 'counts']);
    if (!usage) {
      return null;
    }

    const used = this.firstNumber(usage, ['usedResumes', 'used', 'resumeCount', 'count']) ?? 0;
    const allowed = this.firstNullableNumber(usage, ['allowedResumes', 'allowed', 'resumeLimit', 'limit']);
    const remaining = this.firstNullableNumber(usage, ['remainingResumes', 'remaining'])
      ?? (typeof allowed === 'number' ? Math.max(0, allowed - used) : null);

    return {
      used,
      allowed,
      remaining,
      progressPercent: typeof allowed === 'number' && allowed > 0 ? Math.min(100, Math.max(0, (used / allowed) * 100)) : null,
    };
  }

  private payloadUpgradeOptions(): UpgradePlanView[] {
    const payload = this.payload();
    if (!payload) {
      return [];
    }

    const options = this.firstArray(payload, ['upgradeOptions', 'options', 'upgrades', 'plans']);
    if (options.length === 0) {
      return [];
    }

    return options
      .map((option) => this.normalizeUpgradeOption(option))
      .filter((option): option is UpgradePlanView => !!option && !!option.code);
  }

  private normalizeUpgradeOption(value: unknown): UpgradePlanView | null {
    const record = this.toRecord(value);
    if (!record) {
      return null;
    }

    const code = this.firstText(record, ['planCode', 'code', 'id']);
    const name = this.firstText(record, ['marketingTitle', 'planName', 'name', 'title', 'code']);
    const badgeText = this.firstText(record, ['badgeText', 'badge', 'badgeLabel']);
    const recommended = this.firstBoolean(record, ['recommended', 'isRecommended', 'highlighted']) ?? false;
    const featureBullets = this.firstTextArray(record, ['featureBullets', 'bullets', 'features', 'included', 'benefits']);

    return {
      planId: this.firstText(record, ['planId', 'requestedPlanId', 'id']) || undefined,
      code,
      name: name || code,
      marketingTitle: this.firstText(record, ['marketingTitle', 'planName', 'name', 'title']) || undefined,
      marketingSubtitle: this.firstText(record, ['marketingSubtitle', 'subtitle', 'description']) || undefined,
      price: this.firstNullableNumber(record, ['price', 'amount', 'monthlyPrice']),
      currency: this.firstText(record, ['currency']) || 'USD',
      billingInterval: this.firstText(record, ['billingInterval', 'interval', 'period']) || 'MONTHLY',
      badgeText: badgeText || undefined,
      recommended,
      featureBullets,
      trialDays: this.firstNullableNumber(record, ['trialDays']) ?? undefined,
    };
  }

  private planBadgeText(plan: SubscriptionPlan | undefined): string | undefined {
    if (!plan) {
      return undefined;
    }

    const features = this.parseFeaturesJson(plan.featuresJson);
    if (features && typeof features === 'object' && !Array.isArray(features)) {
      const record = features as Record<string, unknown>;
      return this.firstText(record, ['badgeText', 'badge', 'badgeLabel']) || undefined;
    }

    return undefined;
  }

  private toRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private firstRecord(source: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
    for (const key of keys) {
      const candidate = this.toRecord(source[key]);
      if (candidate) {
        return candidate;
      }
    }

    return null;
  }

  private firstArray(source: Record<string, unknown>, keys: string[]): unknown[] {
    for (const key of keys) {
      const candidate = source[key];
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    return [];
  }

  private firstText(source: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const value = (source[key] ?? '').toString().trim();
      if (value) {
        return value;
      }
    }

    return '';
  }

  private firstNumber(source: Record<string, unknown>, keys: string[]): number | null {
    for (const key of keys) {
      const value = this.toNumber(source[key]);
      if (value !== null) {
        return value;
      }
    }

    return null;
  }

  private firstNullableNumber(source: Record<string, unknown>, keys: string[]): number | null {
    const unlimited = this.firstBoolean(source, ['unlimited', 'isUnlimited']);
    if (unlimited) {
      return null;
    }

    return this.firstNumber(source, keys);
  }

  private firstBoolean(source: Record<string, unknown>, keys: string[]): boolean | null {
    for (const key of keys) {
      const raw = source[key];
      if (typeof raw === 'boolean') {
        return raw;
      }

      const text = (raw ?? '').toString().trim().toLowerCase();
      if (text === 'true') return true;
      if (text === 'false') return false;
    }

    return null;
  }

  private firstTextArray(source: Record<string, unknown>, keys: string[]): string[] {
    for (const key of keys) {
      const items = this.toTextList(source[key]);
      if (items.length > 0) {
        return [...new Set(items)].slice(0, 8);
      }
    }

    return [];
  }

  private toNumber(value: unknown): number | null {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  private markPlanPending(key: string): void {
    if (!key) {
      return;
    }

    this.pendingRequestPlanIds.update((current) => ({
      ...current,
      [key]: true,
    }));
  }

  private isDuplicatePendingRequestError(error: unknown): boolean {
    const parsed = parseBackendError(error);
    const code = (parsed.code ?? '').toString().trim().toUpperCase();
    const message = [
      parsed.message,
      (error as { error?: { detail?: unknown; message?: unknown } } | null | undefined)?.error?.detail,
      (error as { error?: { detail?: unknown; message?: unknown } } | null | undefined)?.error?.message,
      (error as { message?: unknown } | null | undefined)?.message,
    ].map((value) => (value ?? '').toString().trim().toLowerCase()).filter(Boolean).join(' ');

    if (parsed.status === 409) {
      return true;
    }

    if (!code && !message) {
      return false;
    }

    return code.includes('PENDING')
      || code.includes('DUPLICATE')
      || code.includes('ALREADY')
      || message.includes('pending upgrade request')
      || message.includes('already have a pending upgrade request')
      || message.includes('already has a pending upgrade request')
      || message.includes('duplicate pending request')
      || message.includes('already exists');
  }

  private requestKey(plan: UpgradePlanView): string {
    return (plan.planId ?? plan.code ?? '').toString();
  }
}