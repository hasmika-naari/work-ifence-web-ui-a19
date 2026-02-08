export type EntitlementsPlan = 'FREE' | 'PRO' | 'PREMIUM' | string;

/**
 * Backend contract for `/api/entitlements/me`.
 *
 * Notes:
 * - `plan` may include future values; the FE treats unknown plans as lowest tier.
 * - If the contract is violated, the FE fails closed (no entitlements granted).
 */
export interface EntitlementsResponse {
  plan: EntitlementsPlan;
  roles: string[];
  entitlements: Record<string, boolean>;
  updatedAt?: string;
}
