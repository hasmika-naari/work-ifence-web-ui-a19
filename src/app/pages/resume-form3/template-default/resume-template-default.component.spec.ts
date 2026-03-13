import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumeTemplateDefaultComponent } from './resume-template-default.component';
import { UserStoreService } from '../../../services/store/user-store.service';
import { Resume, RenderConfig } from '../../../services/resume.model';
import { signal } from '@angular/core';

describe('ResumeTemplateDefaultComponent', () => {
  let component: ResumeTemplateDefaultComponent;
  let fixture: ComponentFixture<ResumeTemplateDefaultComponent>;
  let mockUserStore: jasmine.SpyObj<UserStoreService>;
  let resumeFormSignal: any;

  beforeEach(async () => {
    resumeFormSignal = signal<Resume>(new Resume());
    mockUserStore = jasmine.createSpyObj('UserStoreService', ['getResumeForm']);
    mockUserStore.getResumeForm.and.returnValue(resumeFormSignal);

    await TestBed.configureTestingModule({
      imports: [ResumeTemplateDefaultComponent],
      providers: [
        { provide: UserStoreService, useValue: mockUserStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeTemplateDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct full name in the header', () => {
    const resume = new Resume();
    resume.sections = [
      {
        section: 'CONTACT',
        title: 'Contact',
        isAdded: true,
        data: { fname: 'John', lname: 'Doe' }
      }
    ];
    resumeFormSignal.set(resume);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nameHeader = compiled.querySelector('.profile-full-name');
    expect(nameHeader?.textContent).toContain('John Doe');
  });

  it('should filter out the CONTACT section from activeSections for the main body', () => {
    const resume = new Resume();
    resume.sections = [
      { section: 'CONTACT', title: 'Header info', isAdded: true, data: {} },
      { section: 'WORK_EXPERIENCE', title: 'Work', isAdded: true, data: {}, items: [] },
      { section: 'EDUCATION', title: 'Edu', isAdded: true, data: {}, items: [] }
    ];
    resumeFormSignal.set(resume);
    fixture.detectChanges();

    const sections = component.activeSections();
    expect(sections.length).toBe(2);
    expect(sections.some(s => s.section === 'CONTACT')).toBeFalse();
  });

  it('should apply dynamic styles based on RenderConfig', () => {
    const resume = new Resume();
    resume.renderConfig = new RenderConfig();
    resume.renderConfig.accentColor = '#ff5722';
    resume.renderConfig.fontFamily = 'Poppins';
    resumeFormSignal.set(resume);
    fixture.detectChanges();

    const styles = component.getDynamicStyles() as any;
    expect(styles['--resume-accent-color']).toBe('#ff5722');
    expect(styles['font-family']).toBe('Poppins');
  });

  it('should emit editSection when a title is clicked and isPreview is false', () => {
    spyOn(component.editSection, 'emit');
    component.isPreview = false;
    
    const sectionData = { some: 'data' };
    component.onEdit('WORK_EXPERIENCE', sectionData);
    
    expect(component.editSection.emit).toHaveBeenCalledWith({
      section: 'WORK_EXPERIENCE',
      data: sectionData
    });
  });

  it('should NOT emit editSection when isPreview is true', () => {
    spyOn(component.editSection, 'emit');
    component.isPreview = true;
    
    component.onEdit('WORK_EXPERIENCE', {});
    expect(component.editSection.emit).not.toHaveBeenCalled();
  });
});
