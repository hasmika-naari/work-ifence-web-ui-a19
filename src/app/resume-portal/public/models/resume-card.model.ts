export interface ResumeCard {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  headline: string;
  primaryRole: string;
  yearsExperience: number;
  location: string;
  workAuthorization: 'US_CITIZEN' | 'GC' | 'H1B' | 'EAD' | 'OTHER';
  availability: 'IMMEDIATE' | '2_WEEKS' | '1_MONTH' | 'NOT_LOOKING';
  topSkills: string[];
  highlights: string[];
  badges: {
    atsOptimized: boolean;
    verified: boolean;
    activelyLooking: boolean;
    domain: 'Healthcare' | 'FinTech' | 'Retail' | 'Education' | 'Other';
  };
  templateKey: string;
  updatedAt: string; // ISO
}

export interface ResumeFilters {
  search: string;
  role: string;
  skills: string[];
  yearsMin: number | null;
  yearsMax: number | null;
  location: string;
  workAuthorization: ResumeCard['workAuthorization'] | '';
  availability: ResumeCard['availability'] | '';
  domain: ResumeCard['badges']['domain'] | '';
  badges: {
    atsOptimized: boolean;
    verified: boolean;
    activelyLooking: boolean;
  };
}
