export interface NavbarResponseDTO {
  sections: NavbarSectionDTO[];
  roleKey?: string;
  enterpriseId?: string | null;
  user?: {
    role?: string;
    [key: string]: any;
  };
}

export interface NavbarSectionDTO {
  sectionKey: string;
  title: string;
  sortOrder: number;
  items: NavbarItemDTO[];
}

export interface NavbarItemDTO {
  itemKey: string;
  title: string;
  icon?: string;
  route: string;
  isLocked?: boolean;
  showWhenLocked?: boolean;
  entitlementKey?: string | null;
  sortOrder?: number;
  lockReason?: string;
  featureStatus?: 'ACTIVE' | 'READ_ONLY' | 'DISABLED';
  minPlan?: string;
  locked?: boolean;
  readOnly?: boolean;
  allowed?: boolean;
}

export interface UserMenuPrefDTO {
  itemKey: string;
  isHidden: boolean;
}
