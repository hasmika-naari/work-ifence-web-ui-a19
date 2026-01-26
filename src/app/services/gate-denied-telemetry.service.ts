import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AccessFacadeService } from 'src/app/facades/access-facade.service';
import type {
  AdminActionEventInput,
  AuditEventRow,
  AuditQuery,
  GateDeniedEventInput,
  PagedResponse,
} from 'src/app/models/audit.model';
import { AuditApiService } from 'src/app/services/audit-api.service';

const STORAGE_KEY = 'audit.localEvents.v1';

@Injectable({ providedIn: 'root' })
export class GateDeniedTelemetryService {
  private readonly accessFacade = inject(AccessFacadeService);
  private readonly auditApi = inject(AuditApiService);

  private readonly maxEvents = 500;
  private readonly dedupeWindowMs = 60_000;
  private readonly platformId: object;

  // in-memory dedupe (browser session)
  private readonly lastSeen = new Map<string, number>();

  // avoid hammering a missing backend endpoint
  private remoteDisabledUntilMs = 0;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.platformId = platformId;
  }

  recordGateDenied(input: GateDeniedEventInput): void {
    if (!this.isBrowser()) return;

    const now = Date.now();
    const dedupeKey = [
      'GATE_DENIED',
      input.denialType,
      input.featureKey ?? '',
      input.entitlementKey ?? '',
      input.requestPath,
    ].join('|');

    const last = this.lastSeen.get(dedupeKey);
    if (last && now - last < this.dedupeWindowMs) return;
    this.lastSeen.set(dedupeKey, now);

    const me = this.accessFacade.accessMeSignal();

    const event: AuditEventRow = {
      timestamp: new Date(now).toISOString(),
      eventType: 'GATE_DENIED',
      outcome: 'DENIED',
      actorUserId: me?.userId ? String(me.userId) : undefined,
      actorEmail: (me as any)?.email ?? (me as any)?.userEmail ?? undefined,
      actorMode: (me?.mode ?? '').toString(),
      featureKey: input.featureKey,
      entitlementKey: input.entitlementKey,
      pricingScope: input.pricingScope,
      requestPath: input.requestPath,
      message: input.message,
      details: {
        denialType: input.denialType,
        ...(input.details ?? {}),
      },
    };

    this.appendLocal(event);
    this.tryIngestRemote(event);
  }

  recordAdminAction(input: AdminActionEventInput): void {
    if (!this.isBrowser()) return;

    const me = this.accessFacade.accessMeSignal();

    const event: AuditEventRow = {
      timestamp: new Date().toISOString(),
      eventType: 'ADMIN_ACTION',
      outcome: input.outcome,
      actorUserId: me?.userId ? String(me.userId) : undefined,
      actorEmail: (me as any)?.email ?? (me as any)?.userEmail ?? undefined,
      actorMode: (me?.mode ?? '').toString(),
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      message: input.message,
      details: input.details,
    };

    this.appendLocal(event);
    this.tryIngestRemote(event);
  }

  searchLocal(query: AuditQuery): PagedResponse<AuditEventRow> {
    if (!this.isBrowser()) {
      return { content: [], totalElements: 0, number: query.page, size: query.size };
    }

    const all = this.loadAll();
    const eventType = (query.eventType ?? '').trim();
    const q = (query.q ?? '').trim().toLowerCase();
    const actor = (query.actor ?? '').trim().toLowerCase();

    const filtered = all.filter((e) => {
      if (eventType && (e.eventType ?? '') !== eventType) return false;

      if (actor) {
        const a = `${e.actorEmail ?? ''} ${e.actorUserId ?? ''}`.toLowerCase();
        if (!a.includes(actor)) return false;
      }

      if (q) {
        const haystack = `${e.message ?? ''} ${e.action ?? ''} ${e.entityType ?? ''} ${e.entityId ?? ''} ${e.requestPath ?? ''} ${e.featureKey ?? ''} ${e.entitlementKey ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // date filters (ISO strings)
      if (query.from && e.timestamp < query.from) return false;
      if (query.to && e.timestamp > query.to) return false;

      return true;
    });

    const total = filtered.length;
    const start = query.page * query.size;
    const end = start + query.size;
    const content = filtered.slice(start, end);

    return {
      content,
      totalElements: total,
      number: query.page,
      size: query.size,
    };
  }

  private appendLocal(event: AuditEventRow): void {
    const current = this.loadAll();
    const next = [event, ...current].slice(0, this.maxEvents);
    this.saveAll(next);
  }

  private loadAll(): AuditEventRow[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as AuditEventRow[]) : [];
    } catch {
      return [];
    }
  }

  private saveAll(events: AuditEventRow[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // ignore storage failures
    }
  }

  private tryIngestRemote(event: AuditEventRow): void {
    if (!this.isBrowser()) return;

    const now = Date.now();
    if (now < this.remoteDisabledUntilMs) return;

    this.auditApi.ingestEvent(event).subscribe({
      error: (err: unknown) => {
        const status = (err as HttpErrorResponse | undefined)?.status;
        // If endpoint is missing/disabled, back off for 10 minutes.
        if (status === 404 || status === 501) {
          this.remoteDisabledUntilMs = Date.now() + 10 * 60_000;
        }
      },
    });
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
