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
import { UpgradeRouterService } from './upgrade-router.service';

@Injectable()
export class GlobalErrorInterceptor implements HttpInterceptor {
  loadingBar = inject(LoadingBarService);
  messageService = inject(MessageService);
  router = inject(Router);
  upgradeRouter = inject(UpgradeRouterService);

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
          const onPricingPage = (this.router.url ?? '').startsWith('/pricing');
          const isPlanFetch = (req.url ?? '').includes('/api/subscription-plans');

          if (!onPricingPage && !isPlanFetch && isUpgradeRequiredError(parsed)) {
            this.messageService.add({
              key: 'global',
              severity: 'warn',
              summary: 'Upgrade required',
              detail: toFriendlyErrorMessage(parsed),
              life: 6000,
            });
            this.upgradeRouter.goToPricingForError((parsed.code ?? '').toString());
          }
        }

        return throwError(() => error);
      })
    );
  }
}

export const globalErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: GlobalErrorInterceptor,
  multi: true
};
