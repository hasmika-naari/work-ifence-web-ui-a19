import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResumeVisibilityShareComponent } from './resume-visibility-share.component';
import { ResumeShareApiService } from '../services/resume-share-api.service';
import { EntitlementService } from 'src/app/services/entitlement.service';

function setup(opts: { canShare: boolean; api?: Partial<ResumeShareApiService> }) {
  const api: Partial<ResumeShareApiService> = {
    getResume: () => of({ id: 5, visibility: 'PRIVATE' }) as any,
    setVisibility: () => of({}) as any,
    createShareLink: () => of({ token: 't1', url: '/r/t1' }) as any,
    revokeShareLink: () => of(undefined) as any,
    ...(opts.api ?? {}),
  };
  TestBed.configureTestingModule({
    imports: [ResumeVisibilityShareComponent],
    providers: [
      { provide: ResumeShareApiService, useValue: api },
      { provide: EntitlementService, useValue: { canAccess: () => opts.canShare } },
      { provide: MatSnackBar, useValue: { open: () => {} } },
    ],
  });
  const fixture = TestBed.createComponent(ResumeVisibilityShareComponent);
  fixture.componentInstance.resumeId = 5;
  fixture.detectChanges();
  return fixture;
}

describe('ResumeVisibilityShareComponent', () => {
  it('loads current visibility on init', () => {
    const fixture = setup({ canShare: true });
    expect(fixture.componentInstance.visibility()).toBe('PRIVATE');
  });

  it('persists a visibility change', () => {
    const setVisibility = jasmine.createSpy('setVisibility').and.returnValue(of({}));
    const fixture = setup({ canShare: true, api: { setVisibility: setVisibility as any } });
    fixture.componentInstance.onVisibilityChange('PUBLIC');
    expect(setVisibility).toHaveBeenCalledWith(5, 'PUBLIC');
    expect(fixture.componentInstance.visibility()).toBe('PUBLIC');
  });

  it('rolls back visibility on failure (fail closed)', () => {
    const fixture = setup({
      canShare: true,
      api: { setVisibility: (() => throwError(() => ({ status: 500 }))) as any },
    });
    fixture.componentInstance.onVisibilityChange('PUBLIC');
    expect(fixture.componentInstance.visibility()).toBe('PRIVATE');
  });

  it('creates then revokes a share link', () => {
    const fixture = setup({ canShare: true });
    const cmp = fixture.componentInstance;
    cmp.createLink();
    expect(cmp.shareLink()?.url).toBe('/r/t1');
    cmp.revoke();
    expect(cmp.shareLink()).toBeNull();
  });

  it('hides sharing when not entitled (defense-in-depth)', () => {
    const fixture = setup({ canShare: false });
    expect(fixture.componentInstance.canShare()).toBeFalse();
    const locked = fixture.nativeElement.querySelector('[data-testid="share-locked"]');
    expect(locked).toBeTruthy();
  });
});
