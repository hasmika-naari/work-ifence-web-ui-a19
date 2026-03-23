import { resolveResumePreviewUrl } from './resume-preview-url';

describe('resolveResumePreviewUrl', () => {
  it('returns null for an empty document URL', () => {
    expect(resolveResumePreviewUrl('')).toBeNull();
    expect(resolveResumePreviewUrl(null)).toBeNull();
  });

  it('returns the original URL when the document URL is already absolute', () => {
    const absoluteUrl = 'https://cdn.example.com/resumes/jane-doe.pdf';

    expect(resolveResumePreviewUrl(absoluteUrl)).toBe(absoluteUrl);
  });

  it('builds a full asset URL when the document URL is relative', () => {
    expect(resolveResumePreviewUrl('jane/wif-resume/resume.pdf')).toBe(
      'https://workifence.s3.us-east-1.amazonaws.com/jane/wif-resume/resume.pdf'
    );
  });

  it('normalizes leading and trailing slashes around the asset base URL', () => {
    expect(resolveResumePreviewUrl('/jane/wif-resume/resume.pdf', 'https://cdn.example.com/')).toBe(
      'https://cdn.example.com/jane/wif-resume/resume.pdf'
    );
  });
});
