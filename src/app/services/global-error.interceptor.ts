import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { parseBackendError, toFriendlyErrorMessage, isUpgradeRequiredError } from 'src/app/utils/api-error';
import { UpgradeDrawerService } from 'src/app/shared/upgrade-drawer/upgrade-drawer.service';

@Injectable()
export class GlobalErrorInterceptor implements HttpInterceptor {
  loadingBar = inject(LoadingBarService);
  messageService = inject(MessageService);
  router = inject(Router);
  upgradeDrawer = inject(UpgradeDrawerService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    return next.handle(req).pipe(
      catchError((error: any) => {
          if (error instanceof HttpErrorResponse && error.status === 500) {
            this.loadingBar.complete();
                  console.log('[GlobalErrorInterceptor] Showing PrimeNG toast:', error?.error?.detail || error?.message || 'Internal Server Error');
                  this.messageService.add({
            key: 'global',
            severity: 'error',
            summary: 'Server Error',
            detail: error?.error?.detail || error?.message || 'Internal Server Error',
            life: 7000
          });
        }

        if (error instanceof HttpErrorResponse) {
          const parsed = parseBackendError(error);
          const currentUrl = (this.router.url ?? '').toString();
          const onUpgradePage = currentUrl.startsWith('/pricing') || currentUrl.startsWith('/subscription') || currentUrl.startsWith('/user/enterprise/subscription');
          const isPlanFetch = (req.url ?? '').includes('/api/subscription-plans');

          if (!onUpgradePage && !isPlanFetch && isUpgradeRequiredError(parsed)) {
            const detail = toFriendlyErrorMessage(parsed);
            this.messageService.add({
              key: 'global',
              severity: 'warn',
              summary: 'Upgrade required',
              detail,
              life: 6000,
            });
            this.upgradeDrawer.openForCurrentContext({
              title: this.upgradeTitle(parsed.code),
              message: this.upgradeMessage(parsed.code, detail),
              returnUrl: currentUrl,
            });
          }
        }

        return throwError(() => error);
      })
    );
  }

  private upgradeTitle(code?: string): string {
    switch ((code ?? '').toString().toUpperCase()) {
      case 'TEMPLATE_NOT_ALLOWED':
        return 'Premium template access';
      case 'RESUME_LIMIT_REACHED':
      case 'RESUME_LIMIT_EXCEEDED':
        return 'Resume limit reached';
      case 'SEAT_LIMIT_REACHED':
        return 'Upgrade for more seats';
      case 'TRIAL_ENDED':
        return 'Trial ended';
      case 'SUBSCRIPTION_EXPIRED':
        return 'Subscription expired';
      default:
        return 'Upgrade required';
    }
  }

  private upgradeMessage(code: string | undefined, detail: string): string {
    switch ((code ?? '').toString().toUpperCase()) {
      case 'TEMPLATE_NOT_ALLOWED':
        return 'Upgrade your plan to keep using premium resume templates and exports.';
      case 'RESUME_LIMIT_REACHED':
      case 'RESUME_LIMIT_EXCEEDED':
        return `${detail} Choose a plan with more resume storage to continue.`;
      case 'SEAT_LIMIT_REACHED':
        return 'Your team has reached its seat limit. Upgrade your enterprise plan to invite more members.';
      case 'TRIAL_ENDED':
      case 'SUBSCRIPTION_EXPIRED':
        return `${detail} Review available plans to restore access.`;
      default:
        return detail;
    }
  }
}

export const globalErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: GlobalErrorInterceptor,
  multi: true
};
