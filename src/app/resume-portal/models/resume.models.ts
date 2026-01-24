export type PlanType = 'FREE' | 'SUBSCRIBED';

export type TemplateCategory = 'All' | 'Simple' | 'Modern' | 'Creative';

export interface ResumeTemplateInfo {
  id: string; // maps to existing template_name like TEMPLATE_1
  name: string;
  category: Exclude<TemplateCategory, 'All'>;
  isPremium: boolean;
  thumbnailUrl: string;
  previewUrl: string;
  features: string[];
}

export interface ResumeSummary {
  id: string;
  title: string;
  templateId: string;
  updatedAt?: string;
  isDefault?: boolean;
}

export interface ImportedResumeResult {
  extractedJson: unknown;
  originalFileName: string;
}

export interface CreateResumePayload {
  title: string;
  templateId: string;
  resumeJson?: unknown;
}

export interface UpdateResumePayload {
  title?: string;
  templateId?: string;
  resumeJson?: unknown;
}
