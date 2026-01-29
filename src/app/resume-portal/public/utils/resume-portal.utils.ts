import type { ResumeCard } from '../models/resume-card.model';

export const LIGHT_GRADIENTS: string[] = [
  'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
  'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
  'linear-gradient(135deg, #fae8ff 0%, #e9d5ff 100%)',
  'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
  'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
  'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
];

export const WORK_AUTH_LABELS: Record<ResumeCard['workAuthorization'], string> = {
  US_CITIZEN: 'US Citizen',
  GC: 'Green Card',
  H1B: 'H1B',
  EAD: 'EAD',
  OTHER: 'Other',
};

export const AVAILABILITY_LABELS: Record<ResumeCard['availability'], string> = {
  IMMEDIATE: 'Immediate',
  '2_WEEKS': '2 Weeks',
  '1_MONTH': '1 Month',
  NOT_LOOKING: 'Not looking',
};

export function getInitials(firstName: string, lastName: string): string {
  const first = (firstName || '').trim().charAt(0).toUpperCase();
  const last = (lastName || '').trim().charAt(0).toUpperCase();
  return `${first}${last}`.trim() || 'NA';
}

export function maskLastName(lastName: string): string {
  const initial = (lastName || '').trim().charAt(0).toUpperCase();
  return initial ? `${initial}.` : '';
}

export function formatUpdatedDays(updatedAt: string): string {
  const updated = new Date(updatedAt).getTime();
  if (!Number.isFinite(updated)) return 'Updated recently';
  const diffMs = Math.max(0, Date.now() - updated);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Updated today';
  if (days === 1) return 'Updated 1 day ago';
  return `Updated ${days} days ago`;
}

export function getDeterministicGradient(id: string): string {
  const hash = hashString(id);
  const index = Math.abs(hash) % LIGHT_GRADIENTS.length;
  return LIGHT_GRADIENTS[index];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
