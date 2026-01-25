import { HttpErrorResponse } from '@angular/common/http';

export type BackendErrorCode =
  | 'FEATURE_NOT_ENABLED'
  | 'SUBSCRIPTION_EXPIRED'
  | 'TRIAL_ENDED'
  | 'SEAT_LIMIT_REACHED'
  | 'RESUME_LIMIT_REACHED'
  | 'RESUME_LIMIT_EXCEEDED'
  | 'TEMPLATE_NOT_ALLOWED'
  | string;

export interface ParsedBackendError {
  code?: BackendErrorCode;
  message?: string;
  status?: number;
}

export function parseBackendError(err: unknown): ParsedBackendError {
  if (!(err instanceof HttpErrorResponse)) {
    return { message: 'Unexpected error' };
  }

  const status = err.status;
  const payload: any = err.error;

  const code: BackendErrorCode | undefined =
    payload?.code ?? payload?.errorCode ?? payload?.error?.code ?? payload?.error?.errorCode;

  const message: string | undefined =
    payload?.message ?? payload?.error_description ?? payload?.error?.message ?? err.message;

  return { code, message, status };
}

export function toFriendlyErrorMessage(parsed: ParsedBackendError): string {
  switch ((parsed.code ?? '').toString()) {
    case 'FEATURE_NOT_ENABLED':
      return 'This feature isn’t enabled on your plan.';
    case 'SUBSCRIPTION_EXPIRED':
      return 'Your subscription is expired. Please upgrade to continue.';
    case 'TRIAL_ENDED':
      return 'Your trial has ended. Please upgrade to continue.';
    case 'SEAT_LIMIT_REACHED':
      return 'Seat limit reached. Upgrade to invite more members.';
    case 'RESUME_LIMIT_REACHED':
    case 'RESUME_LIMIT_EXCEEDED':
      return 'Resume limit reached. Upgrade your plan to continue.';
    case 'TEMPLATE_NOT_ALLOWED':
      return 'This template is not available on your current plan.';
    default:
      return parsed.message || 'Something went wrong. Please try again.';
  }
}

export function isEntitlementError(parsed: ParsedBackendError): boolean {
  const code = (parsed.code ?? '').toString();
  return (
    code === 'FEATURE_NOT_ENABLED' ||
    code === 'SUBSCRIPTION_EXPIRED' ||
    code === 'TRIAL_ENDED' ||
    code === 'RESUME_LIMIT_REACHED' ||
    code === 'RESUME_LIMIT_EXCEEDED'
  );
}

export function isSeatLimitError(parsed: ParsedBackendError): boolean {
  return (parsed.code ?? '').toString() === 'SEAT_LIMIT_REACHED';
}

export function isUpgradeRequiredError(parsed: ParsedBackendError): boolean {
  const code = (parsed.code ?? '').toString();
  return isEntitlementError(parsed) || isSeatLimitError(parsed) || code === 'TEMPLATE_NOT_ALLOWED';
}
