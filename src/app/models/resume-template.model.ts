export type ResumeTemplateAccessLevel = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | string;
export type ResumeTemplateStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | string;

export interface ResumeTemplateRecord {
  id?: number | string;
  title: string;
  templateKey: string;
  componentKey: string;
  version: string;
  accessLevel: ResumeTemplateAccessLevel;
  sortOrder: number;
  isDefault: boolean;
  configJson?: string | Record<string, unknown> | null;
  templateDocUrl?: string | null;
  tags?: string[] | string | null;
  category?: string | null;
  style?: string | null;
  status?: ResumeTemplateStatus | null;
}

export type ResumeTemplateUpsert = Omit<ResumeTemplateRecord, 'id'> & { id?: number | string };
