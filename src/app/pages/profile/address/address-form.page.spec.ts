import { signal } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AddressFormPage } from './address-form.page';
import { AuthService } from 'src/app/services/auth.service';
import { AppUtilService } from 'src/app/services/app.util.service';
import { UserStoreService } from 'src/app/services/store/user-store.service';

class StubAuthService {
  getStates() {
    return of([]);
  }

  getAddress() {
    return of([]);
  }
}

class StubUserStoreService {
  getUserAccount() {
    return signal({ login: 'test' } as any);
  }
  getSelectedAddresses() {
    return signal({} as any);
  }
  getUserAddresses() {
    return signal([] as any[]);
  }
  getUserLoginStatus() {
    return signal(false);
  }

  updateAddresses() {}
}

class StubAppUtilService {}

describe('AddressFormPage', () => {
  let component: AddressFormPage;
  let fixture: ComponentFixture<AddressFormPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddressFormPage],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: StubAuthService },
        { provide: UserStoreService, useClass: StubUserStoreService },
        { provide: AppUtilService, useClass: StubAppUtilService },
        { provide: MatBottomSheet, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: Location, useValue: { back: () => undefined } },
      ],
    });

    fixture = TestBed.createComponent(AddressFormPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
