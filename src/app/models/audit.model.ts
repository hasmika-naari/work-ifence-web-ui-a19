export type AuditEventType = 'GATE_DENIED' | 'ADMIN_ACTION' | string;

export type AuditOutcome = 'DENIED' | 'SUCCESS' | 'FAILURE' | string;

export interface AuditEventRow {
  id?: string;

  /** ISO8601 timestamp */
  timestamp: string;

  eventType: AuditEventType;
  outcome: AuditOutcome;

  actorUserId?: string;
  actorEmail?: string;
  actorMode?: string;

  action?: string;
  entityType?: string;
  entityId?: string;

  featureKey?: string;
  entitlementKey?: string;
  pricingScope?: 'individual' | 'enterprise' | string;

  requestPath?: string;

  /** Human-friendly summary */
  message?: string;

  /** Arbitrary JSON payload */
  details?: Record<string, any>;
}

export interface AuditQuery {
  page: number;
  size: number;

  eventType?: string;
  q?: string;
  actor?: string;
  from?: string;
  to?: string;
  sort?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
}

export interface GateDeniedEventInput {
  requestPath: string;

  denialType: 'AUTH' | 'MODE' | 'ENTERPRISE_ADMIN' | 'ENTITLEMENT' | 'FEATURE' | string;
  featureKey?: string;
  entitlementKey?: string;
  pricingScope?: 'individual' | 'enterprise' | string;

  message?: string;
  details?: Record<string, any>;
}

export interface AdminActionEventInput {
  action: string;
  entityType?: string;
  entityId?: string;

  outcome: 'SUCCESS' | 'FAILURE' | string;
  message?: string;
  details?: Record<string, any>;
}
