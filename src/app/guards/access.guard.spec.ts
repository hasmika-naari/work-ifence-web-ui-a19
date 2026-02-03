import { TestBed, waitForAsync } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';

import { accessGuard } from './access.guard';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';

describe('accessGuard', () => {
  it(
    'denies when requireFlag is disabled (or missing in remote config)',
    waitForAsync(async () => {
      const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl', 'navigate']);
      router.navigateByUrl.and.resolveTo(true as any);
      router.navigate.and.resolveTo(true as any);

      const accessFacade = {
        accessMe$: of({ userId: 'u1', mode: 'PERSONAL' }),
        isAdmin: () => false,
        require: () => true,
        lastDeniedReason: () => null,
      } as unknown as AccessFacadeService;

      const remoteConfig = {
        isFlagEnabledSafe: jasmine.createSpy('isFlagEnabledSafe').and.returnValue(false),
      } as unknown as RemoteConfigFacadeService;

      const storage = {
        getItem: () => true,
      } as unknown as LocalStorageService;

      const telemetry = {
        recordGateDenied: jasmine.createSpy('recordGateDenied'),
      } as unknown as GateDeniedTelemetryService;

      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: Router, useValue: router },
          { provide: AccessFacadeService, useValue: accessFacade },
          { provide: RemoteConfigFacadeService, useValue: remoteConfig },
          { provide: LocalStorageService, useValue: storage },
          { provide: GateDeniedTelemetryService, useValue: telemetry },
        ],
      });

      const route = { data: { requireFlag: 'SOME_FLAG' } } as any;
      const state = { url: '/gated' } as any;

      const result$ = TestBed.runInInjectionContext(() => accessGuard(route, state));
      const result = await firstValueFrom(result$ as any);

      expect(remoteConfig.isFlagEnabledSafe).toHaveBeenCalledWith('SOME_FLAG' as any);
      expect(result).toBeFalse();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/user/dashboard');
    }),
  );
});
