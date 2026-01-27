import type { AccessMeDto } from 'src/app/models/access-me.model';
import { isEntitled } from 'src/app/utils/entitlements';

export function hasPremiumTemplateAccess(me: AccessMeDto | null | undefined): boolean {
  return isEntitled(me ?? undefined, 'templatesPremium');
}
