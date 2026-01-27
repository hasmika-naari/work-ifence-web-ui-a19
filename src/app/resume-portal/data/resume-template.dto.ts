export interface ResumeTemplateDto {
  id?: string | number;
  title?: string;
  name?: string;
  templateKey?: string;
  componentKey?: string;
  template_name?: string;
  version?: string;
  accessLevel?: string;
  sortOrder?: number;
  isDefault?: boolean;
  templateDocUrl?: string | null;
  imageUrl?: string | null;
  templateJson?: any;
  tags?: string[] | string | null;
  category?: string | null;
  style?: string | null;
  status?: string | null;
  configJson?: string | Record<string, unknown> | null;
}
