import { signal } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { of } from 'rxjs';

import { LoginProfileFormPage } from './login-form.page';
import { AuthService } from 'src/app/services/auth.service';
import { AppUtilService } from 'src/app/services/app.util.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { YeaSnackBarService } from 'src/app/services/utilities/snackbar';
import { AppConstantsService } from 'src/app/services/app-constants.service';

class StubAuthService {
  getLoginProfile() {
    return of({} as any);
  }
}

class StubUserStoreService {
  getUserAccount() {
    return signal({ login: 'test' } as any);
  }
  getUserBioProfile() {
    return signal({} as any);
  }
  getUserLoginProfile() {
    return signal({} as any);
  }

  updateLoginProfile() {}
}

class StubAppUtilService {}

class StubSnackBarService {
  openSnackBar() {}
}

class StubAppConstantsService {
  snackbarType = { ERROR: 'ERROR' } as const;
}

describe('LoginProfileFormPage', () => {
  let component: LoginProfileFormPage;
  let fixture: ComponentFixture<LoginProfileFormPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginProfileFormPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: StubAuthService },
        { provide: UserStoreService, useClass: StubUserStoreService },
        { provide: AppUtilService, useClass: StubAppUtilService },
        { provide: YeaSnackBarService, useClass: StubSnackBarService },
        { provide: AppConstantsService, useClass: StubAppConstantsService },
        { provide: MatBottomSheet, useValue: {} },
        { provide: Location, useValue: { back: () => undefined } },
      ],
    });

    fixture = TestBed.createComponent(LoginProfileFormPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
