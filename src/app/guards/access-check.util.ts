import type { AccessMeDto } from 'src/app/models/access-me.model';
import { ENTITLEMENT_KEYS } from 'src/app/entitlements/entitlement-keys';
import { isEntitled } from 'src/app/utils/entitlements';

export function hasPremiumTemplateAccess(me: AccessMeDto | null | undefined): boolean {
  return isEntitled(me ?? undefined, ENTITLEMENT_KEYS.RESUME_TEMPLATES_PREMIUM);
}
