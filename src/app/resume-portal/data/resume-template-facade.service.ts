import { Injectable, Injector, computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResumeTemplateSourceService } from './resume-template-source.service';
import { ResumeTemplateUi } from './resume-template.ui.model';
import { TemplateAccessService, TemplateDenyReason } from '../services/template-access.service';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { hasPremiumTemplateAccess } from 'src/app/guards/access-check.util';

@Injectable({ providedIn: 'root' })
export class ResumeTemplateFacadeService {
  private readonly source = inject(ResumeTemplateSourceService);
  private readonly templateAccess = inject(TemplateAccessService);
  private readonly access = inject(AccessFacadeService);
  private readonly injector = inject(Injector);

  readonly templates = this.source.templates;
  readonly loading = this.source.loading;
  readonly error = this.source.error;
  readonly hasPremiumAccess = computed(() => hasPremiumTemplateAccess(this.access.accessMeSignal()));
  readonly hasPremiumAccess$ = toObservable(this.hasPremiumAccess, { injector: this.injector });

  loadTemplates(mode: 'public' | 'available' = 'public'): void {
    this.source.loadTemplates(mode);
  }

  refresh(forceRefresh = true): void {
    this.source.refresh(forceRefresh);
  }

  isPremium(template: ResumeTemplateUi): boolean {
    const level = (template.accessLevel ?? '').toString().toUpperCase();
    return level === 'PREMIUM';
  }

  canUseTemplate(template: ResumeTemplateUi): { allowed: boolean; reason?: TemplateDenyReason } {
    const isPremium = this.isPremium(template);
    if (!isPremium) {
      return { allowed: true };
    }

    if (!this.access.isLoggedIn()) {
      return { allowed: false, reason: 'LOGIN_REQUIRED' };
    }

    return this.hasPremiumAccess() ? { allowed: true } : { allowed: false, reason: 'UPGRADE_REQUIRED' };
  }

  isLocked(template: ResumeTemplateUi): boolean {
    if (!this.isPremium(template)) return false;
    const gate = this.canUseTemplate(template);
    return !gate.allowed && gate.reason !== 'LOGIN_REQUIRED';
  }

  explainReason(reason?: TemplateDenyReason): string {
    return this.templateAccess.explainReason(reason);
  }

  handleDenied(reason: TemplateDenyReason | undefined, returnUrl?: string): void {
    this.templateAccess.handleDenied(reason, returnUrl);
  }

}
