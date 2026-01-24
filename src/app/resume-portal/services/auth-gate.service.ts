import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from 'src/app/services/store/user-store.service';

@Injectable({ providedIn: 'root' })
export class AuthGateService {
  private router = inject(Router);
  private userStore = inject(UserStoreService);

  isLoggedIn(): boolean {
    return !!this.userStore.state().isUserLoggedIn;
  }

  /**
   * Redirects to sign-in if not logged in. Action is encoded into returnUrl so it can be retried after login.
   */
  requireLoginOrRedirect(returnUrl: string): boolean {
    if (this.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/sign-in'], {
      queryParams: { returnUrl },
    });
    return false;
  }
}
