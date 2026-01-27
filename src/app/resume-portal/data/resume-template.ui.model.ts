export interface ResumeTemplateUi {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  style?: string;
  tags: string[];
  status?: string;
  templateKey?: string;
  componentKey?: string;
  version?: string;
  accessLevel?: string;
  sortOrder?: number;
  isDefault?: boolean;
  configJson?: string | Record<string, unknown> | null;
}
