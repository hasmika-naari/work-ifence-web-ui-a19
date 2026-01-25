export interface ResumeTemplateVm {
  /** Stable UI key (not necessarily the backend template id). */
  id: string;
  title: string;
  category: 'BASIC' | 'PREMIUM';
  tags?: string[];
  previewUrl?: string;
  /** True for the single template allowed on free. */
  isDefault?: boolean;
}
