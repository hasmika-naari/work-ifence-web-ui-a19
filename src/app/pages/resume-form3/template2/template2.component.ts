import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal, ViewEncapsulation, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Certification, Education, Experience, ProfileSummary, Project, Resume, ResumeContact } from 'src/app/services/resume.model';
import { SectionDesc, SectionItem } from 'src/app/services/store/user-store';
import { Template2HeaderComponent } from './sections/template2-header.component';
import { Template2SectionShellComponent } from './sections/template2-section-shell.component';
import { TEMPLATE2_ACTION_ICONS, TEMPLATE2_SECTION_ICON_CLASSES } from './template2-icons';


@Component({
  selector: 'app-resume-template2',
  standalone: true,
  imports: [CommonModule, Template2HeaderComponent, Template2SectionShellComponent],
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResumeTemplate2Component {
  private userStore: UserStoreService = inject(UserStoreService);
  resumeForm: Signal<Resume> = this.userStore.getResumeForm();
  @Input() resumeSections: SectionDesc[] | null = null;
  @Input() isPreview: boolean = false;
  @Input() isPrintMode: boolean = false;
  @Output() editSection = new EventEmitter<any>();
  readonly actionIcons = TEMPLATE2_ACTION_ICONS;

  private readonly sectionAliases: Record<string, string[]> = {
    CERTIFICATIONS: ['CERTIFICATIONS', 'CERTIFICATION'],
    CERTIFICATION: ['CERTIFICATIONS', 'CERTIFICATION'],
    SKILLS_BY_CATEGORY: ['SKILLS_BY_CATEGORY', 'SKILLS_CATEGORY'],
    SKILLS_CATEGORY: ['SKILLS_BY_CATEGORY', 'SKILLS_CATEGORY'],
  };

  constructor(public dialog: MatDialog) {}

  get sections(): SectionDesc[] {
    return this.resumeSections?.length ? this.resumeSections : this.resumeForm().sections || [];
  }

  get profileImageSrc(): string | null {
    return this.resumeForm().imageBase64Encoded || null;
  }

  get contact(): ResumeContact {
    return (this.getSectionData('CONTACT') as ResumeContact)
      || (this.getFirstItemData('CONTACT') as ResumeContact)
      || new ResumeContact();
  }

  get initials(): string {
    const first = this.contact?.fname?.trim()?.charAt(0) || '';
    const last = this.contact?.lname?.trim()?.charAt(0) || '';
    return `${first}${last}`.trim().toUpperCase() || 'WF';
  }

  getSection(sectionName: string): SectionDesc | undefined {
    const candidates = this.sectionAliases[sectionName] || [sectionName];
    return this.sections.find(section => candidates.includes(section.section));
  }

  getSectionItems(sectionName: string): SectionItem[] {
    return this.getSection(sectionName)?.items ?? [];
  }

  getSectionData(sectionName: string): any {
    return this.getSection(sectionName)?.data;
  }

  getRenderedItems(sectionName: string): SectionItem[] {
    const items = this.getSectionItems(sectionName);
    return this.isPreview ? items.filter(item => !this.itemData(item)?.isHideSelected) : items;
  }

  getFirstItemData(sectionName: string): any {
    return this.itemData(this.getSectionItems(sectionName)[0]);
  }

  getSectionTitle(sectionName: string, fallback: string): string {
    const section = this.getSection(sectionName);
    return section?.editable_section_title || section?.title || fallback;
  }

  getSectionIconClass(sectionName: string): string {
    return TEMPLATE2_SECTION_ICON_CLASSES[sectionName as keyof typeof TEMPLATE2_SECTION_ICON_CLASSES]
      || TEMPLATE2_SECTION_ICON_CLASSES.DEFAULT;
  }

  shouldShowSection(sectionName: string): boolean {
    return this.getRenderedItems(sectionName).length > 0;
  }

  hasSummary(sectionName: string): boolean {
    const section = this.getSummarySection(sectionName);
    if (!section) {
      return false;
    }

    if (sectionName === 'PROFILE_SUMMARY_BULLETED') {
      return this.getSummaryBullets().length > 0;
    }

    return !!(section.original_summary_html || section.profile_summary);
  }

  getSummaryHtml(sectionName: string = 'PROFILE_SUMMARY'): string {
    const section = this.getSummarySection(sectionName);
    if (!section) {
      return '';
    }

    if (section.original_summary_html) {
      return section.original_summary_html;
    }

    return section.profile_summary || '';
  }

  getSummaryBullets(): string[] {
    const section = this.getSummarySection('PROFILE_SUMMARY_BULLETED');
    return Array.isArray(section?.summary_bullets)
      ? section.summary_bullets.filter((bullet: string) => !!bullet?.trim())
      : [];
  }

  getSkillsCategoryRows(): any[] {
    return this.getRenderedItems('SKILLS_BY_CATEGORY').map(item => {
      const data = this.itemData(item);
      return {
        raw: item,
        data,
        title: data?.name || data?.sub_title || data?.category || 'Category',
        skills: Array.isArray(data?.skills) ? data.skills : []
      };
    });
  }

  getListValues(sectionName: string, fieldName?: string): string[] {
    return this.getRenderedItems(sectionName)
      .map(item => {
        const data = this.itemData(item);
        if (typeof data === 'string') {
          return data;
        }
        if (fieldName && data?.[fieldName]) {
          return data[fieldName];
        }
        return data?.point || data?.skill || data?.achievement || data?.title || data?.name || '';
      })
      .filter((value: string) => !!value?.trim());
  }

  getCourseworkRows(): string[] {
    return this.getRenderedItems('RELEVANT_COURSEWORK')
      .map(item => {
        const data = this.itemData(item);
        return [data?.courseworkname, data?.institution].filter(Boolean).join(' | ');
      })
      .filter(Boolean);
  }

  getCertificationRows(): any[] {
    return this.getRenderedItems('CERTIFICATIONS').map(item => ({ raw: item, data: this.itemData(item) }));
  }

  getAchievementRows(): any[] {
    return this.getRenderedItems('ACHIEVEMENT_WITH_DESC').map(item => ({ raw: item, data: this.itemData(item) }));
  }

  getProjectRows(): any[] {
    return this.getRenderedItems('PROJECT').map(item => ({ raw: item, data: this.itemData(item) }));
  }

  getEducationRows(): any[] {
    return this.getRenderedItems('EDUCATION').map(item => ({ raw: item, data: this.itemData(item) }));
  }

  getExperienceRows(): any[] {
    return this.getRenderedItems('WORK_EXPERIENCE').map(item => ({ raw: item, data: this.itemData(item) }));
  }

  itemData(item: any): any {
    return item?.data ?? item;
  }

  itemId(item: any): string {
    const data = this.itemData(item);
    return data?.id || item?.id || '';
  }

  formatDateRange(startDate?: string, endDate?: string, isCurrent?: boolean): string {
    const start = startDate?.trim();
    const end = isCurrent ? 'Present' : endDate?.trim();
    return [start, end].filter(Boolean).join(' - ');
  }

  openSectionEditor(section: string, selectedItem?: any): void {
    switch (section) {
      case 'CONTACT':
        this.userStore.setSelectedContact(this.contact);
        break;
      case 'PROFILE_SUMMARY':
      case 'PROFILE_SUMMARY_BULLETED':
        this.userStore.setSelectedSummary(this.getSummarySection(section));
        break;
      case 'EDUCATION':
        this.userStore.updateEducation((selectedItem as Education) || new Education());
        break;
      case 'PROJECT':
        this.userStore.updateProject((selectedItem as Project) || new Project());
        break;
      case 'WORK_EXPERIENCE':
        this.userStore.updateExperience((selectedItem as Experience) || new Experience());
        break;
      case 'CERTIFICATIONS':
        this.userStore.updateCertification((selectedItem as SectionItem) || ({ id: undefined, data: new Certification() } as SectionItem));
        break;
      case 'SKILLS_BY_CATEGORY':
        this.userStore.setSelectedSkillsCategory(selectedItem || this.getSectionItems('SKILLS_BY_CATEGORY')[0] || null);
        break;
      default:
        break;
    }

    this.editSection.emit({ section: this.resolveEmitSection(section) });
  }

  addSectionHandler(section: string): void {
    const normalizedSection = this.resolveEmitSection(section);
    switch (normalizedSection) {
      case 'EDUCATION':
        this.userStore.updateEducation(new Education());
        break;
      case 'PROJECT':
        this.userStore.updateProject(new Project());
        break;
      case 'WORK_EXPERIENCE':
        this.userStore.updateExperienceAddMode();
        break;
      case 'CERTIFICATIONS':
        this.userStore.updateCertification({ id: undefined, data: new Certification() } as SectionItem);
        break;
      default:
        break;
    }

    this.editSection.emit({ section: normalizedSection });
  }

  removeSection(sectionName: string): void {
    const actualSection = this.getSection(sectionName)?.section;
    if (actualSection) {
      this.userStore.removeSection(actualSection);
    }
  }

  confirmDeleteDialog(section: string, selectedJson: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {name: 'confirm'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === "CONFIRM"){
        if(section === "SUMMARY"){
          this.userStore.deleteSummary();
        }
        else if(section === "COURSEWORK"){
          this.userStore.deleteCourseWork()
        }
        else if(section === "SKILLS"){
          this.userStore.deleteSkill();
        }
        else if(section === "EDUCATION"){
          this.userStore.deleteEducation(selectedJson)
        }
        else if(section === "PROJECT"){
          this.userStore.deleteProject(selectedJson)
        }
        else if(section === "EXPERIENCE"){
          this.userStore.deleteExperience(selectedJson)
        }
        else if(section === "CERTIFICATION"){
          this.userStore.deleteCertification(selectedJson)
        }
      }
    });
  }

  toggleItemVisibility(sectionName: string, item: SectionItem, hidden: boolean): void {
    this.updateSectionItems(sectionName, items =>
      items.map(currentItem => {
        if (this.itemId(currentItem) !== this.itemId(item)) {
          return currentItem;
        }

        const data = this.itemData(currentItem);
        return {
          ...currentItem,
          data: {
            ...data,
            isHideSelected: hidden,
          },
        };
      })
    );
  }

  moveObjectById(sectionName: string, itemId: string, direction: 'up' | 'down'): void {
    this.updateSectionItems(sectionName, items => {
      const nextItems = [...items];
      const index = nextItems.findIndex(item => this.itemId(item) === itemId);

      if (index === -1) {
        return items;
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= nextItems.length) {
        return items;
      }

      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return nextItems;
    });
  }

  checkEducationCondition(): boolean {
    return this.getRenderedItems('EDUCATION').length > 0;
  }

  checkProjectCondition(): boolean {
    return this.getRenderedItems('PROJECT').length > 0;
  }

  checkExperienceCondition(): boolean {
    return this.getRenderedItems('WORK_EXPERIENCE').length > 0;
  }

  checkCertificationCondition(): boolean {
    return this.getRenderedItems('CERTIFICATIONS').length > 0;
  }

  private getSummarySection(sectionName: string): ProfileSummary | null {
    const section = this.getSection(sectionName);
    if (!section) {
      return null;
    }

    if (section.data) {
      return section.data as ProfileSummary;
    }

    return (this.itemData(section.items?.[0]) as ProfileSummary) || null;
  }

  private resolveEmitSection(sectionName: string): string {
    if (sectionName === 'CERTIFICATION') {
      return 'CERTIFICATIONS';
    }
    if (sectionName === 'SKILLS_CATEGORY') {
      return 'SKILLS_BY_CATEGORY';
    }
    return sectionName;
  }

  private updateSectionItems(sectionName: string, updater: (items: SectionItem[]) => SectionItem[]): void {
    const candidates = this.sectionAliases[sectionName] || [sectionName];
    const resume = this.resumeForm();
    const updatedSections = (resume.sections || []).map(section => {
      if (!candidates.includes(section.section)) {
        return section;
      }

      return {
        ...section,
        items: updater(section.items ?? []),
      };
    });

    this.userStore.updateResumeForm({
      ...resume,
      sections: updatedSections,
    } as Resume);
  }
}
