/**
 * R1-E1 resume visibility/share models. Mirrors the backend ext DTOs
 * (ResumeVisibility, ShareLinkResponseDto, PublicResumeDto).
 */

export type ResumeVisibility = 'PRIVATE' | 'PUBLIC' | 'UNLISTED' | 'EMPLOYER_ONLY';

export const RESUME_VISIBILITIES: ResumeVisibility[] = ['PRIVATE', 'UNLISTED', 'PUBLIC', 'EMPLOYER_ONLY'];

export const RESUME_VISIBILITY_LABELS: Record<ResumeVisibility, string> = {
  PRIVATE: 'Private — only you',
  UNLISTED: 'Unlisted — anyone with the link',
  PUBLIC: 'Public — discoverable',
  EMPLOYER_ONLY: 'Employer only — enterprise recruiters',
};

/** Owner-facing resume snapshot returned by GET /api/ext/job-resumes/{id}. */
export interface ResumeDetailDto {
  id: number;
  title?: string;
  resumeJson?: string;
  tags?: string;
  visibility?: ResumeVisibility;
}

/** Returned by POST /api/ext/job-resumes/{id}/share. The url embeds the public /r/{token} path. */
export interface ShareLinkResponse {
  token: string;
  url: string;
  visibility?: ResumeVisibility;
}

/** Public, read-only resume returned by GET /api/public/resumes/{token}. */
export interface PublicResumeDto {
  id: number;
  title?: string;
  resumeJson?: string;
  tags?: string;
  visibility?: ResumeVisibility;
}
