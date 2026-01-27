export interface ResumeTemplateCard {
  id?: number | string;
  title: string;
  imageUrl: string;
  category?: string;
  style?: string;
  tags?: string[];
  status?: string;
  templateJson?: any;
}
