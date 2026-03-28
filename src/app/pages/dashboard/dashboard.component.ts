import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, DestroyRef, Inject, OnInit, PLATFORM_ID, Signal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { BioProfile } from 'src/app/services/profile.model';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import type { FeatureKey } from 'src/app/models/feature-key.model';
import { DashboardContextService } from 'src/app/services/dashboard-context.service';
import { ActiveRoleService } from 'src/app/services/active-role.service';
import { UpgradeRouterService } from 'src/app/services/upgrade-router.service';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DashboardStatCardDTO } from 'src/app/core/models/my-dashboard.model';
import { SessionContextStore } from 'src/app/core/store/session-context.store';
import { UserDashboardStore } from 'src/app/core/store/user-dashboard.store';
import { forkJoin, of } from 'rxjs';
import { AccountPlanSummaryDTO, AccountPlanSummaryFeatureDTO, AccountPlanSummaryService } from 'src/app/services/account-plan-summary.service';
import { normalizeEntitlementKey } from 'src/app/entitlements/entitlement-key.util';

interface DashboardStatVM {
  key: string;
  title: string;
  value: string;
  sub: string;
  color: string;
  icon: string;
  severity: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  isLocked: boolean;
  actionRoute: string;
  tooltip: string;
  showUpgradeHint: boolean;
}

interface RecentResumeVM {
  id: unknown;
  title?: string;
  lastModifiedDate?: string;
}

interface RecentJobAppVM {
  id: unknown;
  company?: string;
  jobTitle?: string;
  stage?: string;
  lastModifiedDate?: string;
}

interface DashboardRecommendationVM {
  key: string;
  title: string;
  actionRoute?: string;
  isLocked?: boolean;
}

interface DashboardAlertVM {
  severity: 'info' | 'warning' | 'danger' | 'success' | 'neutral';
  message: string;
  actionRoute?: string;
}

interface FeatureItem {
  key: string;
  title: string;
  desc: string;
  icon: string;
  locked?: boolean;
}

interface RecommendationRowVM {
  key: string;
  title: string;
  desc: string;
  priority: 'High' | 'Medium';
  isLocked: boolean;
  actionRoute?: string;
}

@Component({
  selector: 'fury-dashboard',
  standalone: true,
  imports: [MatCardModule, MatSnackBarModule, MatIconModule, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line

})
export class DashboardComponent implements OnInit {
 
  /**
   * Needed for the Layout
   */
  private _gap = 16;
  gap = `${this._gap}px`;

  private routerService: Router =  inject(Router);
  private userStore: UserStoreService =  inject(UserStoreService);
  private accessFacade: AccessFacadeService = inject(AccessFacadeService);
  private remoteConfig: RemoteConfigFacadeService = inject(RemoteConfigFacadeService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private dashboardContext: DashboardContextService = inject(DashboardContextService);
  private activeRoleService: ActiveRoleService = inject(ActiveRoleService);
  private upgradeRouter: UpgradeRouterService = inject(UpgradeRouterService);
  private upgradeDrawer: UpgradeDrawerService = inject(UpgradeDrawerService);
  private sessionContextStore: SessionContextStore = inject(SessionContextStore);
  private userDashboardStore: UserDashboardStore = inject(UserDashboardStore);
  private accountPlanSummaryService: AccountPlanSummaryService = inject(AccountPlanSummaryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly swipeHintStorageKey = 'wif.dashboard.statsSwipeHintHidden';
  private readonly dashboardErrorDismissed = signal(false);
  private readonly statsOrder = ['profileCompletion', 'resumes', 'jobApps', 'plan', 'exports', 'activity'];
  private readonly entitlementIconMap: Record<string, string> = {
    RESUME_BUILDER: 'description',
    RESUME_PORTAL: 'folder_open',
    RESUME_EXPORT: 'picture_as_pdf',
    RESUME_TEMPLATES_PREMIUM: 'style',
    JOB_TRACKING: 'work_outline',
    JOB_PIPELINE: 'timeline',
    JOB_ALERTS: 'notifications',
    LEARN_PORTAL: 'school',
    LEARN_SAVED: 'bookmark',
    DOCS_STORAGE: 'folder_copy',
    BILLING: 'credit_card',
    SUPPORT_TICKETS: 'support_agent',
    SETTINGS_ACCOUNT: 'manage_accounts',
    SETTINGS_PASSWORD: 'lock',
  };

  private readonly entitlementTitleMap: Record<string, string> = {
    RESUME_BUILDER: 'Resume Builder',
    RESUME_PORTAL: 'Resume Portal',
    JOB_TRACKING: 'Job Tracking',
    JOB_PIPELINE: 'Job Pipeline',
    JOB_ALERTS: 'Job Alerts',
    LEARN_PORTAL: 'Learning Hub',
    LEARN_SAVED: 'Saved Learning',
    SUPPORT_TICKETS: 'Support Tickets',
    SETTINGS_ACCOUNT: 'Account Settings',
    SETTINGS_PASSWORD: 'Change Password',
    DOCS_STORAGE: 'Documents Storage',
    BILLING: 'Billing',
  };

  showSwipeHint = true;

  readonly dashboard$ = this.userDashboardStore.dashboard$;
  readonly entitlements$ = this.userDashboardStore.entitlements$;
  readonly loading$ = this.userDashboardStore.loading$;
  readonly error$ = this.userDashboardStore.error$;

  private readonly dashboardState = toSignal(this.dashboard$, { initialValue: null });
  private readonly entitlementsState = toSignal(this.entitlements$, { initialValue: null });
  private readonly loadingState = toSignal(this.loading$, { initialValue: false });
  private readonly errorState = toSignal(this.error$, { initialValue: '' });
  private readonly planSummaryState = signal<AccountPlanSummaryDTO | null>(null);

  readonly displayName$ = this.dashboard$.pipe(
    map((dashboard) => {
      const welcome = dashboard?.welcome;
      return this.toText(welcome?.firstName) || this.toText(welcome?.login) || 'User';
    }),
  );

  readonly planLabel$ = this.entitlements$.pipe(
    map((entitlements) => this.normalizePlanLabel(this.planSummaryState()?.planCode || entitlements?.planCode)),
  );

  readonly currentPlanName = computed(() => {
    const summary = this.planSummaryState();
    return this.toText(summary?.planName) || this.normalizePlanLabel(summary?.planCode || this.entitlementsState()?.planCode);
  });

  readonly currentPlanCode = computed(() => {
    return this.toText(this.planSummaryState()?.planCode) || this.toText(this.entitlementsState()?.planCode) || 'FREE';
  });

  bioProfile: Signal<BioProfile> = this.userStore.getUserBioProfile();
  accessMe = this.accessFacade.accessMeSignal;
  dashboardCtx = this.dashboardContext.context;
  activeRole = computed(() => this.activeRoleService.getActiveRole()());
  isEnterpriseAdminView = computed(() => this.dashboardCtx() === 'ENTERPRISE' && this.activeRole()?.role === 'ENTERPRISE_ADMIN');

  summaryLoading = computed(() => this.loadingState());
  lastUpdatedText = computed(() => {
    const raw = this.toText(
      (this.dashboardState() as any)?.lastUpdated ??
        (this.dashboardState() as any)?.updatedAt ??
        (this.dashboardState() as any)?.lastModifiedDate,
    );
    if (!raw) return '';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return '';
    return `Last updated: ${date.toLocaleString()}`;
  });

  toolsVm = computed(() => this.buildTools());
  statsVm = computed(() => this.buildStats());

  private buildTools() {
    const base: Array<{
      key: string;
      icon: string;
      title: string;
      description: string;
      route: string;
      enabled: boolean;
      disabledMessage?: string;
      featureKey?: FeatureKey;
    }> = [
      {
        key: 'build-resume',
        icon: 'assets/img/home/resume_animated.jpg',
        title: 'Build Your Resume',
        description: 'Create the perfect resume to land your dream job',
        route: '/user/resumes/resume',
        enabled: true,
        disabledMessage: '',
      },
      {
        key: 'create-job-application',
        icon: 'assets/img/home/resume_animated.jpg',
        title: 'Create Job Application',
        description: 'Create Job Application to Track',
        route: '/user/job-applications/application',
        enabled: true,
        disabledMessage: '',
      },
      {
        key: 'manage-resumes',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Manage Resumes',
        description: 'Organize and track all Resumes',
        route: '/user/resumes',
        enabled: true,
        disabledMessage: '',
      },
      {
        key: 'manage-job-applications',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Manage Job Applications',
        description: 'Organize and track all your job applications in one place',
        route: '/user/job-applications',
        enabled: true,
        disabledMessage: '',
      },
    ];

    // Enterprise admin gets extra shortcuts (UI-only; no backend change)
    if (this.isEnterpriseAdminView() && this.remoteConfig.isFlagEnabledSafe('ENTERPRISE_CONSOLE')) {
      base.push({
        key: 'enterprise-requests',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Manage Requests',
        description: 'Review and manage employee requests',
        route: '/user/requests',
        enabled: true,
        disabledMessage: '',
      });

      base.push({
        key: 'enterprise-org',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Enterprise Org',
        description: 'Manage enterprise profile and settings',
        route: '/user/enterprise/org',
        enabled: true,
        disabledMessage: '',
      });

      base.push({
        key: 'enterprise-members',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Enterprise Members',
        description: 'Invite and manage enterprise members',
        route: '/user/enterprise/members',
        enabled: true,
        disabledMessage: '',
      });

      base.push({
        key: 'enterprise-audit',
        icon: 'assets/jobtrackerai-icon.png',
        title: 'Audit Log',
        description: 'Review access denials and admin actions',
        route: '/user/enterprise/audit',
        enabled: true,
        disabledMessage: '',
      });
    }

    return base;
  }
  buildStats(): DashboardStatVM[] {
    const cards = this.dashboardState()?.statsCards ?? [];

    if (cards.length > 0) {
      return this.orderStatsCards(cards).map((card) => this.toStatVm(card));
    }

    const fallback: DashboardStatCardDTO[] = [
      { key: 'profileCompletion', title: 'Profile Completion', value: '0%', subValue: 'Add skills to improve', severity: 'info' },
      { key: 'resumes', title: 'Resumes', value: '0', subValue: 'Updated 0 days ago', severity: 'warning' },
      { key: 'jobApps', title: 'Job Applications', value: '0', subValue: 'No active interviews', severity: 'neutral' },
      { key: 'plan', title: 'Current Plan', value: 'FREE', subValue: 'Active', severity: 'neutral' },
      { key: 'exports', title: 'Exports', value: 'Available', subValue: 'Usage count unavailable', severity: 'success' },
      { key: 'activity', title: 'Activity', value: 'Active', subValue: 'Last activity 0 days ago', severity: 'success' },
    ];

    return fallback.map((card) => this.toStatVm(card));
  }

  get entitlementsVm(): string[] {
    return this.entitlementsState()?.entitlements ?? [];
  }

  get dashboardErrorMessage(): string {
    return this.errorState();
  }

  isDashboardErrorDismissed(): boolean {
    return this.dashboardErrorDismissed();
  }

  get displayName(): string {
    const welcome = this.dashboardState()?.welcome;
    return this.toText(welcome?.firstName) || this.toText(welcome?.login) || 'User';
  }

  get planLabel(): string {
    return this.normalizePlanLabel(this.currentPlanCode());
  }

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    this.loadSwipeHintState();
    this.loadDashboard();
  }

  reloadSummary(): void {
    this.loadDashboard();
  }

  dismissDashboardErrorBanner(): void {
    this.dashboardErrorDismissed.set(true);
  }

  retryDashboardLoad(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardErrorDismissed.set(false);

    this.sessionContextStore
      .loadAccount()
      .pipe(
        switchMap(() => {
          return forkJoin({
            dashboard: this.userDashboardStore.loadDashboard(),
            entitlements: this.userDashboardStore.loadEntitlements(),
            planSummary: this.accountPlanSummaryService.getCurrentPlanSummary().pipe(
              catchError(() => of(null)),
            ),
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (payload) => {
          this.planSummaryState.set(payload?.planSummary ?? null);
          const cardCount = payload?.dashboard?.statsCards?.length ?? 0;
          if (cardCount !== 0 && cardCount !== 6) {
            console.warn(`[Dashboard] Expected 6 statsCards but received ${cardCount}`);
          }
          console.debug('[Dashboard] stats response', payload?.dashboard);
          console.debug('[Dashboard] entitlements response', payload?.entitlements);
          console.debug('[Dashboard] plan summary response', payload?.planSummary);
        },
        error: () => void 0,
      });
  }

  hasEntitlement(key: string): boolean {
    return this.userDashboardStore.hasEntitlement(key);
  }

  recentResumes(dashboard: any): RecentResumeVM[] {
    const resumes = dashboard?.details?.recent?.resumes;
    return Array.isArray(resumes) ? resumes.slice(0, 3) : [];
  }

  recentJobApps(dashboard: any): RecentJobAppVM[] {
    const jobApps = dashboard?.details?.recent?.jobApps;
    return Array.isArray(jobApps) ? jobApps.slice(0, 3) : [];
  }

  hasRecentItems(dashboard: any): boolean {
    return this.recentResumes(dashboard).length > 0 || this.recentJobApps(dashboard).length > 0;
  }

  recommendations(dashboard: any): DashboardRecommendationVM[] {
    const items = dashboard?.details?.recommendations;
    return Array.isArray(items) ? items : [];
  }

  recommendationRows(dashboard: any): RecommendationRowVM[] {
    return this.recommendations(dashboard).map((item) => {
      const key = this.toText(item?.key).toLowerCase();
      let desc = 'Review this recommendation to improve your dashboard results.';
      let priority: RecommendationRowVM['priority'] = 'Medium';

      if (key.includes('profile')) {
        desc = 'Increase your profile strength to improve results.';
        priority = 'High';
      } else if (key.includes('export')) {
        desc = item?.isLocked
          ? 'Unlock PDF export with PRO plan.'
          : 'Export your resume as PDF in one click.';
      } else if (key.includes('resume')) {
        desc = 'Keep your resumes updated for better matches.';
      } else if (key.includes('job')) {
        desc = 'Track applications and improve follow-up outcomes.';
      }

      return {
        key: this.toText(item?.key) || this.toText(item?.title),
        title: this.toText(item?.title) || 'Recommendation',
        desc,
        priority,
        isLocked: !!item?.isLocked,
        actionRoute: this.toText(item?.actionRoute),
      };
    });
  }

  alerts(dashboard: any): DashboardAlertVM[] {
    const items = dashboard?.details?.alerts;
    return Array.isArray(items) ? items : [];
  }

  onRecommendationAction(item: DashboardRecommendationVM): void {
    if (item?.isLocked) {
      const recommendationTitle = this.toText(item?.title);
      this.upgradeDrawer.openForContext(this.dashboardCtx(), {
        title: recommendationTitle ? `Upgrade for ${recommendationTitle}` : 'Upgrade required',
        message: recommendationTitle ? `Upgrade your plan to unlock ${recommendationTitle} from your dashboard.` : 'Upgrade your plan to use this recommendation.',
        returnUrl: this.routerService.url,
      });
      return;
    }

    const route = this.toText(item?.actionRoute);
    if (!route) {
      return;
    }

    void this.routerService.navigateByUrl(route);
  }

  onRecommendationRowAction(item: RecommendationRowVM): void {
    if (item.isLocked) {
      this.onUpgradeClick({
        key: item.key,
        title: item.title,
        desc: item.desc,
        icon: 'workspace_premium',
        locked: true,
      });
      return;
    }

    const route = this.toText(item.actionRoute);
    if (!route) {
      return;
    }

    void this.routerService.navigateByUrl(route);
  }

  onAlertAction(item: DashboardAlertVM): void {
    const route = this.toText(item?.actionRoute);
    if (!route) {
      return;
    }

    void this.routerService.navigateByUrl(route);
  }

  includedFeatures(): FeatureItem[] {
    const features = this.planSummaryState()?.features;

    if (!Array.isArray(features) || !features.length) {
      return [];
    }

    return features.slice(0, 10).map((feature) => this.toFeatureItem(feature));
  }

  lockedFeatures(): FeatureItem[] {
    const premiumCandidates: FeatureItem[] = [
      {
        key: 'RESUME_EXPORT',
        title: 'PDF Resume Export',
        desc: 'Download polished resumes as PDF',
        icon: 'picture_as_pdf',
        locked: true,
      },
      {
        key: 'RESUME_TEMPLATES_PREMIUM',
        title: 'Premium Templates',
        desc: 'Access advanced resume templates',
        icon: 'style',
        locked: true,
      },
      {
        key: 'JOB_ALERTS',
        title: 'Advanced Job Alerts',
        desc: 'Get proactive alerts for matching roles',
        icon: 'notifications_active',
        locked: true,
      },
    ];

    return premiumCandidates.filter((feature) => !this.hasEntitlement(feature.key));
  }

  showUpgradeToUnlock(): boolean {
    return this.planLabel === 'FREE' || this.lockedFeatures().length > 0;
  }

  private toFeatureItem(feature: AccountPlanSummaryFeatureDTO): FeatureItem {
    const entitlementKey = normalizeEntitlementKey(feature?.entitlementKey);
    const titleOverride = this.entitlementTitleMap[entitlementKey];

    return {
      key: entitlementKey || this.toText(feature?.title),
      title: this.toText(feature?.title) || titleOverride || entitlementKey || 'Feature',
      desc: this.toText(feature?.description) || 'Included in your current plan.',
      icon: this.entitlementIconMap[entitlementKey] || 'check_circle',
      locked: false,
    };
  }

  onUpgradeClick(feature?: FeatureItem): void {
    const featureTitle = this.toText(feature?.title);
    const featureMessage = featureTitle
      ? `Upgrade your plan to unlock ${featureTitle} and the other premium tools in this section.`
      : 'Upgrade your plan to unlock the premium features in this section.';

    this.upgradeDrawer.openForContext(this.dashboardCtx(), {
      title: featureTitle ? `Upgrade for ${featureTitle}` : 'Upgrade required',
      message: featureMessage,
      returnUrl: this.routerService.url,
    });
  }

  recentJobPrimary(item: RecentJobAppVM): string {
    const company = this.toText(item?.company);
    const jobTitle = this.toText(item?.jobTitle);

    if (company && jobTitle) {
      return `${company} · ${jobTitle}`;
    }

    return company || jobTitle || '—';
  }

  formatRecentDate(value?: string): string {
    const text = this.toText(value);
    if (!text) {
      return '—';
    }

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
      return text;
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  goCreateResume(): void {
    void this.routerService.navigate(['/user/resumes/resume']);
  }

  goTrackJobApplication(): void {
    void this.routerService.navigate(['/user/job-applications/application']);
  }

  onStatsRowScroll(event: Event): void {
    if (!this.showSwipeHint) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target || target.scrollLeft <= 10) {
      return;
    }

    this.showSwipeHint = false;
    this.persistSwipeHintState();
  }

  onStatCardClick(stat: DashboardStatVM): void {
    if (stat.isLocked) {
      return;
    }

    const route = this.toText(stat.actionRoute);
    if (!route) {
      return;
    }

    void this.routerService.navigateByUrl(route);
  }

  statMessageLine1(stat: DashboardStatVM): string {
    const key = this.toText(stat.key).toLowerCase();
    const sub = this.toText(stat.sub);
    if (sub) {
      return sub;
    }

    if (key === 'profilecompletion') {
      return 'Complete your profile to boost visibility';
    }

    if (key === 'resumes') {
      return 'Keep your resume updated regularly';
    }

    if (key === 'jobapps') {
      return 'Track progress across all applications';
    }

    if (key === 'plan') {
      return 'Subscription status is currently active';
    }

    if (key === 'exports') {
      return stat.isLocked ? 'Upgrade to unlock PDF export' : 'Export tools are ready to use';
    }

    if (key === 'activity') {
      return 'Recent account activity summary';
    }

    return 'Dashboard insight is available';
  }

  statMessageLine2(stat: DashboardStatVM): string {
    const key = this.toText(stat.key).toLowerCase();

    if (stat.showUpgradeHint) {
      return 'Upgrade to access premium benefits';
    }

    const tooltip = this.toText(stat.tooltip);
    if (tooltip) {
      return tooltip;
    }

    if (key === 'profilecompletion') {
      return 'Add skills, summary, and experience';
    }

    if (key === 'resumes') {
      return 'Use tailored resumes for each role';
    }

    if (key === 'jobapps') {
      return 'Stay on top of interviews and offers';
    }

    if (key === 'plan') {
      return 'Manage plan and billing from subscription';
    }

    if (key === 'exports') {
      return stat.isLocked ? 'Available in paid plans' : 'Download and share exported files';
    }

    if (key === 'activity') {
      return 'Review history to stay organized';
    }

    return 'Keep your dashboard data up to date';
  }

  hasDashboardData(dashboard: unknown): boolean {
    return !!dashboard;
  }

  private orderStatsCards(cards: DashboardStatCardDTO[]): DashboardStatCardDTO[] {
    const mapByKey = new Map<string, DashboardStatCardDTO>();
    for (const card of cards ?? []) {
      mapByKey.set(String(card.key ?? ''), card);
    }

    const ordered: DashboardStatCardDTO[] = [];
    for (const key of this.statsOrder) {
      const card = mapByKey.get(key);
      if (card) {
        ordered.push(card);
      }
    }

    return ordered;
  }

  private toStatVm(card: DashboardStatCardDTO): DashboardStatVM {
    const normalizedKey = String(card.key || '').toLowerCase();
    const valueText = this.toText(card.value) || '0';
    const subText = this.toText(card.subValue);
    const planCode = valueText.toUpperCase();

    const toNumber = (value: string): number => {
      const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const hasWords = (source: string, words: string[]): boolean => {
      const lower = source.toLowerCase();
      return words.some((word) => lower.includes(word));
    };

    const extractDays = (source: string): number => {
      const match = source.match(/(\d+)\s*day/i);
      return match ? Number(match[1]) : 999;
    };

    let severity: DashboardStatVM['severity'] = (card.severity as DashboardStatVM['severity']) || 'info';
    let isLocked = !!card.isLocked;
    let finalValue = valueText;
    let finalSub = subText;
    const tooltip = this.toText(card.tooltip);
    const actionRoute = this.toText(card.actionRoute);
    let showUpgradeHint = false;

    if (normalizedKey === 'profilecompletion') {
      if (!/%$/.test(finalValue)) {
        const num = toNumber(finalValue);
        finalValue = `${num}%`;
      }
      severity = card.severity || 'info';
    }

    if (normalizedKey === 'resumes') {
      const count = toNumber(finalValue);
      severity = count === 0 ? 'warning' : 'neutral';
    }

    if (normalizedKey === 'jobapps') {
      const combined = `${finalSub} ${finalValue}`;
      if (hasWords(combined, ['offer', 'accepted'])) {
        severity = 'success';
      } else if (hasWords(combined, ['interview'])) {
        severity = 'info';
      } else {
        severity = 'neutral';
      }
    }

    if (normalizedKey === 'plan') {
      const isFree = planCode === 'FREE';
      showUpgradeHint = isFree;
      severity = isFree ? 'neutral' : 'success';
    }

    if (normalizedKey === 'exports') {
      if (isLocked) {
        severity = 'warning';
        finalSub = 'Upgrade to unlock PDF export';
      } else {
        severity = 'success';
        if (!finalValue) {
          finalValue = 'Available';
        }
      }
    }

    if (normalizedKey === 'activity') {
      const days = extractDays(finalSub || finalValue);
      severity = days < 3 ? 'success' : 'neutral';
    }

    const iconMap: Record<string, string> = {
      profilecompletion: 'pi pi-user',
      resumes: 'pi pi-file',
      jobapps: 'pi pi-send',
      plan: 'pi pi-crown',
      exports: 'pi pi-download',
      activity: 'pi pi-chart-line',
    };

    const colorMap: Record<string, string> = {
      neutral: '#6c757d',
      info: '#4285F4',
      success: '#34A853',
      warning: '#FBBC05',
      danger: '#EA4335',
    };

    return {
      key: String(card.key || card.title || 'stat'),
      title: card.title || '—',
      value: finalValue || '—',
      sub: finalSub,
      color: colorMap[severity] || '#4285F4',
      icon: iconMap[normalizedKey] || 'pi pi-chart-bar',
      severity,
      isLocked,
      actionRoute,
      tooltip,
      showUpgradeHint,
    };
  }

  private toText(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    const text = String(value).trim();
    return text || '';
  }

  private normalizePlanLabel(planCode: unknown): string {
    const normalized = this.toText(planCode).toUpperCase();

    if (normalized.includes('PREMIUM')) {
      return 'PREMIUM';
    }

    if (normalized.includes('PRO')) {
      return 'PRO';
    }

    if (normalized.includes('FREE')) {
      return 'FREE';
    }

    return normalized || 'FREE';
  }

  private loadSwipeHintState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.showSwipeHint = false;
      return;
    }

    this.showSwipeHint = sessionStorage.getItem(this.swipeHintStorageKey) !== 'true';
  }

  private persistSwipeHintState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    sessionStorage.setItem(this.swipeHintStorageKey, 'true');
  }



  toolIconClass(tool: { key?: string; title?: string }): string {
    const key = this.toText(tool?.key).toLowerCase();
    const title = this.toText(tool?.title).toLowerCase();

    if (key.includes('build-resume') || title.includes('build your resume')) {
      return 'pi pi-file';
    }

    if (key.includes('manage-resumes') || title.includes('manage resumes')) {
      return 'pi pi-copy';
    }

    if (key.includes('create-job-application') || title.includes('create job application')) {
      return 'pi pi-briefcase';
    }

    if (key.includes('manage-job-applications') || title.includes('manage job applications')) {
      return 'pi pi-briefcase';
    }

    return 'pi pi-file';
  }

  onToolClick(tool: { key?: string; title?: string; route: string; enabled: boolean; disabledMessage?: string; featureKey?: FeatureKey }) {
    if (tool.featureKey && !this.accessFacade.canOrExplain(tool.featureKey)) {
      const toolTitle = this.toText(tool.title);
      this.upgradeDrawer.openForContext(this.dashboardCtx(), {
        title: toolTitle ? `Upgrade for ${toolTitle}` : 'Upgrade required',
        message: tool.disabledMessage || (toolTitle ? `Upgrade your plan to use ${toolTitle}.` : 'Upgrade required'),
        returnUrl: this.routerService.url,
      });
      return;
    }

    if (tool.enabled) {
      this.routerService.navigate([tool.route]);
      return;
    }

    this.upgradeDrawer.openForContext(this.dashboardCtx(), {
      title: this.toText(tool.title) ? `Upgrade for ${this.toText(tool.title)}` : 'Upgrade required',
      message: tool.disabledMessage || (this.toText(tool.title) ? `Upgrade your plan to use ${this.toText(tool.title)}.` : 'Upgrade required'),
      returnUrl: this.routerService.url,
    });
  }

}


