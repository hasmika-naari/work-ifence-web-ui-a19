export interface NavbarResponseDTO {
  user: {
    userId: number;
    role: string;
    plan: string;
    enterpriseId?: number;
  };
  sections: NavbarSectionDTO[];
}

export interface NavbarSectionDTO {
  sectionKey: string;
  title: string;
  icon?: string;
  sortOrder?: number;
  items: NavbarItemDTO[];
}

export interface NavbarItemDTO {
  itemKey: string;
  title: string;
  icon?: string;
  route?: string;
  locked: boolean;
  allowed: boolean;
  lockReason?: string;
  readOnly?: boolean;
  featureStatus?: string;
  entitlementKey?: string;
  showWhenLocked?: boolean;
}

export interface UserMenuPrefDTO {
  itemKey: string;
  isHidden: boolean;
}
