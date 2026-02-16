import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

import { SubscriptionApiService } from './subscription-api.service';

describe('SubscriptionApiService', () => {
  it('uses JHipster criteria params for active plans', (done) => {
    const http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    http.get.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        SubscriptionApiService,
        { provide: HttpClient, useValue: http },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    const api = TestBed.inject(SubscriptionApiService);

    api.getActivePlans('INDIVIDUAL').subscribe({
      next: () => {
        expect(http.get).toHaveBeenCalled();

        const [url, options] = http.get.calls.mostRecent().args as any[];
        expect(url).toBe('/api/subscription-plans');

        const params = (options?.params ?? new HttpParams()) as HttpParams;
        expect(params.toString()).toBe('isActive.equals=true&scope.equals=INDIVIDUAL');

        // Ensure we do NOT send the legacy/incorrect param name.
        expect(params.has('active')).toBeFalse();
        expect(params.has('active.equals')).toBeFalse();
        done();
      },
      error: done.fail,
    });
  });
});
