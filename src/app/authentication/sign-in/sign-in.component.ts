import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { take } from 'rxjs/operators';


@Component({
    selector: 'app-sign-in',
    imports: [RouterLink, MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private userStore: UserStoreService,
        private authApi: AuthApiService,
        private accessFacade: AccessFacadeService,
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;
    onSubmit() {
        // E2E-only: prove submit handler ran.
        this.e2eSetAttr('data-e2e-submit-clicked', 'true');
        if (this.isE2E()) console.info('[E2E] onSubmit() entered');

        if (!this.authForm.valid) {
            this.e2eSetAttr('data-e2e-login-api', 'form-invalid');
            if (this.isE2E()) console.warn('[E2E] form invalid', this.authForm.errors, this.authForm.value);
            return;
        }

        const email = String(this.authForm.value.email ?? '');
        const password = String(this.authForm.value.password ?? '');

        this.authApi.login(email, password).subscribe({
            next: (response) => {
                this.e2eSetAttr('data-e2e-login-api', 'success');
                if (this.isE2E()) console.info('[E2E] login API success', response);

                // Mark authenticated for guards & portal gating.
                this.userStore.setUserLoginStatus(true);
                if (response?.id_token) {
                    this.localStorageService.setItem('authToken', response.id_token);
                    this.userStore.updateToken(response.id_token);
                }
                this.localStorageService.setItem('authenticated', true);

                const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                if (returnUrl && returnUrl.startsWith('/')) {
                    this.router.navigateByUrl(returnUrl);
                    return;
                }

                this.accessFacade.reload();
                this.accessFacade.accessMe$
                    .pipe(take(1))
                    .subscribe((me) => {
                        if (this.accessFacade.isAdmin(me)) {
                            this.router.navigate(['/user/dashboard-admin']);
                            return;
                        }
                        if (this.accessFacade.isEnterprise(me)) {
                            this.router.navigate(['/user/enterprise']);
                            return;
                        }
                        this.router.navigate(['/user/dashboard']);
                    });
            },
            error: (err) => {
                this.e2eSetAttr('data-e2e-login-api', 'error');
                this.e2eSetAttr('data-e2e-login-error', this.toErrorMessage(err));
                if (this.isE2E()) console.error('[E2E] login API error', err);
                // Do not navigate on error.
            }
        });
    }

    private isE2E(): boolean {
        return typeof window !== 'undefined' && (window as any).__E2E__ === true;
    }

    private e2eSetAttr(name: string, value: string): void {
        if (!this.isE2E()) return;
        if (typeof document === 'undefined' || !document.body) return;
        document.body.setAttribute(name, value);
    }

    private toErrorMessage(err: unknown): string {
        if (err instanceof HttpErrorResponse) {
            const detail = (err.error as any)?.detail;
            const message = (err.error as any)?.message;
            return String(detail ?? message ?? err.message ?? 'Unknown error');
        }
        const anyErr = err as any;
        return String(anyErr?.message ?? anyErr?.toString?.() ?? 'Unknown error');
    }

}