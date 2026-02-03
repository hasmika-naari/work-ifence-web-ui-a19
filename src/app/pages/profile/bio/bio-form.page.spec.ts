import { signal } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { of } from 'rxjs';

import { BioProfileFormPage } from './bio-form.page';
import { AuthService } from 'src/app/services/auth.service';
import { AppUtilService } from 'src/app/services/app.util.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { AppConstantsService } from 'src/app/services/app-constants.service';
import { ResumeService } from 'src/app/services/resume.service';

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
}

class StubAppUtilService {}

class StubAppConstantsService {
  BASE_AWS_API_URL = '';
  JWT_TOKEN = '';
  snackbarType = { ERROR: 'ERROR' } as const;
}

class StubResumeService {}

describe('BioProfileFormPage', () => {
  let component: BioProfileFormPage;
  let fixture: ComponentFixture<BioProfileFormPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BioProfileFormPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: StubAuthService },
        { provide: UserStoreService, useClass: StubUserStoreService },
        { provide: AppUtilService, useClass: StubAppUtilService },
        { provide: AppConstantsService, useClass: StubAppConstantsService },
        { provide: ResumeService, useClass: StubResumeService },
        { provide: MatBottomSheet, useValue: {} },
        { provide: Location, useValue: { back: () => undefined } },
      ],
    });

    fixture = TestBed.createComponent(BioProfileFormPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
