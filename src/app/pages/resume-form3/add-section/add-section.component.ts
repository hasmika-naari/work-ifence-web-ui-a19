import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, inject, Input, HostListener } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FooterComponent } from '../../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../../landing/header-wifence/header-wifence.component';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MatCardModule } from '@angular/material/card';
// import { SectionDesc, sections } from 'src/app/services/store/user-store';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Resume } from 'src/app/services/resume.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeHtmlCachePipe } from './safe-html-cache.pipe';

export interface SectionDesc {
    section: string;
    description: string;
    isAdded: boolean;
    isPremium: boolean;
    tags: string;
    label: string;
}

export const sections: Array<SectionDesc> = [
    {
        section: 'PROFILE_SUMMARY',
        description: 'A brief summary of your skills and experience.',
        isAdded: false,
        isPremium: false,
        tags: 'summary, profile, objective',
        label: 'Summary'
    },
    {
        section: 'EDUCATION',
        description: 'Details about your educational background.',
        isAdded: false,
        isPremium: false,
        tags: 'education, school, degree',
        label: 'Education'
    },
    {
        section: 'RELEVANT_COURSEWORK',
        description: 'Relevant coursework you have completed.',
        isAdded: false,
        isPremium: false,
        tags: 'coursework, classes, subjects',
        label: 'Coursework'
    },
    {
        section: 'SKILLS_BULLET_POINTS',
        description: 'A list of your skills in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, abilities, competencies',
        label: 'Skills (B.P.)'
    },
    {
        section: 'SKILLS_CATEGORY',
        description: 'Categorized list of your skills.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, categorized, grouped',
        label: 'Skills (Category)'
    },
    {
        section: 'WORK_EXPERIENCE',
        description: 'Your professional work experience.',
        isAdded: false,
        isPremium: false,
        tags: 'experience, work, job',
        label: 'Experience'
    },
    {
        section: 'PROJECT',
        description: 'Projects you have worked on.',
        isAdded: false,
        isPremium: false,
        tags: 'projects, portfolio, work',
        label: 'Projects'
    },
    {
        section: 'CERTIFICATIONS',
        description: 'Certifications you have earned.',
        isAdded: false,
        isPremium: false,
        tags: 'certifications, licenses, credentials',
        label: 'Certifications'
    },
    {
        section: 'CERTIFICATIONS_BULLET_POINTS',
        description: 'A list of your certifications in bullet points.',
        isAdded: false,
        isPremium: true,
        tags: 'certifications, bullet points, list',
        label: 'Certs (B.P.)'
    },
    {
        section: 'ACHIEVEMENTS_BULLET_POINTS',
        description: 'Your achievements in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'achievements, accomplishments, awards',
        label: 'Achievements'
    },
    {
        section: 'ACHIEVEMENT_WITH_DESC',
        description: 'Detailed description of your achievements.',
        isAdded: false,
        isPremium: true,
        tags: 'achievements, description, details',
        label: 'Accomplishments'
    }
];


@Component({
  selector: 'app-add-section',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, ButtonModule, MatButtonModule, MatIconModule, SafeHtmlCachePipe],
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class AddSectionComponent implements OnInit, OnDestroy {
  sections: SectionDesc[] = [];
    // @Input() isVisible: boolean = false;
    // @Output() closePanel = new EventEmitter<void>();
  @Output() sectionAdded = new EventEmitter<void>();
  // Emit selected section to parent so parent handles store updates
  @Output() sectionSelected = new EventEmitter<SectionDesc>();

    isUserNameCheckInProgress = false;
    isToggled = false;
    selectedTemplateName : String = ""
    // private themeToggleSubscription: Subscription;

    public themeService: ThemeCustomizerService = inject(ThemeCustomizerService);
    
    // Remove Signal dependencies for now to prevent hanging
    // resumeForm!: Signal<Resume>;
    // currentSections! : Signal<SectionDesc[]>
    // multipleSections! : Signal<SectionDesc[][]>

    // add_sections : Array<SectionDesc> = [];

    constructor(private router: Router, public userStore : UserStoreService, private sanitizer: DomSanitizer) {
      console.log('[AddSectionComponent] constructor called');
      this.selectedTemplateName = "";
      this.sections = [...sections];
    }
    ngOnDestroy(): void {
      // if (this.themeToggleSubscription) {
      //   this.themeToggleSubscription.unsubscribe();
      // }
    }
 
    ngOnInit(): void {
      // No complex logic needed - just ensure we have sections
      // if (!this.add_sections || this.add_sections.length === 0) {
      //   this.add_sections = sections?.slice(0, 2);
      // }
    }

  addSection(section: SectionDesc) {
    try {
      console.log('[AddSectionComponent] addSection called for:', section?.section);
      if (!section) {
        console.error('[AddSectionComponent] Invalid section provided');
        return;
      }

      // Emit selected section to parent. Parent should update the store.
      this.sectionSelected.emit(section);
      // Also emit a generic sectionAdded event for backward compatibility
      this.sectionAdded.emit();
    } catch (error) {
      console.error('[AddSectionComponent] Error in addSection:', error);
      this.sectionAdded.emit();
    }
  }

  // Moved from template to component to be passed to the pipe
  public getSectionSvgIllustration = (sectionType: string): SafeHtml => {
    try {
      // Simple, safe SVG illustrations without complex gradients
      const illustrationMap: { [key: string]: string } = {
        'PROFILE_SUMMARY': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#007bff" opacity="0.1"/><circle cx="100" cy="40" r="15" fill="#007bff"/><path d="M100 65c-15 0-25 8-25 18v10h50v-10c0-10-10-18-25-18z" fill="#007bff"/></svg>`,
        'EDUCATION': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#28a745" opacity="0.1"/><path d="M100 20L30 40l20 10v25L100 95l50-20v-25l20-10L100 20z" fill="#28a745"/></svg>`,
        'RELEVANT_COURSEWORK': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#17a2b8" opacity="0.1"/><rect x="40" y="25" width="120" height="70" rx="5" fill="white" stroke="#17a2b8" stroke-width="2"/><line x1="55" y1="40" x2="145" y2="40" stroke="#17a2b8" stroke-width="2"/><line x1="55" y1="55" x2="145" y2="55" stroke="#17a2b8" stroke-width="2"/></svg>`,
        'SKILLS_BULLET_POINTS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#ffc107" opacity="0.1"/><circle cx="100" cy="60" r="25" stroke="#ffc107" stroke-width="3" fill="none"/><path d="M90 60l5 5 10-10" stroke="#ffc107" stroke-width="3" fill="none"/></svg>`,
        'SKILLS_CATEGORY': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#fd7e14" opacity="0.1"/><rect x="50" y="30" width="35" height="35" rx="5" fill="#fd7e14"/><rect x="115" y="30" width="35" height="35" rx="5" fill="#fd7e14"/><rect x="50" y="75" width="35" height="35" rx="5" fill="#fd7e14"/><rect x="115" y="75" width="35" height="35" rx="5" fill="#fd7e14"/></svg>`,
        'WORK_EXPERIENCE': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#6f42c1" opacity="0.1"/><rect x="60" y="45" width="80" height="50" rx="5" stroke="#6f42c1" stroke-width="3" fill="white"/><path d="M80 45V35a5 5 0 015-5h30a5 5 0 015 5v10" stroke="#6f42c1" stroke-width="3" fill="none"/></svg>`,
        'PROJECT': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#20c997" opacity="0.1"/><rect x="50" y="25" width="100" height="60" rx="5" stroke="#20c997" stroke-width="3" fill="white"/><circle cx="70" cy="45" r="3" fill="#20c997"/><circle cx="100" cy="45" r="3" fill="#20c997"/><circle cx="130" cy="45" r="3" fill="#20c997"/></svg>`,
        'CERTIFICATIONS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#dc3545" opacity="0.1"/><circle cx="100" cy="60" r="30" fill="#dc3545"/><path d="M85 60l7 7 15-15" stroke="white" stroke-width="4" fill="none"/></svg>`,
        'CERTIFICATIONS_BULLET_POINTS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e83e8c" opacity="0.1"/><rect x="40" y="30" width="80" height="60" rx="5" stroke="#e83e8c" stroke-width="3" fill="white"/><path d="M55 45l5 5 12-12" stroke="#e83e8c" stroke-width="2" fill="none"/></svg>`,
        'ACHIEVEMENTS_BULLET_POINTS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#ffc107" opacity="0.1"/><path d="M100 20l8 20h22l-18 15 7 21-19-14-19 14 7-21-18-15h22l8-20z" fill="#ffc107"/></svg>`,
        'ACHIEVEMENT_WITH_DESC': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#17a2b8" opacity="0.1"/><path d="M100 15l6 18h19l-15 12 6 18-16-11-16 11 6-18-15-12h19l6-18z" fill="#17a2b8"/><rect x="50" y="85" width="100" height="15" rx="3" fill="#17a2b8"/></svg>`
      };

      const svgContent = illustrationMap[sectionType] || illustrationMap['PROFILE_SUMMARY'];
      return this.sanitizer.bypassSecurityTrustHtml(svgContent);
    } catch (error) {
      console.error('Error creating SVG illustration:', error);
      // Return a simple fallback SVG
      const fallbackSvg = `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#007bff" opacity="0.1"/><circle cx="100" cy="60" r="20" fill="#007bff"/></svg>`;
      return this.sanitizer.bypassSecurityTrustHtml(fallbackSvg);
    }
  }

  onOverlayKeydown(event: KeyboardEvent, section: SectionDesc) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.addSection(section);
    }
  }

  // @HostListener('document:keydown.escape', ['$event'])
  // onEscapePress(event: KeyboardEvent) {
  //   if (this.isVisible) {
  //     this.close();
  //   }
  // }

  trackBySection(index: number, item: SectionDesc): string {
    return item.section;
  }

  getSectionIcon(sectionType: string): string {
    const iconMap: { [key: string]: string } = {
      'PROFILE_SUMMARY': 'pi-user',
      'EDUCATION': 'pi-graduation-cap',
      'RELEVANT_COURSEWORK': 'pi-book',
      'SKILLS_BULLET_POINTS': 'pi-check-circle',
      'SKILLS_CATEGORY': 'pi-th-large',
      'WORK_EXPERIENCE': 'pi-briefcase',
      'PROJECT': 'pi-desktop',
      'CERTIFICATIONS': 'pi-shield',
      'CERTIFICATIONS_BULLET_POINTS': 'pi-list',
      'ACHIEVEMENTS_BULLET_POINTS': 'pi-star',
      'ACHIEVEMENT_WITH_DESC': 'pi-trophy'
    };

    return iconMap[sectionType] || 'pi-user';
  }

  getSectionColor(sectionType: string): string {
    const colorMap: { [key: string]: string } = {
      'PROFILE_SUMMARY': '#007bff',
      'EDUCATION': '#28a745',
      'RELEVANT_COURSEWORK': '#17a2b8',
      'SKILLS_BULLET_POINTS': '#ffc107',
      'SKILLS_CATEGORY': '#fd7e14',
      'WORK_EXPERIENCE': '#6f42c1',
      'PROJECT': '#20c997',
      'CERTIFICATIONS': '#dc3545',
      'CERTIFICATIONS_BULLET_POINTS': '#e83e8c',
      'ACHIEVEMENTS_BULLET_POINTS': '#ffc107',
      'ACHIEVEMENT_WITH_DESC': '#17a2b8'
    };

    return colorMap[sectionType] || '#007bff';
  }

  getSectionSvgIllustration_depricated(sectionType: string): SafeHtml {
    try {
      // Simple, safe SVG illustrations without complex gradients
      const illustrationMap: { [key: string]: string } = {
        'PROFILE_SUMMARY': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#007bff" opacity="0.1"/><circle cx="100" cy="40" r="15" fill="#007bff"/><path d="M100 65c-15 0-25 8-25 18v10h50v-10c0-10-10-18-25-18z" fill="#007bff"/></svg>`,
        'EDUCATION': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#28a745" opacity="0.1"/><path d="M100 20L30 40l20 10v25L100 95l50-20v-25l20-10L100 20z" fill="#28a745"/></svg>`,
        'RELEVANT_COURSEWORK': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#17a2b8" opacity="0.1"/><rect x="40" y="25" width="120" height="70" rx="5" fill="white" stroke="#17a2b8" stroke-width="2"/><line x1="55" y1="40" x2="145" y2="40" stroke="#17a2b8" stroke-width="2"/><line x1="55" y1="55" x2="145" y2="55" stroke="#17a2b8" stroke-width="2"/></svg>`,
        'SKILLS_BULLET_POINTS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#ffc107" opacity="0.1"/><circle cx="100" cy="60" r="25" stroke="#ffc107" stroke-width="3" fill="none"/><path d="M90 60l5 5 10-10" stroke="#ffc107" stroke-width="3" fill="none"/></svg>`,
        'SKILLS_CATEGORY': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#fd7e14" opacity="0.1"/><rect x="50" y="30" width="35" height="35" rx="5" fill="#fd7e14"/><rect x="115" y="30" width="35" height="35" rx="5" fill="#fd7e14"/><rect x="50" y="75" width="35" height="35" rx="5" fill="#fd7e14"/><rect x="115" y="75" width="35" height="35" rx="5" fill="#fd7e14"/></svg>`,
        'WORK_EXPERIENCE': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#6f42c1" opacity="0.1"/><rect x="60" y="45" width="80" height="50" rx="5" stroke="#6f42c1" stroke-width="3" fill="white"/><path d="M80 45V35a5 5 0 015-5h30a5 5 0 015 5v10" stroke="#6f42c1" stroke-width="3" fill="none"/></svg>`,
        'PROJECT': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#20c997" opacity="0.1"/><rect x="50" y="25" width="100" height="60" rx="5" stroke="#20c997" stroke-width="3" fill="white"/><circle cx="70" cy="45" r="3" fill="#20c997"/><circle cx="100" cy="45" r="3" fill="#20c997"/><circle cx="130" cy="45" r="3" fill="#20c997"/></svg>`,
        'CERTIFICATIONS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#dc3545" opacity="0.1"/><circle cx="100" cy="60" r="30" fill="#dc3545"/><path d="M85 60l7 7 15-15" stroke="white" stroke-width="4" fill="none"/></svg>`,
        'CERTIFICATIONS_BULLET_POINTS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#e83e8c" opacity="0.1"/><rect x="40" y="30" width="80" height="60" rx="5" stroke="#e83e8c" stroke-width="3" fill="white"/><path d="M55 45l5 5 12-12" stroke="#e83e8c" stroke-width="2" fill="none"/></svg>`,
        'ACHIEVEMENTS_BULLET_POINTS': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#ffc107" opacity="0.1"/><path d="M100 20l8 20h22l-18 15 7 21-19-14-19 14 7-21-18-15h22l8-20z" fill="#ffc107"/></svg>`,
        'ACHIEVEMENT_WITH_DESC': `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#17a2b8" opacity="0.1"/><path d="M100 15l6 18h19l-15 12 6 18-16-11-16 11 6-18-15-12h19l6-18z" fill="#17a2b8"/><rect x="50" y="85" width="100" height="15" rx="3" fill="#17a2b8"/></svg>`
      };

      const svgContent = illustrationMap[sectionType] || illustrationMap['PROFILE_SUMMARY'];
      return this.sanitizer.bypassSecurityTrustHtml(svgContent);
    } catch (error) {
      console.error('Error creating SVG illustration:', error);
      // Return a simple fallback SVG
      const fallbackSvg = `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" fill="#007bff" opacity="0.1"/><circle cx="100" cy="60" r="20" fill="#007bff"/></svg>`;
      return this.sanitizer.bypassSecurityTrustHtml(fallbackSvg);
    }
  }
}
