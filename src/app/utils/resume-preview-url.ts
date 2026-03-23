const DEFAULT_RESUME_ASSET_BASE_URL = 'https://workifence.s3.us-east-1.amazonaws.com';

export function resolveResumePreviewUrl(
  documentUrl: unknown,
  assetBaseUrl: string = DEFAULT_RESUME_ASSET_BASE_URL,
): string | null {
  const normalizedDocumentUrl = (documentUrl ?? '').toString().trim();
  if (!normalizedDocumentUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(normalizedDocumentUrl)) {
    return normalizedDocumentUrl;
  }

  return `${assetBaseUrl.replace(/\/+$/, '')}/${normalizedDocumentUrl.replace(/^\/+/, '')}`;
}
