import { Injectable, inject } from '@angular/core';
import { Resume, Education, Project, Accomplishment, Skill, SkillV2, courseWork, Certification, Experience } from '../resume.model';
import { SectionDesc } from '../store/user-store';
import { TemplatesService } from './templates.service';

@Injectable({
  providedIn: 'root',
})
export class Templatesv2Service {
  private readonly legacyTemplatesService = inject(TemplatesService);

    private getSection(resume: Resume, sectionName: string): any {
      return resume.sections?.find((section: any) => section.section === sectionName);
    }

    private getSectionData<T>(resume: Resume, sectionName: string): T | undefined {
      const section = this.getSection(resume, sectionName);
      return section?.items?.[0]?.data ?? section?.data;
    }

    private getSectionList<T>(resume: Resume, sectionName: string): T[] {
      const section = this.getSection(resume, sectionName);
      if (!section) {
        return [];
      }

      if (Array.isArray(section.items) && section.items.length > 0) {
        return section.items
          .map((item: any) => item?.data ?? item)
          .filter((item: any) => item != null);
      }

      if (Array.isArray(section.data)) {
        return section.data.filter((item: any) => item != null);
      }

      return [];
    }

    private getDisplayText(item: any, keys: string[]): string {
      if (typeof item === 'string') {
        return item.trim();
      }

      if (!item || typeof item !== 'object') {
        return '';
      }

      for (const key of keys) {
        const value = item[key];
        if (typeof value === 'string' && value.trim().length > 0) {
          return value.trim();
        }
      }

      return '';
    }

    public getFormatedResumeHTMLText(templateName: string, resume: Resume): string {
      if (templateName === 'TEMPLATE_1' || templateName === 'TEMPLATE_2') {
        return this.legacyTemplatesService.getFormatedResumeHTMLText(templateName, resume);
      }

      return this.getFormattedSectionsForModern(resume);
    }

    constructor() {}

    getFormattedSectionsForModern(resume: Resume) {
      let firstHalfSkills: any[] = [];
      let secondHalfSkills: any[] = [];

      const skillV2Section = resume.sections?.find(s => s.section === 'SKILLS_CATEGORY');
      const skillV2Items = skillV2Section?.items?.map(i => i.data) ?? [];
      if (skillV2Items.length > 0) {
        const mid = Math.ceil(skillV2Items.length / 2);
        firstHalfSkills = [...skillV2Items.slice(0, mid)];
        secondHalfSkills = [...skillV2Items.slice(mid)];
      }

      return resume.sections?.map((e: SectionDesc) => {
        const title = `<div class="section-title">${e.editable_section_title}</div>`;

        switch (e.section) {
          case 'PROFILE_SUMMARY': {
            const summary = this.getSectionData<any>(resume, 'PROFILE_SUMMARY')?.profile_summary ?? '';
            return summary.length > 0
              ? `
                <div class="section">
                  ${title}
                  <div class="project-content-container" style="margin:0;padding:0;">
                    <div class="project-content">
                      ${summary}
                    </div>
                  </div>
                </div>`
              : '';
          }

          case 'EDUCATION': {
            const items = this.getSectionList<Education>(resume, 'EDUCATION');
            return items.length > 0
              ? `
                <div class="section education">
                  ${title}
              ${this.getEducationSectionForModern(items)}
            </div>`
          : '';
      }

      case 'RELEVANT_COURSEWORK': {
        const items = this.getSectionList<courseWork>(resume, 'RELEVANT_COURSEWORK');
        return items.length > 0
          ? `
            <div class="section">
              ${title}
              <div class="course-work-section-content project-content" style="margin-top:7px;">
                <ul class="skills-list-li" style="padding:0px !important;">
                  ${this.getCourseWorkWithBulletPointsSectionForModern(items)}
                </ul>
              </div>
            </div>`
          : '';
      }

      case 'SKILLS_BULLET_POINTS': {
        const items = this.getSectionList<any>(resume, 'SKILLS_BULLET_POINTS');
        return items.length > 0
          ? `
            <div class="section">
              ${title}
              <div class="course-work-section-content project-content" style="margin-top:7px;">
                <ul class="skills-list-li" style="padding:0px !important;">
                  ${this.getSkillsWithBulletPointsSectionForModern(items)}
                </ul>
              </div>
            </div>`
          : '';
      }

      case 'SKILLS_CATEGORY':
        return skillV2Items.length > 0
          ? `
            <div class="section skills">
              ${title}
              <div class="skills-content">
                <ul class="skill-category">
                  ${this.getSkillsCategorySectionForModern(firstHalfSkills)}
                </ul>
                <ul class="skill-category">
                  ${this.getSkillsCategorySectionForModern(secondHalfSkills)}
                </ul>
              </div>
            </div>`
          : '';

      case 'WORK_EXPERIENCE': {
        const items = this.getSectionList<Experience>(resume, 'WORK_EXPERIENCE');
        return items.length > 0
          ? `
            <div class="section experince trigger-area">
              ${title}
              ${this.getExperienceSectionForModern(items)}
            </div>`
          : '';
      }

      case 'PROJECT': {
        const items = this.getSectionList<Project>(resume, 'PROJECT');
        return items.length > 0
          ? `
            <div class="section experince trigger-area">
              ${title}
              ${this.getProjectSectionForModern(items)}
            </div>`
          : '';
      }

      case 'CERTIFICATIONS': {
        const items = this.getSectionList<Certification>(resume, 'CERTIFICATIONS');
        return items.length > 0
          ? `
            <div class="section experince trigger-area">
              ${title}
              ${this.getCertificationSectionForModern(items)}
            </div>`
          : '';
      }

      case 'ACHIEVEMENTS_BULLET_POINTS': {
        const achItem = this.getSectionData<any>(resume, 'ACHIEVEMENTS_BULLET_POINTS');
        return achItem?.ach?.length > 0
          ? `
            <div class="section experince trigger-area">
              ${title}
              <div class="project-content">
                ${achItem.ach}
              </div>
            </div>`
          : '';
      }

      case 'CERTIFICATIONS_BULLET_POINTS': {
        const certBPItem = this.getSectionData<any>(resume, 'CERTIFICATIONS_BULLET_POINTS');
        return certBPItem?.point?.length > 0
          ? `
            <div class="section experince trigger-area">
              ${title}
              <div class="project-content">
                ${certBPItem.point}
              </div>
            </div>`
          : '';
      }

      case 'ACHIEVEMENT_WITH_DESC': {
        const items = this.getSectionList<Accomplishment>(resume, 'ACHIEVEMENT_WITH_DESC');
        return items.length > 0
          ? `
            <div class="section education">
              ${title}
              ${this.getAccomplishmentsSectionForModern(items)}
            </div>`
          : '';
      }

      default:
        return '';
    }
  }).join('\n') || '';
}


    public getEducationSectionForModern(items : Array<Education>){
        return items.map((item : Education)=> 
        `
            <div class="education-p">
            ${item.degree.length > 0?
                `
                <p style="padding-left: 0;"><b>${item.degree}</b></p>
                ` : ''
            }
            ${item.degree.length > 0 && item.school_name.length > 0?
                `
                <p>|</p>
                ` : ''
            }
            ${item.school_name.length > 0?
                `
                <p><b>${item.school_name}</b></p>
                ` : ''
            }
            ${item.graduation_date.length > 0?
                `
                <p>|</p>
                ` : ''
            }
            ${item.graduation_date.length > 0?
                `
                <p><b>${item.graduation_date}</b></p>
                ` : ''
            }
            ${item.gpa.length > 0?
                `
                <p>|</p>
                ` : ''
            }
            ${item.gpa.length > 0?
                `
                <p><b>${item.gpa} GPA</b></p>
                ` : ''
            }
        </div>
        `).join('');
    }

    public getSkillsCategorySectionForModern(items : SkillV2[]){
        return items.map((item : SkillV2)=> 
        `
        <li><span>${item.sub_title}:</span> ${item.skills.join(', ')}</li>
        `).join('');
    }

    public getExperienceSectionForModern(items : Experience[]){
        return items.map((item : Experience)=> 
        `
        <div class="experience-container" style="margin-top:7px">
            <p style="font-size: 12px;margin: 0;"><b>${item.position_title} | ${item.company_name} | ${item.start_date} - ${item.end_date}</b></p>
            <div class="project-content-container" style="margin:0;padding:0;">
                <div class="project-content">
                    ${
                        item.description
                    }
                </div>
            </div>   
        </div>
        `).join('');
    }

    public getProjectSectionForModern(items : Project[]){
        return items.map((item : Project)=> 
        `
        <div class="experience-container" style="margin-top:7px">
            <p style="font-size: 12px;margin: 0;"><b>${item.project_name} | ${item.period}</b></p>
            <div class="project-content-container" style="margin:0;padding:0;">
                <div class="project-content">
                    ${
                        item.description
                    }
                </div>
            </div>   
        </div>
        `).join('');
    }

    public getAccomplishmentsSectionForModern(items : Accomplishment[]){
        return items.map((item : Accomplishment)=> 
        `
            <div class="experience-container" style="margin-top:7px">
                <div style="display: flex;justify-content: space-between;margin:0;padding:0;">
                    <p style="flex: 1;text-align: left;margin: 0;padding:0;font-size: 12px;color: #000;"><b>${item.accomplisment}</b></p>
                    <p style="text-align: right;margin:0;padding:0;font-size: 12px;">${item.date}</p>
                </div>
                <div class="project-content-container" style="margin:0;padding:0;">
                <div class="project-content">
                    ${
                        item.description
                    }
                </div>
                </div>
            </div>
        `).join('');
    }

        public getSkillsWithBulletPointsSectionForModern(items : Array<Skill | string | any>) : string{
        return items.map((item : Skill | string | any, index: number) => {
        const label = this.getDisplayText(item, ['name', 'skill', 'title', 'value']);
        if (!label.length) {
          return '';
        }

        const bullet = index !== items.length - 1 ? '<span class="bullet">&bull;</span>' : '';
        return `
              <li class="custom-li">
              <span style="font-size:12px;">${ label }</span>
              ${bullet}
              </li>
        `;
        }).join('');
    }

        public getCourseWorkWithBulletPointsSectionForModern(items : courseWork[]) : string{
        return items.map((item : courseWork, index: number)=> 
        `
        ${items.length > 0 ?
            `
                  <li class="custom-li">
                  <span style="font-size:12px;">${ item.courseworkname }</span>
                  ${index !== items.length - 1 ? `<span class="bullet">•</span>` : ''}
                  </li>
        ` : ''
        }
        `).join('');
    }





  public getCourseWorkSectionForMonoPro(items: courseWork[]): string {
    return items.map((item: courseWork) =>
      item.courseworkname && item.courseworkname.length > 0
        ? `<li class="course-work-lisit-item" style="margin:0;padding:0;"><div class="course-name" style="font-weight: 600;">${item.courseworkname}</div>${item.institution ? `<div class="course-institution" style="font-size: 0.9em; color: #666; font-style: italic;">${item.institution}</div>` : ''}</li>`
        : ''
    ).join('');
  }

  public getSkillsWithBulletPointsSectionForMonoPro(items: Skill[]): string {
    return items.map((item: Skill | string | any) => {
      const label = this.getDisplayText(item, ['name', 'skill', 'title', 'value']);
      return label ? `<li class="course-work-lisit-item" style="margin:0;padding:0;">${label}</li>` : '';
    }).join('');
  }

  public getSkillsCategorySectionForMonoPro(items: SkillV2[]): string {
    return items.map((item: SkillV2) =>
      `<li class="skill-category-li"><b>${item.sub_title}:</b> ${item.skills.join(', ')}</li>`
    ).join('');
  }

  public getExperienceSectionForMonoPro(items: Experience[]): string {
    return items.map((item: Experience) =>
      `<div class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p style="flex: 1;text-align: left;margin: 0;padding:0;"><b>${item.position_title}</b>, ${item.company_name}</p>
          ${item.start_date.length > 0 ? `<p style="flex: 1;text-align: right;margin:0;padding:0;">${item.start_date} - ${item.end_date}</p>` : ''}
        </div>
        <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
            ${item.description}
          </div>
        </div>
      </div>`
    ).join('');
  }

  public getProjectSectionForMonoPro(items: Project[]): string {
    return items.map((item: Project) =>
      `<div class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px;">
        ${item.project_name.length > 0 ?
          `<div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            <div class="education-p">
              ${item.project_name.length > 0 && item.project_link.length > 0 ?
                `<p style="margin:0;padding:0;"><a style="color:#000000DE" href="${item.project_link}"><b>${item.project_name}</b></a></p>` : ''}
              ${item.project_name.length > 0 && item.project_link.length == 0 ?
                `<p style="margin:0;padding:0;"><b>${item.project_name}</b></p>` : ''}
              ${item.project_name.length > 0 && item.technologies_used.length > 0 ?
                `<p>|</p>` : ''}
              ${item.technologies_used.length > 0 ?
                `<p>${item.technologies_used}</p>` : ''}
            </div>
          </div>` : ''}
        <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
            ${item.description}
          </div>
        </div>
      </div>`
    ).join('');
  }

  public getCertificationSectionForMonoPro(items: Certification[]): string {
    return items.map((item: Certification) =>
      `<div class="course-work-section-content template1-section-content trigger-area" style="margin-top:5px;">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p style="flex: 1;text-align: left;margin: 0;padding:0;"><a href="${item.url}" style="margin: 0;padding: 0;color:#000000DE">${item.name}</a>, ${item.authority}</p>
          <p style="flex: 1;text-align: right;margin:0;padding:0;">${item.date}</p>
        </div>
      </div>`
    ).join('');
  }

  public getAccomplishmentsSectionForMonoPro(items: Accomplishment[]): string {
    return items.map((item: Accomplishment) =>
      `<div class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p style="flex: 1;text-align: left;margin: 0;padding:0;"><b>${item.accomplisment}</b></p>
          ${item.date.length > 0 ? `<p style="flex: 1;text-align: right;margin:0;padding:0;">${item.date}</p>` : ''}
        </div>
        <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
            ${item.description}
          </div>
        </div>
      </div>`
    ).join('');
  }

  public getCertificationSectionForModern(items: Certification[]) {
        return items.map((item: Certification) =>
            `
            <div class="experience-container" style="margin-top:7px">
                <p style="font-size: 12px;margin: 0;"><b>${item.name} | ${item.authority} | ${item.date}</b></p>
                ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
            </div>
            `
        ).join('');
    }
}