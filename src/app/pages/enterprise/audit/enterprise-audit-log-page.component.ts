import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { of } from 'rxjs';
import type { AuditEventRow, AuditQuery, PagedResponse } from 'src/app/models/audit.model';
import { AuditApiService } from 'src/app/services/audit-api.service';
import { GateDeniedTelemetryService } from 'src/app/services/gate-denied-telemetry.service';
import { AuditLogTableComponent } from 'src/app/shared/audit/audit-log-table.component';

@Component({
  selector: 'app-enterprise-audit-log-page',
  standalone: true,
  imports: [CommonModule, AuditLogTableComponent],
  template: `
    <div style="padding: 16px;">
      <app-audit-log-table
        title="Enterprise Audit Log"
        [fetchPage]="fetchPage"
        [fallbackPage]="fallbackPage"
      ></app-audit-log-table>
    </div>
  `,
})
export class EnterpriseAuditLogPageComponent {
  private readonly api = inject(AuditApiService);
  private readonly telemetry = inject(GateDeniedTelemetryService);

  readonly fetchPage = (query: AuditQuery) => this.api.searchEnterpriseEvents(query);

  readonly fallbackPage = (query: AuditQuery) =>
    of(this.telemetry.searchLocal(query) as PagedResponse<AuditEventRow>);
}
