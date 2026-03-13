import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume, RenderConfig } from '../../../services/resume.model';
import { UserStoreService } from '../../../services/store/user-store.service';
import { SectionDesc } from '../../../services/store/user-store';

@Component({
  selector: 'app-resume-template-default',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-template-default.component.html',
  styleUrls: ['./resume-template-default.component.scss']
})
export class ResumeTemplateDefaultComponent {
  private userStore = inject(UserStoreService);

  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  
  @Output() editSection = new EventEmitter<any>();

  // Use signal from store if available, or allow manual input
  resumeForm = this.userStore.getResumeForm();

  // Helper to get active sections excluding CONTACT which is usually fixed at top
  activeSections = computed(() => {
    const resume = this.resumeForm();
    if (!resume || !resume.sections) return [];
    return resume.sections.filter(s => s.isAdded && s.section !== 'CONTACT');
  });

  // Access the contact section directly
  contactSection = computed(() => {
    const resume = this.resumeForm();
    return resume.sections?.find(s => s.section === 'CONTACT');
  });

  get config(): RenderConfig {
    return this.resumeForm()?.renderConfig || new RenderConfig();
  }

  getDynamicStyles() {
    const config = this.config;
    return {
      'font-family': config.fontFamily || 'Roboto, sans-serif',
      '--resume-accent-color': config.accentColor || '#000000',
      '--resume-section-gap': this.getSpacing(config.spacingMode)
    };
  }

  private getSpacing(mode: string): string {
    switch (mode) {
      case 'compact': return '8px';
      case 'loose': return '24px';
      default: return '16px';
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const presentLabels = ['present', 'current', 'now'];
    if (presentLabels.includes(date.trim().toLowerCase())) return 'Present';
    return date;
  }

  onEdit(section: string, data?: any) {
    if (this.isPreview) return;
    this.editSection.emit({ section, data });
  }
}
