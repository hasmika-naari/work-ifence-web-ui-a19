import { Injectable, Signal, inject } from '@angular/core';
import { Accomplishment, achievement, Award, Certification, Education, Experience, Language, Project, Resume, Skill, SkillV2, TemplateVariables, courseWork } from '../resume.model';
import { UserStoreService } from '../store/user-store.service';
import { TEMPLATE2_CONTACT_ICON_CLASSES, TEMPLATE2_SECTION_ICON_CLASSES } from '../../pages/resume-form3/template2/template2-icons';

type Template2ExportColumn = 'sidebar' | 'main';

const TEMPLATE_2_PRESENTATIONAL_CSS = `.template2 {
  --template2-heading-font: Cambria, Georgia, "Times New Roman", serif;
  --template2-body-font: "Segoe UI", Arial, Helvetica, sans-serif;
  --template2-bg: #ffffff;
  --template2-panel: transparent;
  --template2-border: #ebdcc0;
  --template2-divider: #e0c07b;
  --template2-heading: #1f1b16;
  --template2-text: #37322a;
  --template2-muted: #5d564c;
  --template2-accent: #d9a23c;
  --template2-shadow: none;
  --template2-name-size: 2.08rem;
  --template2-headline-size: 0.9rem;
  --template2-contact-size: 12px;
  --template2-section-title-size: 0.92rem;
  --template2-item-title-size: 1rem;
  --template2-side-title-size: 0.92rem;
  --template2-label-size: 0.72rem;
  --template2-body-size: 12px;
  --template2-emphasis-size: 12px;
  --template2-meta-size: 12px;
  --template2-body-line-height: 1.5;
  --template2-chip-line-height: 1.62;
  --template2-section-gap: 1.05rem;
  --template2-card-gap: 0.75rem;
  --template2-header-gap: 1rem;
  --template2-sidebar-width: minmax(205px, 0.72fr);
  --template2-main-width: minmax(0, 1.78fr);
  --template2-layout-gap: 1.35rem;
  --template2-section-header-gap: 0.7rem;
  --template2-contact-row-gap: 0.38rem;
  --template2-contact-column-gap: 1rem;
  margin: 0 auto;
  padding-bottom: 1.5rem;
  color: var(--template2-text);
  font-family: var(--template2-body-font);
  background: #fff;
}

@font-face {
  font-family: "FontAwesomeLocal";
  src: url('/assets/resume/icons/fontawesome-webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.template2 .fa-icon {
  font-family: "FontAwesomeLocal" !important;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}

.template2 .t2-icon-profile::before { content: "\\f007"; }
.template2 .t2-icon-highlights::before { content: "\\f005"; }
.template2 .t2-icon-skills::before { content: "\\f085"; }
.template2 .t2-icon-coursework::before { content: "\\f02d"; }
.template2 .t2-icon-certifications::before { content: "\\f0a3"; }
.template2 .t2-icon-achievements::before { content: "\\f091"; }
.template2 .t2-icon-experience::before { content: "\\f0b1"; }
.template2 .t2-icon-projects::before { content: "\\f07c"; }
.template2 .t2-icon-education::before { content: "\\f19d"; }
.template2 .t2-icon-default::before { content: "\\f02e"; }
.template2 .t2-icon-email::before { content: "\\f0e0"; }
.template2 .t2-icon-phone::before { content: "\\f095"; }
.template2 .t2-icon-linkedin::before { content: "\\f0e1"; }
.template2 .t2-icon-github::before { content: "\\f09b"; }
.template2 .t2-icon-portfolio::before { content: "\\f0ac"; }

.template2-layout {
  display: grid;
  grid-template-columns: var(--template2-sidebar-width) var(--template2-main-width);
  gap: var(--template2-layout-gap);
  align-items: start;
}

.template2-sidebar,
.template2-main {
  display: grid;
  gap: var(--template2-section-gap);
  align-content: start;
}

.template2-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--template2-header-gap);
  padding: 0.1rem 0 1.2rem;
  margin-bottom: 1.35rem;
  border-bottom: 1px solid var(--template2-divider);
}

.template2-header__identity {
  display: flex;
  align-items: center;
  gap: var(--template2-header-gap);
  min-width: 0;
}

.template2-header__avatar {
  width: 5.25rem;
  height: 5.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #e5ca94 0%, #d5a24f 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--template2-heading-font);
  font-size: 1.35rem;
  font-weight: 700;
}

.template2-header__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template2-header__copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.template2-header__title-group {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.template2-header__name {
  margin: 0;
  font-family: var(--template2-heading-font);
  font-size: var(--template2-name-size);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--template2-heading);
}

.template2-header__headline {
  margin: 0;
  font-size: var(--template2-headline-size);
  line-height: 1.3;
  font-style: italic;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--template2-accent);
}

.template2-header__meta {
  list-style: none;
  padding: 0;
  margin: 0.1rem 0 0;
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--template2-contact-column-gap);
  row-gap: var(--template2-contact-row-gap);
}

.template2-header__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.34rem;
  font-size: var(--template2-contact-size);
  line-height: 1.25;
  color: var(--template2-text);
  white-space: nowrap;
}

.template2-header__meta-item a,
.template2-entry-card__header a {
  color: inherit;
  text-decoration: none;
}

.template2-header__meta-icon,
.template2-section-shell__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--template2-accent);
}

.template2-header__meta-icon .fa-icon {
  font-size: 0.72rem;
}

.template2-section-shell {
  position: relative;
  display: grid;
  gap: var(--template2-section-header-gap);
}

.template2-section-shell__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.18rem;
}

.template2-section-shell__title {
  margin: 0;
  width: 100%;
  display: grid;
  gap: 0.22rem;
  font-family: var(--template2-heading-font);
  font-size: var(--template2-section-title-size);
  line-height: 1.2;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--template2-heading);
}

.template2-section-shell__title-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
}

.template2-section-shell__title-icon .fa-icon {
  font-size: 0.92rem;
}

.template2-section-shell__title-rule {
  display: block;
  width: 100%;
  height: 1px;
  margin-top: 0.1rem;
  background: var(--template2-divider);
}

.template2-category-list,
.template2-stack-list,
.template2-main-list {
  display: grid;
  gap: var(--template2-card-gap);
}

.template2-category-card,
.template2-side-card,
.template2-entry-card {
  border: 0;
  background: transparent;
  box-shadow: none;
  break-inside: avoid;
  page-break-inside: avoid;
}

.template2-category-card h3 {
  margin: 0 0 0.24rem;
  font-family: var(--template2-body-font);
  font-size: var(--template2-label-size);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--template2-muted);
}

.template2-chip {
  display: inline;
  color: var(--template2-heading);
  font-size: var(--template2-emphasis-size);
  font-weight: 600;
  line-height: var(--template2-chip-line-height);
}

.template2-chip::after {
  content: ", ";
}

.template2-chip:last-child::after {
  content: "";
}

.template2-bullet-list {
  margin: 0;
  padding-left: 1rem;
}

.template2-bullet-list--tight li,
.template2-richtext,
.template2-richtext p,
.template2-richtext li {
  font-size: var(--template2-body-size);
  line-height: var(--template2-body-line-height);
  color: var(--template2-text);
}

.template2-bullet-list--columns {
  column-count: 2;
  column-gap: 1.1rem;
}

.template2-bullet-list--columns li {
  break-inside: avoid;
}

.template2-side-card__copy h3 {
  margin: 0;
  font-family: var(--template2-heading-font);
  font-size: var(--template2-side-title-size);
  font-weight: 700;
  color: var(--template2-heading);
}

.template2-side-card__copy p,
.template2-side-card__copy span,
.template2-entry-card__meta,
.template2-entry-card__header p {
  color: var(--template2-muted);
  font-size: var(--template2-meta-size);
}

.template2-side-card__meta-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.template2-side-card__meta-row p {
  margin: 0;
}

.template2-side-card__meta-row span {
  margin-left: auto;
  white-space: nowrap;
  text-align: right;
}

.template2-entry-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.template2-entry-card__header h3 {
  margin: 0;
  font-family: var(--template2-heading-font);
  font-size: var(--template2-item-title-size);
  font-weight: 700;
  color: var(--template2-heading);
}

.template2-entry-card__header p {
  margin: 0;
}

.template2-entry-card__meta {
  text-align: right;
  font-style: italic;
}

.template2-entry-card__meta span {
  display: block;
}

@media (max-width: 900px) {
  .template2-layout {
    grid-template-columns: 1fr;
  }

  .template2-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .template2-bullet-list--columns {
    column-count: 1;
  }

  .template2-entry-card__header {
    flex-direction: column;
  }

  .template2-entry-card__meta {
    text-align: left;
  }
}`;

const TEMPLATE_2_EXPORT_NORMALIZERS: Record<string, (resume: Resume, context: any) => { column: Template2ExportColumn; html: string } | null> = {
  PROFILE_SUMMARY: (resume: Resume, context: any) => {
    const summary = context.template2GetSectionData(resume, 'PROFILE_SUMMARY') || {};
    const content = summary.original_summary_html || (summary.profile_summary ? context.template2EscapeHtml(summary.profile_summary) : '');

    if (!content) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'PROFILE_SUMMARY', 'Summary'),
        TEMPLATE2_SECTION_ICON_CLASSES.PROFILE_SUMMARY,
        `<div class="template2-richtext">${content}</div>`,
      ),
    };
  },
  PROFILE_SUMMARY_BULLETED: (resume: Resume, context: any) => {
    const summary = context.template2GetSectionData(resume, 'PROFILE_SUMMARY_BULLETED') || {};
    const bullets = (summary.summary_bullets || []).filter((item: string) => item && item.trim().length > 0);

    if (!bullets.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'PROFILE_SUMMARY_BULLETED', 'Career Highlights'),
        TEMPLATE2_SECTION_ICON_CLASSES.PROFILE_SUMMARY_BULLETED,
        context.template2RenderList(bullets, 'template2-bullet-list'),
      ),
    };
  },
  SKILLS_BY_CATEGORY: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'SKILLS_BY_CATEGORY');

    if (!items.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'SKILLS_BY_CATEGORY', 'Skills By Category'),
        TEMPLATE2_SECTION_ICON_CLASSES.SKILLS_BY_CATEGORY,
        `<div class="template2-category-list">${items.map((item: any) => {
          const skills = (item.skills || []).filter(Boolean);
          if (!skills.length && !item.category) {
            return '';
          }

          return `<div class="template2-category-card"><h3>${context.template2EscapeHtml(item.category || 'Category')}</h3><div class="template2-chip-list">${skills.map((skill: string) => `<span class="template2-chip">${context.template2EscapeHtml(skill)}</span>`).join('')}</div></div>`;
        }).join('')}</div>`,
      ),
    };
  },
  SKILLS_BULLET_POINTS: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'SKILLS_BULLET_POINTS').map((item: any) => item?.skill || item).filter(Boolean);

    if (!items.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'SKILLS_BULLET_POINTS', 'Skills'),
        TEMPLATE2_SECTION_ICON_CLASSES.SKILLS_BULLET_POINTS,
        context.template2RenderList(items, 'template2-bullet-list template2-bullet-list--tight template2-bullet-list--columns'),
      ),
    };
  },
  RELEVANT_COURSEWORK: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'RELEVANT_COURSEWORK')
      .map((item: any) => [item?.courseworkname, item?.institution].filter(Boolean).join(' | '))
      .filter(Boolean);

    if (!items.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'RELEVANT_COURSEWORK', 'Course Work'),
        TEMPLATE2_SECTION_ICON_CLASSES.RELEVANT_COURSEWORK,
        context.template2RenderList(items, 'template2-bullet-list template2-bullet-list--tight'),
      ),
    };
  },
  CERTIFICATIONS: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'CERTIFICATIONS');

    if (!items.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'CERTIFICATIONS', 'Certifications'),
        TEMPLATE2_SECTION_ICON_CLASSES.CERTIFICATIONS,
        `<div class="template2-stack-list">${items.map((item: any) => `<article class="template2-side-card"><div class="template2-side-card__copy"><h3>${context.template2EscapeHtml(item.name || '')}</h3>${(item.authority || item.date) ? `<div class="template2-side-card__meta-row">${item.authority ? `<p>${context.template2EscapeHtml(item.authority)}</p>` : '<p></p>'}${item.date ? `<span>${context.template2EscapeHtml(item.date)}</span>` : ''}</div>` : ''}</div></article>`).join('')}</div>`,
      ),
    };
  },
  CERTIFICATIONS_BULLET_POINTS: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'CERTIFICATIONS_BULLET_POINTS').map((item: any) => item?.point || item).filter(Boolean);

    if (!items.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'CERTIFICATIONS_BULLET_POINTS', 'Certification Highlights'),
        TEMPLATE2_SECTION_ICON_CLASSES.CERTIFICATIONS_BULLET_POINTS,
        context.template2RenderList(items, 'template2-bullet-list template2-bullet-list--tight'),
      ),
    };
  },
  ACHIEVEMENTS_BULLET_POINTS: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'ACHIEVEMENTS_BULLET_POINTS').map((item: any) => item?.achievement || item?.title || item).filter(Boolean);

    if (!items.length) {
      return null;
    }

    return {
      column: 'sidebar',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'ACHIEVEMENTS_BULLET_POINTS', 'Achievements'),
        TEMPLATE2_SECTION_ICON_CLASSES.ACHIEVEMENTS_BULLET_POINTS,
        context.template2RenderList(items, 'template2-bullet-list template2-bullet-list--tight'),
      ),
    };
  },
  WORK_EXPERIENCE: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'WORK_EXPERIENCE');

    if (!items.length) {
      return null;
    }

    return {
      column: 'main',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'WORK_EXPERIENCE', 'Experience'),
        TEMPLATE2_SECTION_ICON_CLASSES.WORK_EXPERIENCE,
        `<div class="template2-main-list">${items.map((item: any) => `<article class="template2-entry-card"><div class="template2-entry-card__header"><div><h3>${context.template2EscapeHtml(item.position_title || '')}</h3>${item.company_name ? `<p>${context.template2EscapeHtml(item.company_name)}</p>` : ''}</div><div class="template2-entry-card__meta">${item.location ? `<span>${context.template2EscapeHtml(item.location)}</span>` : ''}${(item.start_date || item.end_date) ? `<span>${context.template2EscapeHtml(context.template2FormatDateRange(item.start_date, item.end_date, item.isCurrentlyWorkHere))}</span>` : ''}</div></div>${item.description ? `<div class="template2-richtext">${item.description}</div>` : ''}</article>`).join('')}</div>`,
      ),
    };
  },
  PROJECT: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'PROJECT');

    if (!items.length) {
      return null;
    }

    return {
      column: 'main',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'PROJECT', 'Projects'),
        TEMPLATE2_SECTION_ICON_CLASSES.PROJECT,
        `<div class="template2-main-list">${items.map((item: any) => `<article class="template2-entry-card"><div class="template2-entry-card__header"><div><h3>${item.project_link ? `<a href="${context.template2EscapeHtml(item.project_link)}" target="_blank" rel="noreferrer">${context.template2EscapeHtml(item.project_name || '')}</a>` : context.template2EscapeHtml(item.project_name || '')}</h3>${item.role ? `<p>${context.template2EscapeHtml(item.role)}</p>` : ''}</div><div class="template2-entry-card__meta">${item.technologies_used ? `<span>${context.template2EscapeHtml(item.technologies_used)}</span>` : ''}${(item.start_date || item.end_date || item.period) ? `<span>${context.template2EscapeHtml(item.period || context.template2FormatDateRange(item.start_date, item.end_date))}</span>` : ''}</div></div>${(item.description || item.responsibilitiesRichText || item.highlightsRichText) ? `<div class="template2-richtext">${item.description || item.responsibilitiesRichText || item.highlightsRichText}</div>` : ''}</article>`).join('')}</div>`,
      ),
    };
  },
  EDUCATION: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'EDUCATION');

    if (!items.length) {
      return null;
    }

    return {
      column: 'main',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'EDUCATION', 'Education'),
        TEMPLATE2_SECTION_ICON_CLASSES.EDUCATION,
        `<div class="template2-main-list">${items.map((item: any) => `<article class="template2-entry-card template2-entry-card--compact"><div class="template2-entry-card__header"><div><h3>${context.template2EscapeHtml([item.degree, item.field_of_study].filter(Boolean).join(', '))}</h3>${item.school_name ? `<p>${context.template2EscapeHtml(item.school_name)}</p>` : ''}</div><div class="template2-entry-card__meta">${item.school_location ? `<span>${context.template2EscapeHtml(item.school_location)}</span>` : ''}${item.graduation_date ? `<span>${context.template2EscapeHtml(item.graduation_date)}</span>` : ''}${item.gpa ? `<span>CGPA: ${context.template2EscapeHtml(item.gpa)}</span>` : ''}</div></div></article>`).join('')}</div>`,
      ),
    };
  },
  ACHIEVEMENT_WITH_DESC: (resume: Resume, context: any) => {
    const items = context.template2GetSectionItems(resume, 'ACHIEVEMENT_WITH_DESC');

    if (!items.length) {
      return null;
    }

    return {
      column: 'main',
      html: context.template2RenderSectionShell(
        context.template2GetSectionTitle(resume, 'ACHIEVEMENT_WITH_DESC', 'Accomplishments'),
        TEMPLATE2_SECTION_ICON_CLASSES.ACHIEVEMENT_WITH_DESC,
        `<div class="template2-main-list">${items.map((item: any) => `<article class="template2-entry-card template2-entry-card--compact"><div class="template2-entry-card__header"><div><h3>${context.template2EscapeHtml(item.accomplisment || '')}</h3>${item.date ? `<p>${context.template2EscapeHtml(item.date)}</p>` : ''}</div></div>${(item.original_html_description || item.description) ? `<div class="template2-richtext">${item.original_html_description || context.template2EscapeHtml(item.description)}</div>` : ''}</article>`).join('')}</div>`,
      ),
    };
  },
};

const TEMPLATE_1_EXPORT_NORMALIZERS: Record<string, (section: any, resumeForm: any, context: any) => string | null> = {
  CONTACT: (section: any, resumeForm: any) => {
    if (!resumeForm.isSectionPresent.isContact) return null;
    const contactEmail = resumeForm.contact.email_address || resumeForm.contact.email || '';
    return `
      <header class="trigger-area resume-contact-us" style="margin-bottom:15px;">
        <div style="display:flex;flex-direction:column;"> 
            <span class="profile-full-name" style="margin:0;padding:0;" id="resumeName">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</span>
            <span class="profile-sub-title" style="margin:0;padding:0;padding-bottom:5px">${resumeForm.contact.subTitle}</span>
        </div>
        <div>
              <ul class="profile-contact-details-list">
                  ${resumeForm.contact.phone_number.length > 0 ?
        `<li class="contact-li"><span class="material-icons contact-detail-icon">phone</span> ${resumeForm.contact.phone_number}</li>` : ''}
                  ${contactEmail.length > 0 ?
            `<li class="contact-li"><span class="material-icons contact-detail-icon">alternate_email</span> ${contactEmail}</li>` : ''}
                  ${resumeForm.contact.linkedIn_profile.length > 0 ?
        `<li class="contact-li"><i class="fab fa-linkedin contact-detail-icon"></i> <a href="${resumeForm.contact.linkedIn_profile}" class="contact-a" style="color:#000000DE"> ${resumeForm.contact.linkedIn_profile_display_name}</a></li>` : ''}
                  ${resumeForm.contact.github_profile.length > 0 ?
        `<li class="contact-li"><i class="fab fa-github contact-detail-icon"></i> <a  href="${resumeForm.contact.github_profile}" class="contact-a" style="color:#000000DE"> ${resumeForm.contact.github_profile_display_name}</a></li>` : ''}
              </ul>
        </div>
      </header>`;
  },
  PROFILE_SUMMARY: (section: any, resumeForm: any) => {
    if (!(resumeForm.profileSummary.profile_summary.length > 0 && resumeForm.isSectionPresent.isSummary)) return null;
    return `
      <section class="trigger-area resume-summary">
        <span class="summary-section-title">Summary</span>
        <div class="project-content">${resumeForm.profileSummary.profile_summary}</div>
      </section>`;
  },
  PROFILE_SUMMARY_BULLETED: (section: any, resumeForm: any) => {
    const bulletedData = section.data;
    if (!bulletedData) return null;
    let bulletContent = '';
    if (bulletedData.profile_summary) {
      bulletContent = `<div class="project-content">${bulletedData.profile_summary}</div>`;
    } else if (bulletedData.summary_bullets?.length) {
      const bullets = bulletedData.summary_bullets
        .filter((b: string) => b && b.trim().length > 0)
        .map((b: string) => `<li>${b.trim()}</li>`)
        .join('');
      if (bullets) {
        bulletContent = `<div class="project-content"><ul style="margin-left: 1.25rem; list-style: disc inside;">${bullets}</ul></div>`;
      }
    }
    return bulletContent ? `
      <section class="trigger-area resume-summary">
        <span class="summary-section-title">${section.editable_section_title || 'Summary'}</span>
        ${bulletContent}
      </section>` : null;
  },
  EDUCATION: (section: any, resumeForm: any, context: any) => {
    if (!(resumeForm.education.length > 0 && resumeForm.isSectionPresent.isEducation)) return null;
    return `
      <section class="trigger-area resume-education">
          <span class="summary-section-title">Education</span>  
          ${context.formatHTMLTemplate1EducationV1(resumeForm.education)}        
      </section>`;
  },
  COURSEWORK: (section: any, resumeForm: any, context: any) => {
    if (!(resumeForm.courseWork.length > 0 && resumeForm.isSectionPresent.isCourseWork)) return null;
    return `
      <section class="trigger-area course-work">
        <span class="summary-section-title">Relevant Coursework</span>
        <div class="course-work-section-content project-content" style="margin-top:7px;">
            <ul class="course-work-list">
              ${context.formatHTMLTemplate1CourseWorkV1(resumeForm.courseWork)}
            </ul>
        </div>
      </section>`;
  },
  SKILLS_BULLET_POINTS: (section: any, resumeForm: any, context: any) => {
    if (!(resumeForm.isSectionPresent.isSkill && resumeForm.skill.length > 0)) return null;
    return `
      <section class="trigger-area course-work">
        <span class="summary-section-title">Skills</span>
        <div class="course-work-section-content project-content" style="margin-top:7px;">
            <ul class="course-work-list">
              ${context.formatHTMLTemplate1SkillWorkV1(resumeForm.skill)}
            </ul>
        </div>
      </section>`;
  },
  SKILLS_BY_CATEGORY: (section: any, resumeForm: any, context: any) => {
    if (!(resumeForm.skill_v2.length > 0 && resumeForm.isSectionPresent?.isSkillV2)) return null;
    const skillV2List: SkillV2[] = (resumeForm as any).skill_v2 ?? (resumeForm.sections?.find((s: any) => s.section === 'SKILLS_BY_CATEGORY')?.items?.map((i: any) => i.data) ?? []);
    const firstHalfSkills = [...skillV2List.slice(0, Math.ceil(skillV2List.length / 2))];
    const secondHalfSkills = [...skillV2List.slice(Math.ceil(skillV2List.length / 2))];
    return `
      <section class="trigger-area course-work">
          <span class="summary-section-title">Skills</span>
          <div class="skills-content">
              <ul class="skill-category">
                ${context.formatSkillsTemplate10(firstHalfSkills)}
              </ul>
              <ul class="skill-category">
                  ${context.formatSkillsTemplate10(secondHalfSkills)}
              </ul>
          </div>
      </section>`;
  },
  WORK_EXPERIENCE: (section: any, resumeForm: any, context: any) => {
    if (!(resumeForm.experience.length > 0 && resumeForm.isSectionPresent.isExperience)) return null;
    return `
      <section class="course-work section-details trigger-area">
          <span class="summary-section-title">Experience</span>  
          ${context.formatHTMLTemplate1ExperienceV1(resumeForm.experience)}
      </section>`;
  },
  PROJECT: (section: any, resumeForm: any, context: any) => {
    const projectItems = section?.items?.map((item: any) => item?.data ?? item).filter(Boolean) ?? [];
    if (!(projectItems.length > 0 && resumeForm.isSectionPresent.isProject)) return null;
    return `
      <section class="course-work section-details trigger-area">
          <span class="summary-section-title">Projects</span>
          ${context.formatHTMLTemplate1ProjectV1(projectItems)}  
      </section>`;
  },
  CERTIFICATIONS: (section: any, resumeForm: any, context: any) => {
    const certItems = section?.items?.map((i: any) => i.data) ?? [];
    if (!(certItems.length > 0 && resumeForm.isSectionPresent.isCertification)) return null;
    return `
      <section class="course-work section-details trigger-area">
          <span class="summary-section-title">Certifications</span>  
          ${context.formatHTMLTemplate1CertificationV1(certItems)}
      </section>`;
  },
  ACHIEVEMENTS_BULLET_POINTS: (section: any, resumeForm: any) => {
    const achievementItems = (section?.items ?? [])
      .map((item: any) => {
        const data = item?.data ?? item ?? {};
        return {
          title: (data.title ?? '').trim(),
          organization: (data.organization ?? '').trim(),
          year: String(data.year ?? '').trim()
        };
      })
      .filter((item: any) => item.title || item.organization || item.year);

    if (!(achievementItems.length > 0 && resumeForm.isSectionPresent?.isAchievement)) return null;

    return `
      <section class="course-work section-details trigger-area">
        <span class="summary-section-title">${section.editable_section_title || 'Achievements'}</span>
        <div class="course-work-section-content" style="margin-top:7px;">
          ${achievementItems.map((item: any) => `
            <div class="achievement-item" style="margin: 0 0 8px 0;">
              <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                <div>
                  ${item.title ? `<div class="job-title"><b>${item.title}</b></div>` : ''}
                  ${item.organization ? `<div class="company-duration">${item.organization}</div>` : ''}
                </div>
                ${item.year ? `<div class="company-duration">${item.year}</div>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </section>`;
  },
  ACCOMPLISHMENTS: (section: any, resumeForm: any) => {
    const achvItems = section?.items?.map((i: any) => i.data.description) ?? [];
    if (!(achvItems.length > 0 && resumeForm.isSectionPresent?.isAchievement)) return null;
    return `
      <section class="trigger-area course-work trigger-area">
        <span class="summary-section-title">Achievements</span>
        <div class="course-work-section-content">
          <div class="project-content">${achvItems.join('')}</div>
        </div>
      </section>`;
  }
};

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  constructor() {}
  private userStore: UserStoreService = inject(UserStoreService);
  // Helper functions to extract data from resume.sections
  private getSectionData<T>(resume: Resume, sectionName: string): T | undefined {
    return resume.sections?.find((s: any) => s.section === sectionName)?.items?.[0]?.data;
  }
  private getSectionList<T>(resume: Resume, sectionName: string): T[] {
    return resume.sections?.find((s: any) => s.section === sectionName)?.items?.map((i: any) => i.data) ?? [];
  }
  private getContact(resume: Resume) {
    const contact = this.getSectionData<any>(resume, 'CONTACT');
    if (!contact) {
      return { fname: '', lname: '', email_address: '', email: '', phone_number: '', linkedIn_profile: '', github_profile: '' };
    }

    const email_address = contact.email_address || contact.email || '';
    return {
      ...contact,
      email_address,
      email: email_address
    };
  }
  private getProfileSummary(resume: Resume) {
    return this.getSectionData<any>(resume, 'PROFILE_SUMMARY') ?? { profile_summary: '' };
  }
  private getSkills(resume: Resume) {
    return this.getSectionList<any>(resume, 'SKILLS');
  }
  private getExperience(resume: Resume) {
    return this.getSectionList<any>(resume, 'WORK_EXPERIENCE');
  }
  private getEducation(resume: Resume) {
    return this.getSectionList<any>(resume, 'EDUCATION');
  }
  private getProjects(resume: Resume) {
    return this.getSectionList<any>(resume, 'PROJECT');
  }

  private templates_json : Array<TemplateVariables>= [
    {
      template_name : 'delloite_template',
      name : true,
      email : true,
      phone_number : true,
      address : false,
      linkedIn_profile : true,
      github_profile : true,
      role : true,
      profile_summary : true,
      experience : true,
      education : true,
      skills : true,
      certification : true,
      project : true,
      awards : false,
      languages : false,
      interests : false,
      volunteer_experiences : false,
      professional_memberships : false,
      publications : false,
      profile_image : true
    },
    {
      template_name : 'devresume_template',
      name : true,
      email : true,
      phone_number : true,
      address : true,
      linkedIn_profile : true,
      github_profile : false,
      role : true,
      profile_summary : true,
      experience : true,
      education : true,
      skills : true,
      certification : false,
      project : true,
      awards : true,
      languages : true,
      interests : true,
      volunteer_experiences : false,
      professional_memberships : false,
      publications : false,
      profile_image : true
    }
  ]

  getFormatedResumeHTMLText(template_name : String, resume : Resume){    
    if(template_name == "TEMPLATE_1"){
      return this.getTemplate1HTMLV1(resume);
    }
    else if(template_name == 'TEMPLATE_2'){
      return this.getTemplate2HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_3'){
  return this.getTemplate4HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_4'){
      return this.getTemplate4HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_5'){
      return this.getTemplate5HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_6'){
      // getTemplate6HTMLText removed: duplicate/invalid implementation
      return '';
    }
    else if(template_name == 'TEMPLATE_7'){
      return this.getTemplate7HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_8'){
      return this.getTemplate8HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_9'){
      return this.getTemplate9HTMLV1(resume);
    }
    else if(template_name == 'TEMPLATE_10'){
      return this.formatTemplate10HTML(resume);
    }
    return "";
  }

  getTemplates_JSON(){
    return this.templates_json;
  }

  getDelloite_Template(resume : Resume){
    // return `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    // <meta charset="UTF-8">
    // <meta name="viewport" content="width=device-width, initial-scale=1.0">
    // <title>${resume.name} Resume</title>
    // <script defer src="src/main/resources/templates/fontawesome/js/all.min.js"></script>
    // <link href="src/main/resources/templates/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
    // <style>

    // * {
    //     margin: 0;
    //     padding: 0;
    //     box-sizing: border-box;
    //   }
    //   html {
    //     height: 100%;  
    //   }

    //   body {
    //     min-height: 100%;  
    //     background: #eee;
    //     font-family: 'Lato', sans-serif;
    //     font-weight: 400;
    //     font-size: 12px;
    //     background-color: #ffffff;
    //     color: #000000;
    //   }

    //   .container {
    //     max-width: 700px;   
    //     background: #fff;
    //     margin: 0px auto 0px; 
    //   }

    // header {
    //   background-color: #ffffff;
    //   color: black;
    //   text-align: left; /* Align name to the left */
    //   position : relative
    // }

    // header h1 {
    //   margin: 0;
    //   font-family: 'Poppins', sans-serif; /* Use Poppins font for the name */
    //   letter-spacing: 0.1em; /* Character spacing for titles */
    // }

    // header img {
    //   border-radius: 50%;
    //   width: 100px;
    //   height: 100px;
    //   object-fit: cover;
    //   position: absolute;
    //   top: 50%;
    //   right: 20px;
    //   transform: translateY(-50%);
    // }

    // .contact-icons {
    //   list-style: none;
    //   padding: 12px 0; /* Better padding for contact details */
    //   margin: 0;
    // }

    // .contact-container {
// ...existing code...
    //       margin-top: var(--bs-gutter-y);
    //     }
    
    //     .contact-details li {
    //       font-family: 'Wix Madefor Text', sans-serif;
    //     }
    
    //     .align-items-center {
    //       align-items: center !important;
    //     }
    
    //     .mb-0 {
    //       margin-bottom: 0 !important;
    //     }
    
    //     a.resume-link {
    //       color: #4f4f4f;
    //     }
    
    //     a.resume-link:hover {
    //       color: #54B689;
    //     }
    
    //     ol,
    //     ul {
    //       padding-left: 2rem;
    //     }
    
    //     ol,
    //     ul,
    //     dl {
    //       margin-top: 0;
    //       margin-bottom: 1rem;
    //     }
    
    //     ol ol,
    //     ul ul,
    //     ol ul,
    //     ul ol {
    //       margin-bottom: 0;
    //     }
    
    //     .contact-details i {
    //       color: black;
    //       margin-right: 5px;
    //     }
    
    //     /* Section 2 styles */
    //     .section2 {
    //       border-top: 1px solid rgba(0, 0, 0, 0.08);
    //       padding: 12px 0px 12px 0px;
    //       display: flex;
    //       align-items: center;
    //     }
    
    //     .profile-image {
    //       border-radius: 50%;
    //       margin-right: 20px;
    //       width:100px;
    //       height:100px;
    //     }
    
    //     .profile-summary {
    //       font-family: 'Wix Madefor Text', sans-serif;
    //       flex: 1;
    //     }
               
    //   .sub-sections-row {
    //     display: flex;
    //     flex-direction: row;
    //     margin-top: 12px;
    //   }
      
    //   /* Sub-Section Styles */
    //   .sub-section1,
    //   .sub-section2 {
    //     border-top: 1px solid rgba(0, 0, 0, 0.08);
    //   }
      
    //   .sub-section1{
    //       width: 72%;
    //       padding-right: 5px;
    //   }
      
    //   .sub-section2{
    //       width: 28%;
    //       padding-left: 20px;
    //   }
      
    //   .sub-section-title {
    //     font-family:Arial, Helvetica, sans-serif;
    //     font-size: 1.2rem;
    //     font-weight: 700;
    //     color: #54B689;
    //     margin-bottom: 12px;
    //     text-transform: uppercase !important;
    //   }
      
    //   .resume-section-heading{position:relative;padding-left:1rem;font-size:1.125rem;letter-spacing:0.15rem;color:#54B689}
    //   .resume-section-heading:before{content:"";display:inline-block;width:5px;height:100%;background:#54B689;position:absolute;left:0;top:0}
      
    //   section{
    //       margin: 12px 0px 12px 0px;
    //   }
      
    //   .list-unstyled{
    //       list-style: none;
    //   }
      
    //   .pd-0{
    //       padding:0 !important;
    //   }
      
    //   .resume-body{
    //       padding: 0px;
    //   }
      
    //   .text-muted{--bs-text-opacity: 1;color:var(--bs-secondary-color) !important}
      
    //     </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <div class="header col-12">
    //         <div class="resume-title col-md-6 col-lg-8 col-xl-9">
    //           ${resume.name?`
    //           <h2 class="resume-name mb-0 text-uppercase">${resume.name}</h2>
    //           `:''}
    //           ${resume.role?`
    //           <div class="resume-tagline mb-3 mb-md-0">${resume.role}</div>
    //           `:''}
    //         </div>
    //         <div class="col-md-6 col-lg-4 col-xl-3">
    //           <ul class="contact-details mb-0">
    //             ${resume.phone_number?`
    //             <li class="mb-2">
    //             <i class="fas fa-phone fa-fw fa-lg me-2"></i>
    //             <a class="resume-link" href="tel:#">${resume.phone_number}</a></li>
    //             ` : ''}
    //             ${resume.email?`
    //             <li class="mb-2"><i class="fas fa-envelope-square fa-fw fa-lg me-2"></i><a class="resume-link" href="mailto:#">${resume.email}</a></li>
    //             `:''}
    //             ${resume.linkedIn_profile?`
    //             <li class="mb-2"><i class="fab fa-linkedin fa-fw fa-lg me-2"></i><a class="resume-link" href="${resume.linkedIn_profile}">LinkedIn Profile</a></li>
    //             `:''}
    //             ${resume.address?`
    //             <li class="mb-0"><i class="fas fa-map-marker-alt fa-fw fa-lg me-2"></i>${resume.address}</li>
    //             `:''}
    //           </ul>
    //         </div>
    //       </div>
      
    //       <!-- Section 2: Profile Image and Profile Summary -->
    //       <div class="section2">
    //       ${resume.imageBase64Encoded?`
    //         <img src="data:image/png;base64,${resume.imageBase64Encoded}" alt="Profile Image" class="profile-image" width="120" height="120">
    //         `:''}
    //         <div class="profile-summary">
    //         ${resume.profile_summary?`
    //           <p>${resume.profile_summary}</p>      
    //           `:''}
    //         </div>
    //       </div>
      
    //       <!-- Sub-Section 1: Work Experience and Projects -->
    //   <!-- Sub-Sections 1 and 2 in One Row -->
      
    //   <div class="resume-body">
    //       <div class="row">
    //           <div class="resume-main sub-section1 col-lg-8 col-xl-9   pe-0   pe-lg-5">
    //           ${resume.experienceList?`
    //               <section class="work-section py-3">
    //                   <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Work Experiences</h3>
    //                   ${this.formatWorkExperienceDevResume(resume.experienceList)}
    //               </section><!--//work-section-->
    //               `:''}
      
                  
    //               ${resume.projectList?`
    //               <section class="project-section py-3">
    //                   <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Projects</h3>
    //                   ${this.formatProjectDevResume(resume.projectList)}
    //               </section><!--//project-section-->	
    //               `:''}
    //           </div><!--//resume-main-->
    //           <aside class="resume-aside sub-section2 resume-contact  col-lg-4 col-xl-3 px-lg-4 pb-lg-4">
    //           ${resume.technical_skills || resume.soft_skills?`
    //               <section class="skills-section py-3">
    //                   <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Skills</h3>
    //                   ${resume.technical_skills?`
    //                   <div class="item">
    //                       <h4 class="item-title">Technical</h4>
    //                       <ul class="list-unstyled resume-skills-list pd-0" >
    //                       ${this.formatListItems(resume.technical_skills)}
    //                       </ul>
    //                   </div><!--//item-->
    //                   `:''}
    //                   ${resume.soft_skills?`
    //                   <div class="item">
    //                       <h4 class="item-title">Professional</h4>
    //                       <ul class="list-unstyled resume-skills-list pd-0">
    //                       ${this.formatListItems(resume.soft_skills)}
    //                       </ul>
    //                   </div><!--//item-->
    //                   `:''}
    //                 </section><!--//skills-section-->
    //                 `:''}
    //                 ${resume.educationList?`
    //                 <section class="education-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Education</h3>
    //                       <ul class="list-unstyled resume-education-list pd-0">
    //                           ${this.formatEductionDevResume(resume.educationList)}
    //                       </ul>
    //                 </section><!--//education-section-->
    //                 `:''}
    //                 ${resume.awardList?`
    //                 <section class="education-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Awards</h3>
    //                       <ul class="list-unstyled resume-awards-list pd-0">
    //                           ${this.formatAwardDevResume(resume.awardList)}
    //                       </ul>
    //                 </section><!--//education-section-->
    //                 `:''}
    //                 ${resume.languageList?`
    //                 <section class="skills-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Languages</h3>
    //                       <ul class="list-unstyled resume-lang-list pd-0">
    //                           ${this.formatLanguageDevResume(resume.languageList)}
    //                       </ul>
    //                 </section><!--//certificates-section-->
    //                 `:''}
    //                 ${resume.interestList?`
    //                 <section class="skills-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Interests</h3>
    //                       <ul class="list-unstyled resume-interests-list mb-0 pd-0">
    //                           ${this.formatListItems(resume.interestList)}
    //                       </ul>
    //                 </section><!--//certificates-section-->
    //                 `:''}
                          
    //                   </aside><!--//resume-aside-->
    //               </div><!--//row-->
    //           </div><!--//resume-body-->
        
        
      
    //       <!-- SkillsCategory sections will be added here -->
      
    //     </div>
    //   </body>
    // </html>    

// Invalid HTML/CSS/JSX-like code removed for TypeScript compatibility
  }

  // ...existing code...
// ...existing code...

  private template2GetSection(resume: Resume, sectionName: string): any {
    const aliases: Record<string, string[]> = {
      CERTIFICATIONS: ['CERTIFICATIONS', 'CERTIFICATION'],
      CERTIFICATION: ['CERTIFICATIONS', 'CERTIFICATION'],
      SKILLS_BY_CATEGORY: ['SKILLS_BY_CATEGORY', 'SKILLS_CATEGORY'],
      SKILLS_CATEGORY: ['SKILLS_BY_CATEGORY', 'SKILLS_CATEGORY'],
    };
    const candidates = aliases[sectionName] || [sectionName];
    return resume.sections?.find((section: any) => candidates.includes(section.section));
  }

  private template2GetSectionData(resume: Resume, sectionName: string): any {
    const section = this.template2GetSection(resume, sectionName);
    return section?.data || section?.items?.[0]?.data || null;
  }

  private template2GetSectionItems(resume: Resume, sectionName: string): any[] {
    const section = this.template2GetSection(resume, sectionName);
    return (section?.items || [])
      .map((item: any) => item?.data || item)
      .filter((item: any) => !item?.isHideSelected);
  }

  private template2EscapeHtml(value: any): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private template2GetSectionTitle(resume: Resume, sectionName: string, fallback: string): string {
    return this.template2GetSection(resume, sectionName)?.editable_section_title || fallback;
  }

  private template2RenderSectionShell(title: string, iconClass: string, body: string): string {
    return `
      <section class="template2-section-shell">
        <header class="template2-section-shell__header">
          <h2 class="template2-section-shell__title">
            <span class="template2-section-shell__title-copy">
              <span class="template2-section-shell__title-icon"><span class="${iconClass}"></span></span>
              <span>${this.template2EscapeHtml(title)}</span>
            </span>
            <span class="template2-section-shell__title-rule"></span>
          </h2>
        </header>
        <div class="template2-section-shell__body">${body}</div>
      </section>`;
  }

  private template2RenderList(items: string[], className: string = 'template2-bullet-list'): string {
    if (!items.length) {
      return '';
    }

    return `<ul class="${className}">${items.map(item => `<li>${this.template2EscapeHtml(item)}</li>`).join('')}</ul>`;
  }

  private template2GetPortfolioLabel(portfolio: string): string {
    if (!portfolio) {
      return '';
    }

    try {
      return new URL(portfolio).hostname.replace(/^www\./, '');
    } catch {
      return portfolio;
    }
  }

  private template2RenderHeader(resume: Resume): string {
    const contact = this.template2GetSectionData(resume, 'CONTACT') || {};
    const email = contact.email || contact.email_address || contact.emailId || '';
    const fullName = `${contact.fname || ''} ${contact.lname || ''}`.trim() || 'Resume';
    const initials = `${contact.fname?.charAt(0) || ''}${contact.lname?.charAt(0) || ''}`.trim().toUpperCase() || 'WF';
    const portfolio = contact.portfolio_url || contact.portfolio_link || '';
    const contactMeta = [
      email ? { iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.email, text: email, href: `mailto:${email}` } : null,
      contact.phone_number ? { iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.phone, text: contact.phone_number, href: `tel:${contact.phone_number}` } : null,
      contact.linkedIn_profile ? { iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.linkedin, text: contact.linkedIn_profile_display_name || 'LinkedIn', href: contact.linkedIn_profile } : null,
      contact.github_profile ? { iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.github, text: contact.github_profile_display_name || 'GitHub', href: contact.github_profile } : null,
      portfolio ? { iconClass: TEMPLATE2_CONTACT_ICON_CLASSES.portfolio, text: this.template2GetPortfolioLabel(portfolio), href: portfolio } : null,
    ].filter(Boolean) as Array<{ iconClass: string; text: string; href: string }>;

    return `
      <header class="template2-header">
        <div class="template2-header__identity">
          <div class="template2-header__avatar">
            ${resume.imageBase64Encoded ? `<img src="${resume.imageBase64Encoded}" alt="Profile photo" />` : this.template2EscapeHtml(initials)}
          </div>
          <div class="template2-header__copy">
            <div class="template2-header__title-group">
              <h1 class="template2-header__name">${this.template2EscapeHtml(fullName)}</h1>
              ${(contact.subTitle || contact.role) ? `<p class="template2-header__headline">${this.template2EscapeHtml(contact.subTitle || contact.role)}</p>` : ''}
            </div>
            ${contactMeta.length ? `<ul class="template2-header__meta">${contactMeta.map(item => `<li class="template2-header__meta-item"><span class="template2-header__meta-icon"><span class="${item.iconClass}"></span></span><a href="${this.template2EscapeHtml(item.href)}" target="_blank" rel="noreferrer">${this.template2EscapeHtml(item.text)}</a></li>`).join('')}</ul>` : ''}
          </div>
        </div>
      </header>`;
  }

  private template2FormatDateRange(startDate?: string, endDate?: string, isCurrent?: boolean): string {
    return [startDate, isCurrent ? 'Present' : endDate].filter(Boolean).join(' - ');
  }

  getTemplate2HTMLText(resume: Resume) {
    const contact = this.template2GetSectionData(resume, 'CONTACT') || {};
    const fullName = `${contact.fname || ''} ${contact.lname || ''}`.trim() || 'Resume';
    const sidebarSections = [
      'PROFILE_SUMMARY',
      'PROFILE_SUMMARY_BULLETED',
      'SKILLS_BY_CATEGORY',
      'SKILLS_BULLET_POINTS',
      'RELEVANT_COURSEWORK',
      'CERTIFICATIONS',
      'CERTIFICATIONS_BULLET_POINTS',
      'ACHIEVEMENTS_BULLET_POINTS',
    ];
    const mainSections = ['WORK_EXPERIENCE', 'PROJECT', 'EDUCATION', 'ACHIEVEMENT_WITH_DESC'];
    const renderTemplate2Sections = (sectionNames: string[], column: Template2ExportColumn) => sectionNames
      .map(sectionName => TEMPLATE_2_EXPORT_NORMALIZERS[sectionName]?.(resume, this))
      .filter((section): section is { column: Template2ExportColumn; html: string } => Boolean(section && section.column === column && section.html))
      .map(section => section.html)
      .join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${this.template2EscapeHtml(fullName)}</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: #ffffff;
        }

        body {
          padding: 32px;
        }

        .template2-export-page {
          max-width: 900px;
          margin: 0 auto;
        }

        ${TEMPLATE_2_PRESENTATIONAL_CSS}
      </style>
    </head>
    <body>
      <div class="template2-export-page">
        <div class="template2">
          ${this.template2RenderHeader(resume)}
          <div class="template2-layout">
            <aside class="template2-sidebar">${renderTemplate2Sections(sidebarSections, 'sidebar')}</aside>
            <main class="template2-main">${renderTemplate2Sections(mainSections, 'main')}</main>
          </div>
        </div>
      </div>
    </body>
    </html>`;
  }

  formatTemplate2Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
                <div class="experience-details">
                    <p style="color: black">${item.position_title}  |  ${item.company_name}  |  ${item.location}  |  ${item.start_date} - ${item.end_date}</p>
                </div>
                <div class="experience-bullets">
                    <ul>
                    </ul>
                </div>
    `).join('');
  }

  formatTemplate2Project(items : Array<Project>){
    return items.map((item : Project)=> `
                <div class="project-details" style="margin : 0">
                    <p style="margin : 0"><a href="${item.project_link}" style="margin : 0;font-size:12px">${item.project_name}</a></p>
                </div>
                <div class="project-bullets">
                    <ul>
                    </ul>
                </div>
    `).join('');
  }

  formatTemplate2Education(items : Array<Education>){
    return items.map((item : Education)=> `
                <div class="education-details">
                <p>${item.degree}, ${item.field_of_study} | ${item.school_name} | ${item.school_location} | CGPA: ${item.gpa} | ${item.graduation_date}</p>
                </div>
    `).join('');
  }

  // Duplicate getTemplate6HTMLText removed


  formatTemplate3Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
                <div class="experience-item" style="margin-top:12px">
                <div class="experience-item-header">
                    <div class="experience-item-header-left">
                        <p>${item.position_title}</p>
                        <p style="color: black">${item.company_name}</p>
                    </div>
                    <div class="experience-item-header-right">
                        <p>${item.start_date} - ${item.end_date}, ${item.location}</p>
                    </div>
                </div>
                <div class="experience-bullets">
                    <ul style="margin-bottom : 0">
                    </ul>
                </div>
                </div>
    `).join('');
  }

  formatTemplate3Project(items : Array<Project>){
    return items.map((item : Project)=> `
                <div class="project-item" style="margin-top:12px">
                <div class="project-item-header">
                    <div class="project-item-header-left">
                    <p style="margin : 0"><a href="${item.project_link}" style="margin : 0;font-size:12px">${item.project_name}</a></p>
                    </div>
                </div>
                <div class="project-bullets">
                    <ul style="margin-bottom : 0">
                    </ul>
                </div>
            </div>
    `).join('');
  }

  formatTemplate3Education(items : Array<Education>){
    return items.map((item : Education)=> `
                <div class="education-details">
                <p>${item.degree}, ${item.field_of_study}</p>
                <p>${item.school_name} | ${item.graduation_date}</p>
                </div>
    `).join('');
  }

  

  getTemplate4HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
          margin: auto;
          background-color: white;
          text-align: start !important;
      }

      .divider {
          width: 100%;
          height: 1px;
          background-color: rgba(0, 0, 0, 0.4);
      }

      .contact-details {
          display: flex;
          flex-wrap: wrap; /* Allow items to wrap */
          justify-content: center; /* Center items horizontally */
          margin: 0;
          padding: 0;
      }

      .contact-details p {
          margin: 0;
          margin-left: 12px;
          font-size: 12px;
      }

      .icon {
          color: black;
          font-size: 12px;
      }

      .summary h2 {
          margin: 0;
          font-size: 12px;
          padding: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          font-weight:500
      }

      .summary p {
          font-size: 12px;
          margin: 0;
      }

      .education h2,
      .skills h2 {
          margin: 0;
          font-size: 12px;
          margin-bottom: 5px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          font-weight:500
      }

      .education-details{
          margin-top: 12px;
      }

      .education-details p,
      .skills-bullets p {
          margin: 0;
          font-size: 12px;
          opacity: 1;
      }

      .skills-bullets ul {
          list-style-type: disc;
          padding-left: 20px;
      }

      .skills-bullets li {
          margin-bottom: 5px;
      }

      .summary,
      .experience,
      .project,
      .education,
      .skills
      {
        margin-top : 12px;
      }

    .experience h2,
    .project h2 {
      margin: 0;
      font-size: 12px;
      margin-bottom: 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
      font-weight:500
    }

    .experience-item-header,
    .project-item-header {
        display: flex;
        justify-content: space-between;
    }

    .experience-item-header-left,
    .project-item-header-left {
        flex: 1;
        text-align: left;
    }

    .experience-item-header-right,
    .project-item-header-right {
        flex: 1;
        text-align: right;
    }

    .experience-item-header-left p,
    .project-item-header-left p,
    .experience-item-header-right p,
    .project-item-header-right p {
        margin: 0;
        font-size: 12px;
        opacity: 1;
    }

    .experience-item-details,
    .project-item-details {
        margin-top: 5px;
        opacity: 1;
    }

    .experience-bullets,
    .project-bullets,
    .skills-bullets {
        margin-top: 12px;
    }

    .experience-bullets ul,
    .project-bullets ul,
    .skills-bullets ul {
        list-style-type: disc;
        padding-left: 18px;
        margin-top : 5px;
    }

    .experience-bullets li,
    .project-bullets li,
    .skills-bullets li {
        margin-bottom: 5px;
        font-size: 12px !important;
    }

    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
    }

    .course-work-lisit-item{
      flex: 0 0 25%;
      font-size: 12px;
       padding-bottom:5px !important;
    }

    .course-work-list{
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      text-align:left;
    }


      .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
      }

      .header-left {
          flex: 1;
      }

      .header-right p {
          margin: 0;
          padding: 0;
          color: #666;
          font-size: 12px;

      }

      .header-right {
          text-align: right;
      }

      .header-left h1 {
          margin: 0;
          color: #333;
      }
      
    </style>
    </head>
    <body>
      <div class="resume-container">
    <div class="body-container">
        <header class="trigger-area header">
        <div class="header-left" style="width:60%;top:0;left:0">
            <h1 style="font-size: 20px;font-weight:500 !important">${this.getContact(resume).fname + ' ' + this.getContact(resume).lname}</h1>
        </div>
        <div class="contact-details header-right" style="width:40%">
      ${this.getContact(resume).email?.length > 0 ? `
      <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
        <i class="fa fa-envelope icon" style="margin-right: 5px;"></i>
        <p>${this.getContact(resume).email}</p><br>
      </div>
      ` : ''}
      ${this.getContact(resume).phone_number?.length > 0 ? `
        <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
          <i class="fa fa-phone icon" style="margin-right: 5px;"></i>
          <p>${this.getContact(resume).phone_number}</p><br>
        </div>
      ` : ''}
      ${this.getContact(resume).linkedIn_profile?.length > 0 ? `
        <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
          <i class="fa fa-linkedin icon" style="margin-right: 5px;"></i>
          <a href="${this.getContact(resume).linkedIn_profile}" style="color: black;text-decoration: none;"> <p>${this.getContact(resume).linkedIn_profile}</p></a><br>
        </div>
      ` : ''}
      ${this.getContact(resume).github_profile?.length > 0 ? `
        <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
          <i class="fa fa-github icon" style="margin-right: 5px;"></i>
          <a  href="${this.getContact(resume).github_profile}" style="color: black;text-decoration: none;"> <p>${this.getContact(resume).github_profile}</p></a>
        </div>
      ` : ''}
        </div>
        </header>

    ${(this.getProfileSummary(resume).profile_summary?.length ?? 0) > 0 ? `
    <div class="summary trigger-area">
      <h2>Summary</h2>
      <p class="resume-summary" style="padding-top:12px !important">${this.getProfileSummary(resume).profile_summary ?? ''}</p>
    </div>
    ` : ''}
    ${(this.getSkills(resume)?.length ?? 0) > 0 ? `
    <div class="skills trigger-area">
      <h2>Skills</h2>
      <div  class="course-work-section-content">
        <ul  class="course-work-list" style="color:black !important;padding-left: 18px;">
        ${this.formatDefaultSKillWork(this.getSkills(resume))}
        </ul>
      </div>
    </div>
    ` : ''}
    ${(this.getProjects(resume)?.length ?? 0) > 0 ? `
    <div class="project trigger-area">
      <h2>Projects</h2>
      ${this.formatTemplate3Project(this.getProjects(resume))}
    </div>
    ` : ''}
    ${(this.getExperience(resume)?.length ?? 0) > 0 ? `
    <div class="experience trigger-area">
      <h2>Experience</h2>
      ${this.formatTemplate3Experience(this.getExperience(resume))}
    </div>
    ` : ''}
    ${(this.getEducation(resume)?.length ?? 0) > 0 ? `
    <div class="education trigger-area">
      <h2>Education</h2>
      ${this.formatTemplate3Education(this.getEducation(resume))}
    </div>
    ` : ''}
    </div>
</div>
    <body>
    </html>
    `
  }

  formatTemplate4Project(items : Array<Project>){
    return items.map((item : Project)=> `
         <div class="project-item">
              <div class="project-item-header">
                  <div class="project-item-header-left">
                      <p><a href="${item.project_link}" style="color:black;text-decoration: none;">${item.project_name}</a></p>
                  </div>
              </div>
              <div class="project-bullets">
                  <ul>
                  </ul>
              </div>
          </div>
    `).join('');
  }

  formatTemplate4Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
         <div class="experience-item">
              <div class="experience-item-header">
                  <div class="experience-item-header-left">
                      <p>${item.position_title}</p>
                      <p>${item.company_name}</p>
                  </div>
                  <div class="experience-item-header-right">
                      <p>${item.start_date} - ${item.end_date}, ${item.location}</p>
                  </div>
              </div>
              <div class="experience-bullets">
                  <ul>
                  </ul>
              </div>
          </div>
    `).join('');
  }

  formatTemplate4Education(items : Array<Education>){
    return items.map((item : Education)=> `
          <div class="education-details">
              <p>${item.degree}, ${item.field_of_study}</p>
              <p>${item.school_name} | ${item.graduation_date}</p>
          </div>
    `).join('');
  }


  getTemplate5HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
    // width: 100%; /* Make the container full width */
    // max-width: 940px; /* Limit maximum width */
    margin: auto;
    // position: relative;
    background-color: white;
    text-align: start !important;
}

// .body-container {
//     padding: 36px 36px 0px;
// }


.divider {
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.4);
}

.contact-details {
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap */
    margin: 0;
    padding: 0;
    text-align: start;
}

.contact-details p {
    margin: 0;
    margin-left: 12px;
    font-size: 12px;
}

.icon {
    color: black;
    font-size: 12px;
}

.summary {
    // margin-top: 20px;
}

.summary h2 {
    margin: 0;
    font-size: 20px;
    padding: 0;
    margin-bottom: 5px;
    font-weight: 500;
}

.summary p {
    font-size: 12px;
    margin: 0;
}

.education,
.skills {
}

.education h2,
.skills h2 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
    font-weight: 500;
}

.skills{
    ul{
        margin: 0;
        padding: 0;
    }
    li{
        margin: 0;
        padding: 0;
    }
    margin: 0;
    padding: 0;
}

.education-details,
.skills-bullets {
    margin-top: 12px;
    padding: 0 !important;
    ul, li{
        padding: 0;
    }
}

.education-details p,
.skills-bullets p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
}

.skills-bullets ul {
    list-style-type: disc;
    padding-left: 20px;
}

.skills-bullets li {
    font-size: 12px;
    margin-bottom: 5px;
}

.experience,
.project {
}

.experience h2,
.project h2 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
    font-weight: 500;
}

.experience-item,
.project-item {
}

.experience-item-header,
.project-item-header {
    display: flex;
    justify-content: space-between;
}

.experience-item-header-left,
.project-item-header-left {
    flex: 1;
    text-align: left;
}

.experience-item-header-right,
.project-item-header-right {
    flex: 1;
    text-align: right;
}

.experience-item-header-left p,
.project-item-header-left p,
.experience-item-header-right p,
.project-item-header-right p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
}

.experience-item-details,
.project-item-details {
    margin-top: 5px;
    opacity: 0.8;
}

.experience-bullets,
.project-bullets {
    margin-top: 12px;
}

.experience-bullets ul,
.project-bullets ul {
    list-style-type: disc;
    padding-left: 20px;
}

.experience-bullets li,
.project-bullets li {
    font-size: 12px;
    margin-bottom: 5px;
}

/* Media queries for responsiveness */
@media only screen and (max-width: 768px) {
    .resume-container {
        width: 100%; /* Make the container full width */
        height: auto; /* Allow height to adjust based on content */
    }

    .body-container {
        margin: 12px; /* Decrease margin for smaller screens */
    }

    .header h1 {
        font-size: 20px; /* Decrease font size for smaller screens */
    }

    .contact-details p,
    .icon {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .summary h2 {
        font-size: 16px; /* Decrease font size for smaller screens */
    }

    .summary p {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .education h2,
    .skills h2 {
        font-size: 16px; /* Decrease font size for smaller screens */
    }

    .education-details p,
    .skills-bullets p {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .experience h2,
    .project h2 {
        font-size: 16px; /* Decrease font size for smaller screens */
    }

    .experience-item-header-left p,
    .project-item-header-left p,
    .experience-item-header-right p,
    .project-item-header-right p {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .experience-bullets li,
    .project-bullets li {
        font-size: 12px; /* Decrease font size for smaller screens */
    }
}

.header {
    text-align: start;
    // padding: 20px 0;
    margin: 0;
    padding: 0;
}

.header h1 {
    white-space:0 pre-wrap;
    padding-bottom: 0px;
    font-family: 'Poppins', sans-serif;;
    text-transform: uppercase;
    color: black;
    // font-size: 34px;
    font-weight: 600 !important;
    font-size: 20px;
    margin-bottom: 4px;
}
      </style>
    </head>
    <body>
    <div class="resume-container">
    <div class="body-container">
        <header class="trigger-area">
            <div class="header">
                <h1>${this.getContact(resume).fname + ' ' + this.getContact(resume).lname}</h1>
            </div>
            <div class="contact-details">
                ${this.getContact(resume).email.length > 0?`
                <i class="fa fa-envelope"></i>
                <p>${this.getContact(resume).email}</p>
                ` : ''}
                ${this.getContact(resume).phone_number.length > 0?`
                <i class="fa fa-phone" style="margin-left: 12px;"></i>
                <p>${this.getContact(resume).phone_number}</p>
                ` : ''}
                ${this.getContact(resume).linkedIn_profile.length > 0?`
                <i class="fa fa-linkedin" style="margin-left: 12px;"></i>
                <a href="${this.getContact(resume).linkedIn_profile}"> <p>${this.getContact(resume).linkedIn_profile}</p></a>
                ` : ''}
                ${this.getContact(resume).github_profile.length > 0?`
                <i class="fa fa-github" style="margin-left: 12px;"></i>
                <a  href="${this.getContact(resume).github_profile}"> <p>${this.getContact(resume).github_profile}</p></a>
                  ` : ''}
            </div>
            </header>

        ${((resume as any).profileSummary?.profile_summary?.length ?? 0) > 0?`
        <div class="summary trigger-area">
            <h2>Summary</h2>
            <p class="resume-summary" >${(resume as any).profileSummary?.profile_summary ?? ''}</p>
        </div>
        ` : ''}
  ${this.getProjects(resume).length > 0?`
        <div class="project trigger-area">
            <h2>Projects</h2>
            ${this.formatTemplate5Project(this.getProjects(resume))}
        </div>
        ` : ''}
  ${this.getExperience(resume).length > 0?`
        <div class="experience trigger-area">
            <h2>Experience</h2>
            ${this.formatTemplate5Experience(this.getExperience(resume))}
        </div>

        ` : ''}
  ${this.getEducation(resume).length > 0?`
        <div class="education trigger-area">
            <h2>Education</h2>
            ${this.formatTemplate5Education(this.getEducation(resume))}
        </div>
        ` : ''}
  ${(this.getSkills(resume) && this.getSkills(resume).length > 0)?`
        <div class="skills trigger-area">
            <h2 style="margin: 0;padding: 0;">Skills</h2>
            <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
                <div style="width: 18%;margin: 0;padding: 0;">
                    
                </div>
                <div style="width: 82%;margin: 0;padding: 0;height: fit-content;">
                    <div class="skills-bullets">
                        <ul style="list-style-type: none;padding: 0;margin: 0;">
                            ${this.formatDefaultSKillWork(this.getSkills(resume))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
    </div>
</div>
    <body>
    </html>
    `
  }

  formatTemplate5Project(items : Array<Project>){
    return items.map((item : Project)=> `
        <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
                <div style="width: 18%;margin: 0;padding: 0;">
                    
                </div>
                <div style="width: 82%;margin: 0;padding: 0;">
                        <div class="project-item-header">
                            <div class="project-item-header-left">
                                <p><a href="${item.project_link}" style="color: black;text-decoration: none;"><strong>${item.project_name}</strong></a></p>
                            </div>
                        </div>
                        <div class="project-bullets">
                            <ul>
                            </ul>
                        </div>
                </div>
            </div>
    `).join('');
  }

  formatTemplate5Education(items : Array<Education>){
    return items.map((item : Education)=> `
        <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
              <div style="width: 18%;margin: 0;padding: 0">
                  <p style="font-size: 12px;">${item.graduation_date}</p>
              </div>
              <div style="width: 82%;margin: 0;padding: 0;">
                  <div class="education-details">
                      <p><strong>${item.degree}, ${item.field_of_study}, ${item.school_name}</strong></p>
                  </div>
              </div>
        </div>
    `).join('');
  }

  formatTemplate5Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
        <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
                <div style="width: 18%;margin: 0;padding: 0;">
                    <p style="font-size: 12px;">${item.start_date} - ${item.end_date}</p>
                </div>
                <div style="width: 82%;margin: 0;padding: 0;">
                        <div class="experience-item-header">
                            <div class="experience-item-header-left">
                                <p><strong>${item.position_title}, ${item.company_name}</strong></p>
                            </div>
                        </div>
                        <div class="experience-bullets">
                            <ul>
                            </ul>
                        </div>
                       
                </div>
            </div>
    `).join('');
  }

  getTemplate6HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
     <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
          font-family: 'Helvetica', sans-serif;
          font-size: 12px;
          text-align: start !important;
          margin : 0 !important;
      }

header {
    text-align: center;
    margin: 0px;
}
header h1 {
    font-size: 24px;
    margin: 0px;
    fornt-weight : 600 !important;
}
header p {
    font-size: 12px;
    margin: 2px 0;
}
section {
    margin: 0px;
}
.section-header {
    font-size: 12px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px;
    margin-bottom: 0px;
    font-weight: 500;
}
    h3{
    font-size:12px ;
    font-weight: 500;
    }
ul {
    list-style-type: disc;
    margin-left: 16px;
}
.experience, .education, .skills, .projects {
    margin-bottom: 5px;
}
.experience h3, .education h3, .skills h3, .projects h3 {
    font-size: 12px;
    margin: 0;
}
.experience p, .education p, .skills p, .projects p {
    margin: 0;
}
.experience ul, .education ul, .skills ul, .projects ul {
    margin-top: 0px;
}
    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
      }

      .course-work-lisit-item{
        flex: 0 0 25%;
        font-size: 12px;
         padding-bottom:5px !important;
      }

      .course-work-list{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        text-align:left;
      }
      </style>
    </head>
    <body>
    
<div class="resume-container">
    <header class="trigger-area">
        <h1 style="font-weight:300 !important">${(resume as any).contact.fname + ' ' + (resume as any).contact.lname}</h1>
        <p>${(resume as any).contact.email} | ${(resume as any).contact.phone_number}</p>
        <p><a href="${(resume as any).contact.linkedIn_profile}"> LinkedIn Profile</a> | <a  href="${(resume as any).contact.github_profile}"> Github Profile</a></p>
    </header>
    <section class="trigger-area">
        <h2 class="section-header">Objective</h2>
        <p>${(resume as any).profileSummary?.profile_summary ?? ''}</p>
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Experience</h2>
        ${this.formatTemplate7Experience((resume as any).experience ?? (resume as any).experienceList ?? [])}
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Skills</h2>
         <div  class="course-work-section-content">
              <ul  class="course-work-list" style="color:black !important;padding-left: 23px;">
                ${this.formatDefaultSKillWork(this.getSkills(resume))}
              </ul>
            </div>
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Projects</h2>
        ${this.formatTemplate7Project((resume as any).project ?? (resume as any).projectList ?? [])}
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Education</h2>
      ${this.formatTemplate7Education((resume as any).education ?? (resume as any).educationList ?? [])}
    </section>
</div>

    <body>
    </html>
    `
  }

  getTemplate7HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
     <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
    font-family: 'Arial', sans-serif;
    color: #333;
    text-align: start !important;
    font-size:12px;
}
header {
    text-align: left;
    margin-bottom: 12px;
}
header h1 {
    font-size: 24px;
    margin-bottom: 5px;
    color: #000;
    font-weight: 600 !important
}
header p {
    font-size: 12px;
    margin: 2px 0;
}
section {
    // margin-bottom: 12px;
}
h2 {
    font-size: 12px;
    color: #000;
    font-weight: 600 !important
}
h3 {
    font-size: 12px;
    margin: 5px 0;
    color: #333;
    font-weight:500;
}
ul {
    list-style-type: disc;
    margin-left: 20px;
    margin-top:5px;
}
.experience, .education, .skills, .projects {
    margin-bottom: 5px;
}
.experience p, .education p, .skills p, .projects p {
    margin: 2px 0;
}
    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
      }

      .course-work-lisit-item{
        flex: 0 0 25%;
        font-size: 12px;
         padding-bottom:5px !important;
      }

      .course-work-list{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        text-align:left;
      }
      </style>
    </head>
    <body>
    <div class="resume-container">
    <header class="trigger-area">
        <h1 style="font-weight: 300 !important">${(resume as any).contact.fname + ' ' + (resume as any).contact.lname}</h1>
        <p>${(resume as any).contact.email} | ${(resume as any).contact.phone_number}</p>
        <p><a href="${(resume as any).contact.linkedIn_profile}"> LinkedIn Profile</a> | <a  href="${(resume as any).contact.github_profile}"> Github Profile</a></p>
    </header>
    <section class="trigger-area" style="margin:0px;margin-top:20px">
        <h2 style="margin:0px; margin-bottom:12px;">Objective</h2>
        <p style="margin:0px">${(resume as any).profileSummary?.profile_summary ?? ''}</p>
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px;">Experience</h2>
        ${this.formatTemplate7Experience((resume as any).experience ?? (resume as any).experienceList ?? [])}
    </section>
        <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px; margin-bottom:12px;">Skills</h2>
        <div  class="course-work-section-content">
              <ul  class="course-work-list" style="padding-left: 20px;color:#333">
                ${this.formatDefaultSKillWork((resume as any).skill ?? [])}
              </ul>
            </div>
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px">Projects</h2>
        ${this.formatTemplate7Project((resume as any).project ?? (resume as any).projectList ?? [])}
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px">Education</h2>
        ${this.formatTemplate7Education((resume as any).education ?? (resume as any).educationList ?? [])}
    </section>
</div>

    <body>
    </html>
    `
  }

  formatTemplate7Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
            <div class="experience" style="margin : 12px 0">
            <h3 style="font-size:12px">${item.position_title}</h3>
            <p style="opacity : 0.8; margin-top : 5px">${item.company_name}, ${item.start_date} - ${item.end_date}</p>
            <ul style="margin:0px">
            </ul>
            </div>
    `).join('');
  }

  formatTemplate7Project(items : Array<Project>){
    return items.map((item : Project)=> `
            <div class="projects" style="margin : 12px 0">
                <h3 style="font-size:12px">${item.project_name}</h3>
                <ul style="margin:0px">
                </ul>
            </div>
    `).join('');
  }

  formatTemplate7Education(items : Array<Education>){
    return items.map((item : Education)=> `
            <div class="education" style="margin : 12px 0">
                <h3>${item.school_name},  ${item.school_location}</h3>
                <p>${item.field_of_study},  ${item.degree},  ${item.graduation_date}</p>
            </div>
    `).join('');
  }

  getTemplate8HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
          .resume-container {
    font-family: 'Tahoma', sans-serif;
    font-size: 12px;
    color: #333;
    text-align: start !important;
}
.header {
    text-align: center;
    margin-bottom: 20px;
}
.header h1 {
    font-size: 20px;
    margin-bottom: 5px;
    color: #000;
    font-weight : 500 !important
}
.header p {
    font-size: 12px;
    margin: 2px 0;
}
.section {
    margin-bottom: 20px;
}
.section-title {
    font-size: 12px;
    color: #000;
    margin-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px;
    display:flex;
    justify-content:center;

    
    align-items:center;
}
.job-title {
    font-size: 12px;
    margin: 5px 0;
    font-weight : 300 !important
}
    h3{
    font-size: 12px;
    margin: 5px 0;
    font-weight : 300 !important
    }
.company-duration {
    font-size: 12px;
    margin: 2px 0;
    color: #666;
}
ul {
    list-style-type: square !important;
    margin-left: 12px;
    margin-top:5px !important;
}
.skills ul, .projects ul {
    list-style-type: disc;
}

.course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
      }

      .course-work-lisit-item{
        flex: 0 0 25%;
        font-size: 12px;
         padding-bottom:5px !important;
      }

      .course-work-list{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        text-align:left;
        list-style-type: square;
      }
      </style>
    </head>
    <body>
      <div class="resume-container">
    <div class="header trigger-area">
        <h1 style="font-weight: 300 !important">${(resume as any).contact.fname + ' ' + (resume as any).contact.lname}</h1>
        <p>${(resume as any).contact.email} | ${(resume as any).contact.phone_number}</p>
        <p><a href="${(resume as any).contact.linkedIn_profile}"> LinkedIn Profile</a> | <a  href="${(resume as any).contact.github_profile}"> Github</a></p>
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Professional Summary</div>
        <p>${(resume as any).profileSummary?.profile_summary ?? ''}</p>
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Experience</div>
        ${this.formatTemplate8Experience((resume as any).experience ?? (resume as any).experienceList ?? [])}
    </div>
        <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Technical Skills</div>
       <div  class="course-work-section-content">
              <ul  class="course-work-list" style="color:black !important;padding-left: 40px;">
                ${this.formatDefaultSKillWork((resume as any).skill ?? [])}
              </ul>
            </div>
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Projects</div>
        ${this.formatTemplate8Project((resume as any).project ?? (resume as any).projectList ?? [])}
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Education</div>
        ${this.formatTemplate8Education((resume as any).education ?? (resume as any).educationList ?? [])}
    </div>
</div>

    <body>
    </html>
    `
  }

  formatTemplate8Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
            <div class="experience">
            <div class="job-title"> <b>${item.position_title}</b></div>
            <div class="company-duration">${item.company_name} | ${item.start_date} - ${item.end_date}</div>
            <ul style="padding:0;margin:0px; padding-left: 50px;">
            </ul>
            </div>
    `).join('');
  }

  formatTemplate8Project(items : Array<Project>){
    return items.map((item : Project)=> `
            <div class="projects" style="margin : 12px 0">
                <div class="job-title"><b>${item.project_name}</b></div>
                <ul style="padding:0;margin:0px; padding-left: 50px;">
                </ul>
            </div>
    `).join('');
  }

  formatTemplate8Education(items : Array<Education>){
    return items.map((item : Education)=> `
          <div class="education">
            <div class="job-title">${item.school_name}, ${item.school_location}</div>
            <div class="company-duration">${item.field_of_study}, ${item.degree}, ${item.graduation_date}</div>
        </div>
    `).join('');
  }



  // ------------------------------------------------- Updated Templates -------------------------------------------


  getTemplate1HTMLV1(resumeForm: any) {
    const renderSections = () => {
      return (resumeForm.sections as any[])?.filter(s => s.isAdded).map(section => {
        const normalizer = TEMPLATE_1_EXPORT_NORMALIZERS[section.section];
        if (normalizer) {
          return normalizer(section, resumeForm, this) || '';
        } else {
          console.warn(`Unsupported export section type: ${section.section}`);
          return '';
        }
      }).join('');
    };

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
    <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        .resume-contact-us{
          text-align: left !important;
          margin: 0px;
          padding: 0px;
        }

        .profile-full-name{
            font-family: 'Poppins', sans-serif;
            text-transform: uppercase;
            font-weight: 500 !important;
            font-size: 28px;
            margin: 0px !important;
            padding:0px !important;
            text-align: left;
            width:100%;
          }
        
          .profile-sub-title{
            font-size: 16px;
            font-weight: 400;
            margin: 0px !important;
            text-align: left;
            width: 100%;
          }

          .profile-contact-details-list{
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
          }

          .skills-content {
            display: flex;
            flex-wrap: wrap;
            column-gap: 20px;
            row-gap: 10px;
            margin-left: 12px;
        }
         .skill-category span {
            font-weight: bold;
        }

        .skill-category {
            flex: 1 1 calc(50% - 20px); /* Two columns */
            list-style-type: disc;
            margin: 0;
            padding: 0;
        }
        .skill-category li {
            margin-bottom: 5px;
            font-size: 12px;
        }

          .contact-li{
                white-space: pre-wrap;
                font-size: 10px;
                display: flex;
                width: auto;
                margin-left: 1px;
                padding-right: 5px !important;
                padding-left: 2px;
                justify-content: center;
                align-items: center;  
                i{
                  color:  black;
                }
                span{
                    color: black;
                }
              }

        .contact-a{
                  text-decoration: underline;
                  white-space: pre-wrap;
                  font-size: 10px;
                  display: flex;
                  width: auto;
                  margin-left: 1px;
                  justify-content: center;
                  align-items: center;  
                }
        
        .contact-detail-icon{
            font-size: small;
            font-style: normal !important;
            font-variant: normal !important;
            font-weight: 400 !important;
            text-transform: none !important;
            -webkit-font-smoothing: antialiased;
        }
        
        a{
          text-decoration: underline;
        }
        
        .resume-education{
            text-align: left;
            margin-bottom: 12px;
            .education-section-title{
              font-weight: 400;
              color: black;
              text-transform: uppercase;
              border-bottom: 1px solid rgba(101, 105, 109, .5);
              white-space: pre-wrap;
              padding-bottom: 1px;
              font-size: 1rem;
              height: 25px !important;
              width: 100%;
              display: block;
              text-align: left;
              font-family: 'Poppins', sans-serif;
        
            }
            
            .education-section-content{
                padding: 0px 0px;
                border-radius: 5px;
                color: black;
                text-align: left;
        
              p{
                font-size: 12px;
                font-weight: 400;
                padding: 3px 0px;
                font-family: 'Poppins', sans-serif ;
                color: black;
                white-space: pre-wrap;
              }
            }
          
        
            &:hover{
              .add-education-icon{
                display: block;
                cursor: pointer;
                font-size: small;
              }
            }
          
          
        }
        
        .course-work{
          text-align: left;
          margin-bottom: 12px;
          .course-work-section-title{
            font-weight: 600;
            color: black;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(101, 105, 109, .5);
            white-space: pre-wrap;
            padding-bottom: 1px;
            font-size: 16px;
            width: 100%;
            display: block;
            text-align: left;
            font-family: 'Poppins', sans-serif;
          }
        
          .course-work-section-content{
            padding: 6px 0px;
            border-radius: 5px;
            color: black;
            text-align: left;
        
            p{
              font-size: 12px;
              font-weight: 400;
              padding: 3px 0px;
              font-family: 'Poppins', sans-serif ;
              color: black;
              white-space: pre-wrap;
            }
        
            ol,ul{
              padding-left: 1.09rem !important;
              margin: 0 !important;
              li{
                font-size: 12px;
                font-weight: 400;
                padding: 3px 0px;
                font-family: 'Poppins', sans-serif ;
                color: black;
                white-space: pre-wrap;
              }
            }
        

        }
        
        }

        .course-work-list{
            display: flex;
            flex-wrap: wrap;
            font-size: 1rem;
            text-align:left;
          }

        .course-work-lisit-item{
              flex: 0 0 25%;
            }
        
        .project-content ol {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ol li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content ul {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ul li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content p {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
        
        
        
        .resume-summary{
          text-align: left;
          margin-bottom: 12px;
        }
        
        .summary-section-title{
          font-weight: 400;
          color: #384347;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(101, 105, 109, .5);
          white-space: pre-wrap;
          padding-bottom: 8px;
          font-size: 16px;
          display: block;
          text-align: left;
        }
        
        .resume-summary-text{
          white-space: pre-wrap;
          text-align: left;
          font-size: 12px;
          font-weight: 400;
          padding: 6px 0px;
          font-family: 'Poppins', sans-serif ;
          color: #384347;
          margin: 0 !important;
        }
        
        
        .Section-header {
          font-size: 20px !important; /* Bold and prominent */
          font-weight: bold;
          color: #333; /* Strong, professional color */
          /* Underline with accent color */
          margin-bottom: 8px;
          padding-bottom: 4px;
        }
        
        /* Section Item Header (e.g., Job Title, Company Name) */
        .section-item-header {
          font-size: 18px !important; /* Emphasized for clarity */
          font-weight: bold;
          color: #444; /* Slightly muted compared to section header */
          margin-bottom: 5px;
        }
        
        /* Section Item Content (e.g., Job Description, Achievements) */
        .section-item-content {
          font-size: 12px !important; /* Standard content size */
          color: #555; /* Regular text color */
          margin-bottom: 10px;
        }
        
        .section-item-content ul {
          list-style-type: disc;
          margin-left: 20px;
          padding-left: 0;
        }
        
        .section-item-content li {
          margin-bottom: 5px;
        }

        li::marker{
            font-size: 8px !important; /* Adjust the size of the bullet point here */
            color: #000; /* You can also change the color of the bullet */
        }

        .education-p{
            color: #000;
            display: flex;
            font-size: 12px;
        }
        .education-p p{
            color: #000;
            padding: 0 2.5px;
            margin: 0;
            font-size: 12px;
        }
        
    </style>
    </head>
    <body>
      <div class="container">${renderSections()}</div>
    </body>
    </html>
    `;
  }


  public formatHTMLTemplate1EducationV1(items : Education[]) : string{
    return items.map((item : Education)=> 
    `
    <div class="education-section-content template1-section-content trigger-area" style="margin-top:7px;">
        <div style="display: flex;justify-content: space-between;">
            <div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            ${(item.degree.length > 0 && item.field_of_study.length >0) ?
                `
                <p class="qualification-name" style="margin:0;padding:0;"><b>${item.degree}, ${item.field_of_study}</b></p>
                ` : ''
            }
            ${(item.degree.length > 0 && item.field_of_study.length == 0)?
                `
                <p class="qualification-name" style="margin:0;padding:0;"><b>${item.degree}</b></p>
                ` : ''
            }
            ${(item.field_of_study.length>0 && item.degree.length == 0)?
                `
                <p class="qualification-name" style="margin:0;padding:0;"><b>${item.field_of_study}</b></p>
                ` : ''
            }
            </div>
            ${item.school_location.length > 0?
                `
            <div style="flex: 1;text-align: right;margin:0;padding:0;" class="project-content">
                <p class="qualification-name" style="margin:0;padding:0;">${item.school_location}</p></div>
            </div>
            ` : ''
            }
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
            ${item.school_name.length > 0?
                `
            <div style="flex: 1;text-align: left;margin:0;padding:0;">
            <p class="qualification-name" style="margin:0;padding:0;">${item.school_name}</p></div>
            ` : ''
            }
            ${item.graduation_date.length > 0?
                `
            <div style="flex: 1;text-align: right;margin:0;padding:0;" class="project-content">
            <p class="qualification-name" style="margin:0;padding:0;">${item.graduation_date}</p></div>
            ` : ''
            }
        </div>
        ${item.gpa.length > 0?
            `
        <div style="margin:0;padding:0;">
            <div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            <p class="qualification-name" style="margin:0;padding:0;">GPA - ${item.gpa}</p></div>
        </div>
        ` : ''
        }
    </div>
    `).join('');
  }


  public formatHTMLTemplate1SkillWorkV1(items : Skill[]) : string{
    return items.map((item : Skill)=> 
    `
    ${items.length > 0 ?
        `
    <li class="course-work-lisit-item" style="margin:0;padding:0;">${item.name}</li>
    ` : ''
    }
    `).join('');
  }

    public formatHTMLTemplate1CourseWorkV1(items : courseWork[]) : string{
    return items.map((item : courseWork)=> 
    `
    ${item.courseworkname && item.courseworkname.length > 0 ?
        `
    <li class="course-work-lisit-item" style="margin:0;padding:0;">
      <div class="course-name" style="font-weight: 600;">${item.courseworkname}</div>
      ${item.institution ? `<div class="course-institution" style="font-size: 0.9em; color: #666; font-style: italic;">${item.institution}</div>` : ''}
    </li>
    ` : ''
    }
    `).join('');
  }


  public formatHTMLTemplate1ProjectV1(items : Project[]) : string{
    return items.map((item : Project)=> 
  {
    const projectName = item?.project_name ?? '';
    const projectLink = item?.project_link ?? '';
    const technologiesUsed = item?.technologies_used ?? '';
    const description = item?.description ?? '';

    return `
    <div  class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px;">
    ${projectName.length > 0?
            `
          <div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            <div class="education-p">
        ${projectName.length > 0 && projectLink.length > 0?
                `
          <p style="margin:0;padding:0;"><a style="color:#000000DE" href="${projectLink}"><b>${projectName}</b></a></p>
                ` : ''
                }
        ${projectName.length > 0 && projectLink.length === 0?
                `
          <p style="margin:0;padding:0;"><b>${projectName}</b></p>
                ` : ''
                }
        ${projectName.length > 0 && technologiesUsed.length > 0?
                `
                    <p>|</p>
                ` : ''
                }
        ${technologiesUsed.length > 0?
                `
          <p>${technologiesUsed}</p>
                ` : ''
                }
            </div> 
        </div>
        ` : ''
        }
        <div class="project-content-container" style="margin:0;padding:0;">
        <div class="project-content">
            ${
        description
            }
        </div>
        </div>
    </div>
  `;
  }).join('');
  }


  public formatHTMLTemplate1ExperienceV1(items : Experience[]) : string{
    return items.map((item : Experience)=> 
    `
    <div class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
            <p style="flex: 1;text-align: left;margin: 0;padding:0;"><b>${item.position_title}</b>, ${item.company_name}</span></p>
            ${item.start_date.length > 0?
            `
            <p style="flex: 1;text-align: right;margin:0;padding:0;">${item.start_date} - ${item.end_date}</p>
            ` : ''
            }
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


  public formatHTMLTemplate1CertificationV1(items : Certification[]) : string{
    return items.map((item : Certification)=> 
    `
    <div class="course-work-section-content template1-section-content trigger-area" style="margin-top:5px;">
          <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p style="flex: 1;text-align: left;margin: 0;padding:0;"><a href="${item.url}" style="margin: 0;padding: 0;color:#000000DE">${item.name}</a>, ${item.authority}</p>
          <p style="flex: 1;text-align: right;margin:0;padding:0;">${item.date}</p>
          </div>
      </div>
    `).join('');
  }


  getTemplate9HTMLV1(resumeForm : any){
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <title>Resume</title>
      <style>
        .container {
            margin: 0;
            //font-family: Arial, sans-serif;
            color: #333;
            box-sizing: border-box;
        }

      /* Layout */
      .container {
          box-sizing: border-box;
          background-color: #fff;
      }

      .main-content {
          display: grid;
          grid-template-columns: 65% 35%;
          gap: 10px; /* Adjust the gap between columns as needed */
      }

      .sidebar {
          display: block;
          padding: 15px;
          background-color: rgb(242, 246, 248);
          border-radius: 5px;
      }


      .header {
          grid-column: 1 / -1;
          text-align: left;
          padding-bottom: 0;
          margin-bottom: 10px;
      }

      .header-h1 {
          margin: 0;
          font-weight: 500 !important;
          font-size: 32px;
          color: #2a7ae4;
      }

      .header-title {
          color: #555;
          margin: 5px 0px 5px 0px;
          font-size: 18px;
          font-weight: 400;
      }

      .header-summary {
          font-size: 12px;
          font-weight: 400;
          color: #666;
          margin: 0px;
      }

      .work-experience{
          padding-right: 15px;
          padding-left: 0;
          padding-top: 0;
          padding-bottom: 0;
      }

      .work-experience-h2 {
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin: 0;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      }

      .job {
          margin-bottom: 8px;
          gap: 10px;
          align-items: start;
      }

      .job-h3 {
          font-size: 12px;
          font-weight: 400;
          margin: 0;
      }

      .job-date {
          font-size: 12px;
          font-weight: 400;
          color: #777;
          margin: 0;
      }

      .job-company {
          font-size: 12px;
          font-weight: 400;
          color: #555;
          margin-bottom: 10px;
          grid-column: 1 / -1;
          margin: 0;
      }

      .job-ul {
          margin: 0;
          padding-left: 20px;
          grid-column: 1 / -1;
          margin: 0;
      }

      .job-ul-li {
          font-size: 12px;
          font-weight: 400;
          margin-bottom: 5px;
      }

      .contact-ul
      {
          margin: 0;
          padding: 5px 17px;
      }
      
      .skills-ul {
          margin: 0;
          padding: 5px 17px;
      }

      .contact-ul-li{
          margin-bottom: 3px;
          font-size: 12px;
          font-weight: 400;
      }

      .skills-ul-li {
          margin-bottom: 3px;
          font-size: 12px;
          font-weight: 400;
      }

      .contact-ul-li-a {
          color: #2a7ae4;
          text-decoration: none;
      }

      .skills-h2{
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      } 
      
      .education-h2{
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      }
       
      .contact-h2{
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      }

      .skill-item{
          margin-top: 5px;
          margin-bottom: 0;
          font-size: 12px;
          font-weight: 400;
      }

      .contact-h2{
          margin-top: 0;
      }

      .education {
          margin-top: 20px;
      }

      .education-p {
          margin: 5px 0;
          font-size: 12px;
          font-weight: 400;
      }

      .skill-items{
          display:flex;
          flex-wrap: wrap;
          gap: 5px;
      }

      .skill-item{
          padding: 5px 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          font-size: 12px;
          font-weight: 400;
      }

      .project-content ol {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ol li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content ul {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ul li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content p {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
    </style>
    </head>
    <body>
    <div class="container">    
        <div class="main-content">
            <section class="work-experience">
                <div class="header">
                    <h1 class="header-h1">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</h1>
                    ${resumeForm.contact.subTitle.length > 0 ?
                    `
                    <p class="header-title">${resumeForm.contact.subTitle}</p>
                    ` : ''}
                    ${resumeForm.profileSummary.profile_summary.length > 0 && resumeForm.isSectionPresent?.isSummary ? 
                    `
                    <div class="project-content">
                    ${resumeForm.profileSummary.profile_summary}
                    </div>
                    ` : ''}
                </div>
                ${resumeForm.experience.length > 0 && resumeForm.isSectionPresent?.isExperience? 
                `
                <h2 class="work-experience-h2">Work Experience</h2>
                ${this.formatHTMLTemplate9Experience(resumeForm.experience)}
                ` : ''}

                ${resumeForm.project.length > 0 && resumeForm.isSectionPresent?.isProject?
                `
                <h2 class="work-experience-h2">Project</h2>
                ${this.formatHTMLTemplate9Project(resumeForm.project)}
                ` : ''
                }
            </section>

            <div class="sidebar">
                ${resumeForm.isSectionPresent?.isContact?
                `
                <section class="contact">
                    <h2 class="contact-h2">Contact</h2>
                    <ul class="contact-ul">
                        ${resumeForm.contact.phone_number.length > 0?
                        `
                        <li class="contact-ul-li">${resumeForm.contact.phone_number}</li>
                        ` : ''
                        }
                        ${resumeForm.contact.email.length > 0?
                        `
                        <li class="contact-ul-li"><a href="mailto:${resumeForm.contact.email}" class="contact-ul-li-a">${resumeForm.contact.email}</a></li>
                        ` : ''
                        }
                        ${resumeForm.contact.linkedIn_profile.length > 0?
                        `
                        <li class="contact-ul-li"><a href="${resumeForm.contact.linkedIn_profile}" class="contact-ul-li-a">${resumeForm.contact.linkedIn_profile_display_name}</a></li>
                        ` : ''
                        }
                        ${resumeForm.contact.github_profile.length > 0?
                        `
                        <li class="contact-ul-li"><a href="${resumeForm.contact.github_profile}" class="contact-ul-li-a">${resumeForm.contact.github_profile_display_name}</a></li>
                        ` : ''
                        }
                    </ul>
                </section>
                ` : ''
                }

                ${resumeForm.isSectionPresent?.isCourseWork && resumeForm.courseWork.length > 0?
                `
                <section class="skills">
                    <h2 class="skills-h2">Courseworks</h2>
                    <div class="skill-items">
                        ${this.formatHTMLTemplate9CourseWork(resumeForm.courseWork)}
                    </div>
                </section>
                ` : ''
                }

                ${resumeForm.isSectionPresent?.isSkill && resumeForm.skill.length > 0?
                `
                <section class="skills">
                    <h2 class="skills-h2">Skills</h2>
                    <div class="skill-items">
                        ${this.formatHTMLTemplate9SkillWork(resumeForm.skill)}
                    </div>
                </section>
                ` : ''
                }

                ${resumeForm.education.length > 0 && resumeForm.isSectionPresent?.isEducation?
                `
                <section class="education">
                    <h2 class="education-h2">Education</h2>
                    ${this.formatHTMLTemplate9Education(resumeForm.education)}
                </section>
                ` : ''
                }

                ${(resumeForm.certificationBulletPoints.point.length > 0 && resumeForm.isSectionPresent?.isSkillsCategory)?
                `
                <section class="skills">
                    <h2 class="skills-h2">Certifications</h2>
                    <div class="project-content">
                    ${resumeForm.certificationBulletPoints.point}
                    </div>
                </section>
                ` : ''
                }

                ${!resumeForm.achievementBulletPoints.isDefault && resumeForm.isSectionPresent?.isAchievement?
                    `
                    <section class="skills">
                        <h2 class="skills-h2">Achievements</h2>
                        <div class="project-content">
                        ${resumeForm.achievementBulletPoints.ach}
                        </div>
                    </section>
                    ` : ''
                }
            </div>
        </div>
    </div>
    </body>
    </html>
    `
  }

  public formatHTMLTemplate9Experience(items : Experience[]) : string{
    return items.map((item : Experience)=> 
    `
    <div class="job">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p  class="job-h3" style="flex: 1;text-align: left;margin: 0;padding:0;margin-bottom:5px;"><b>${item.position_title}</b></p>
          <p class="job-date" style="flex: 1;text-align: right;margin:0;padding:0;">${item.start_date} - ${item.end_date}</p>
        </div>
        <p class="job-company" style="margin:0;padding:0;margin-bottom:5px;">${item.company_name}, ${item.location}</p>
        <div class="project-content">
        ${item.description}
        </div>
    </div>
    `).join('');
}


public formatHTMLTemplate9Project(items : Project[]) : string{
    return items.map((item : Project)=> 
    `
    <div class="job">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p  class="job-h3" style="flex: 1;text-align: left;margin: 0;padding:0;margin-bottom:5px;"><a href="${item.project_link}" style="color:black;text-decoration: none;"><b>${item.project_name}</b></a></p>
        </div>
        <p class="job-company" style="margin:0;padding:0;margin-bottom:5px;">${item.technologies_used}</p>
        <div class="project-content">
        ${item.description}
        </div>
    </div>
    `).join('');
}


public formatHTMLTemplate9SkillWork(items : Skill[]) : string{
    return items.map((item : Skill)=> 
    `
    <div class="skill-item">
        ${item.name}
    </div>
    `).join('');
}

public formatHTMLTemplate9CourseWork(items : courseWork[]) : string{
    return items.map((item : courseWork)=> 
    `
    <div class="skill-item">
        <div class="course-name" style="font-weight: 600;">${item.courseworkname}</div>
        ${item.institution ? `<div class="course-institution" style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 2px;">${item.institution}</div>` : ''}
    </div>
    `).join('');
}

public formatHTMLTemplate9Education(items : Education[]) : string{
    return items.map((item : Education)=> 
    `
    <div class="edu-item project-content" style="margin-bottom: 5px;">
        <p><b>${item.school_name}</b></p>
        <p>${item.degree}, ${item.field_of_study}</p>
        <p>${item.school_location} - ${item.graduation_date}</p>
    </div>
    `).join('');
}

/**
 * Provide a default formatter used across several templates to render skill lists.
 * Accepts arrays of Skill objects or simple string arrays and returns <li> elements.
 */
public formatDefaultSKillWork(items: Skill[] | string[] = []): string {
    const list = (items ?? []);
    return list.map((s: any) => {
    const name = typeof s === 'string' ? s : s?.name ?? s?.skill ?? s?.title ?? s?.value ?? '';
        return name ? `<li class="course-work-lisit-item" style="margin:0;padding:0;">${name}</li>` : '';
    }).join('');
}

public formatTemplate10HTML(resumeForm : Resume){
  const skillV2List: SkillV2[] = (resumeForm as any).skill_v2 ?? (resumeForm.sections?.find(s => s.section === 'SKILLS_CATEGORY')?.items?.map(i => i.data) ?? []);
  let firstHalfSkills = [...skillV2List.slice(0, Math.ceil(skillV2List.length/2))];
  let secondHalfSkills = [...skillV2List.slice(Math.ceil(skillV2List.length/2))];
  const contact = resumeForm.sections?.find(s => s.section === 'CONTACT')?.items?.[0]?.data ?? { fname: '', lname: '', address: '', phone_number: '', email: '', linkedIn_profile:'', linkedIn_profile_display_name:'', github_profile:'', github_profile_display_name:'', subTitle: '' };
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
      <style>
        .container {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            opacity: 0.85;
        }
        .header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
            border-bottom: 2px solid #39A5B7;
            width: 100%;
            font-family: 'Merriweather', sans-serif;
        }
        .contact {
            font-size: 10px;
            color: #000;
            padding-bottom: 5px;
            display: flex;
        }
        .contact p{
            font-size: 10px;
            padding: 0px 2.5px;
            margin: 0;
        }
        .section {
            margin-top: 10px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px !important;
            padding-bottom: 2px;
            display: flex;
            align-items: flex-start;
        }
        .education .degree {
            font-style: italic;
            font-weight: normal;
        }
        .education-p{
            color: #000;
            display: flex;
            font-size: 12px;
        }
        .education-p p{
            color: #000;
            padding: 0 2.5px;
            margin: 0;
            font-size: 12px;
        }
        .experince p{
            color: #000;
            font-size: 12px;
        }
        .skills-content {
            display: flex;
            flex-wrap: wrap;
            column-gap: 20px;
            row-gap: 10px;
            margin-left: 12px;
        }
        .skill-category {
            flex: 1 1 calc(50% - 20px); /* Two columns */
            list-style-type: disc;
            margin: 0;
            padding: 0;
        }
        .skill-category li {
            margin-bottom: 5px;
            font-size: 12px;
        }
        .experince ul{
            padding: 0;
            margin-left: 12px;
            margin-top: 5px;
            margin-bottom: 0;
        }
        .experince li{
            margin-bottom: 5px;
            font-size: 12px;
        }
        .experince li::marker{
            font-size: 8px; /* Adjust the size of the bullet point here */
            color: #000; /* You can also change the color of the bullet */
        }
        .experince p{
            font-size: 12px;
            margin: 0;
        }
        .skill-category li::marker {
            font-size: 8px; /* Adjust the size of the bullet point here */
            color: #000; /* You can also change the color of the bullet */
        }
        .skill-category span {
            font-weight: bold;
            font-style: italic;
        }

        .experience-container{
          display: flex;
          flex-direction: column;
        }

        .project-content ol {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ol li {
          font-size: 12px;
          font-weight: 400;
          padding: 0px 0px 0px 0px;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content ul {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ul li {
          font-size: 12px;
          font-weight: 400;
          padding: 0px 0px 0px 0px;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content p {
          font-size: 12px;
          font-weight: 400;
          padding: 0px 0px 0px 0px;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
        
        .project-content a {
          font-size: 12px;
          font-weight: 400;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
      </style>
  </head>
      <div class="container">
    
      <div class="header">
        <div class="name">${contact.fname + ' ' + contact.lname}</div>
        <div class="contact">
        ${contact.address?.length > 0?
        `
        <p style="padding-left: 0;">${contact.address}</p>
        ` : ''
        } 
        ${contact.phone_number?.length > 0 && contact.address?.length > 0?
        `
        <p>|</p>   
        ` : ''
        }
        ${contact.phone_number?.length > 0?
        `
        <p>${contact.phone_number}</p>
        ` : ''
        }
        ${contact.email?.length > 0?
        `
        <p>|</p>
        ` : ''   
        }
        ${contact.email?.length > 0?
        `
        <p>${contact.email}</p>
        ` : ''
        }
        ${contact.linkedIn_profile?.length > 0?
        `
        <p>|</p>   
        ` : ''
        }
        ${contact.linkedIn_profile?.length > 0?
        `
        <p><a href="${contact.linkedIn_profile}" target="_blank" style="color: #39A5B7; text-decoration: none;">${contact.linkedIn_profile_display_name}</a></p>
        ` : ''
        }
  ${contact.github_profile?.length > 0?
  `
  <p>|</p>   
  ` : ''
  }
  ${contact.github_profile?.length > 0?
  `
  <p><a href="${contact.github_profile}" target="_blank" style="color: #39A5B7; text-decoration: none;">${contact.github_profile_display_name}</a></p>
  ` : ''
  }
        </div>
    </div>
    </div>

    ${(resumeForm.sections?.find(s => s.section === 'PROFILE_SUMMARY')?.items?.[0]?.data?.profile_summary?.length ?? 0) > 0 && resumeForm.isSectionPresent?.isSummary?
      `
      <div class="section">
        <span class="section-title">Profile Summary</span>
        <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
              ${
                resumeForm.sections.find(s => s.section === 'PROFILE_SUMMARY')?.items?.[0]?.data?.profile_summary
              }
          </div>
          </div>
      </div>
      ` : ''
    }


    ${(resumeForm.sections?.find(s => s.section === 'EDUCATION')?.items?.length ?? 0) > 0 && resumeForm.isSectionPresent?.isEducation?
    `
    <div class="section education">
      <div class="section-title">Education</div>
      ${this.formatEducationTemplate10(resumeForm.sections.find(s => s.section === 'EDUCATION')?.items?.map(i => i.data) ?? [])}
    </div>
    `: ''
    }

    ${(resumeForm.sections?.find(s => s.section === 'SKILLS_CATEGORY')?.items?.length ?? 0) > 0 && resumeForm.isSectionPresent?.isSkillV2?
      `
    <div class="section skills">
      <div class="section-title">Skills</div>
      <div class="skills-content">
        <ul class="skill-category">
        ${this.formatSkillsTemplate10(firstHalfSkills)}
        </ul>
        <ul class="skill-category">
          ${this.formatSkillsTemplate10(secondHalfSkills)}
        </ul>
      </div>
    </div>
    ` : ''
    }

    ${(resumeForm.sections?.find(s => s.section === 'ACCOMPLISHMENTS')?.items?.length ?? 0) > 0 && resumeForm.isSectionPresent?.isAccomplishments?
    `
    <div class="section education">
      <div class="section-title">Accomplishments</div>
      ${this.formatAccomplishmentsTemplate10(resumeForm.sections.find(s => s.section === 'ACCOMPLISHMENTS')?.items?.map(i => i.data) ?? [])}
    </div>
    ` : ''
    }

    ${
      (resumeForm.sections?.find(s => s.section === 'WORK_EXPERIENCE')?.items?.length ?? 0) > 0 && resumeForm.isSectionPresent?.isExperience
        ? `
    <div class="section experince trigger-area">
      <div class="section-title">Experience</div>
      ${this.formatExperienceTemplate10(resumeForm.sections.find(s => s.section === 'WORK_EXPERIENCE')?.items?.map(i => i.data) ?? [])}
    </div>
    ` : ''
    }

    ${
      (resumeForm.sections?.find(s => s.section === 'PROJECT')?.items?.length ?? 0) > 0 && resumeForm.isSectionPresent?.isProject
        ? `
    <div class="section experince trigger-area">
      <div class="section-title">Projects</div>
      ${this.formatProjectTemplate10(resumeForm.sections.find(s => s.section === 'PROJECT')?.items?.map(i => i.data) ?? [])}
    </div>
    ` : ''
    }
  </div>
  </body>
  </html>

  `
}


formatEducationTemplate10(items : Education[]){
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

formatSkillsTemplate10(items : SkillV2[]){
  return items.map((item : SkillV2)=> 
  `
  <li><span>${item.sub_title}:</span> ${item.skills.join(', ')}</li>
  `).join('');
}

formatAccomplishmentsTemplate10(items : Accomplishment[]){
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

formatExperienceTemplate10(items : Experience[]){
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

formatProjectTemplate10(items : Project[]){
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


}
