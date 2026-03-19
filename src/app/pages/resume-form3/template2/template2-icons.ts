export const TEMPLATE2_ACTION_ICONS = {
  add: 'pi pi-plus',
  edit: 'pi pi-pencil',
  delete: 'pi pi-trash',
  hide: 'pi pi-eye',
  show: 'pi pi-eye-slash',
  moveUp: 'pi pi-arrow-up',
  moveDown: 'pi pi-arrow-down',
} as const;

export const TEMPLATE2_SECTION_ICON_CLASSES = {
  PROFILE_SUMMARY: 'fa-icon t2-icon-profile',
  PROFILE_SUMMARY_BULLETED: 'fa-icon t2-icon-highlights',
  SKILLS_BY_CATEGORY: 'fa-icon t2-icon-skills',
  SKILLS_BULLET_POINTS: 'fa-icon t2-icon-skills',
  RELEVANT_COURSEWORK: 'fa-icon t2-icon-coursework',
  CERTIFICATIONS: 'fa-icon t2-icon-certifications',
  CERTIFICATIONS_BULLET_POINTS: 'fa-icon t2-icon-certifications',
  ACHIEVEMENTS_BULLET_POINTS: 'fa-icon t2-icon-achievements',
  WORK_EXPERIENCE: 'fa-icon t2-icon-experience',
  PROJECT: 'fa-icon t2-icon-projects',
  EDUCATION: 'fa-icon t2-icon-education',
  ACHIEVEMENT_WITH_DESC: 'fa-icon t2-icon-achievements',
  DEFAULT: 'fa-icon t2-icon-default',
} as const;

export const TEMPLATE2_CONTACT_ICON_CLASSES = {
  email: 'fa-icon t2-icon-email',
  phone: 'fa-icon t2-icon-phone',
  linkedin: 'fa-icon t2-icon-linkedin',
  github: 'fa-icon t2-icon-github',
  portfolio: 'fa-icon t2-icon-portfolio',
} as const;

export type Template2SectionIconKey = keyof typeof TEMPLATE2_SECTION_ICON_CLASSES;
export type Template2ContactIconKey = keyof typeof TEMPLATE2_CONTACT_ICON_CLASSES;
