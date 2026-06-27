import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PublicResumeViewComponent } from './public-resume-view.component';
import { ResumeShareApiService } from '../../services/resume-share-api.service';

function setup(token: string, apiMock: Partial<ResumeShareApiService>) {
  TestBed.configureTestingModule({
    imports: [PublicResumeViewComponent],
    providers: [
      { provide: ResumeShareApiService, useValue: apiMock },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ token }) } },
      },
    ],
  });
  const fixture = TestBed.createComponent(PublicResumeViewComponent);
  fixture.detectChanges();
  return fixture;
}

describe('PublicResumeViewComponent', () => {
  it('renders the resume and builds sections on success', () => {
    const dto = {
      id: 1,
      title: 'Jane Dev',
      tags: 'java,spring',
      resumeJson: JSON.stringify({ summary: 'Engineer', skills: ['Java', 'Spring'] }),
    };
    const fixture = setup('tok', { getPublicResume: () => of(dto) as any });
    const cmp = fixture.componentInstance;
    expect(cmp.state()).toBe('ready');
    expect(cmp.resume()?.title).toBe('Jane Dev');
    const labels = cmp.sections().map((s) => s.label);
    expect(labels).toContain('summary');
    expect(labels).toContain('skills');
    const skills = cmp.sections().find((s) => s.label === 'skills');
    expect(skills?.items).toEqual(['Java', 'Spring']);
  });

  it('shows notFound on 404', () => {
    const fixture = setup('tok', { getPublicResume: () => throwError(() => ({ status: 404 })) as any });
    expect(fixture.componentInstance.state()).toBe('notFound');
  });

  it('shows revoked on 410', () => {
    const fixture = setup('tok', { getPublicResume: () => throwError(() => ({ status: 410 })) as any });
    expect(fixture.componentInstance.state()).toBe('revoked');
  });

  it('shows generic error on 500', () => {
    const fixture = setup('tok', { getPublicResume: () => throwError(() => ({ status: 500 })) as any });
    expect(fixture.componentInstance.state()).toBe('error');
  });

  it('shows notFound when token is blank', () => {
    const spy = jasmine.createSpy('getPublicResume');
    const fixture = setup('', { getPublicResume: spy as any });
    expect(fixture.componentInstance.state()).toBe('notFound');
    expect(spy).not.toHaveBeenCalled();
  });
});
