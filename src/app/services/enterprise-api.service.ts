import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface EnterpriseMyDto {
  enterpriseId?: string;
  enterpriseName?: string;
  myRole?: string;
  membershipStatus?: string;
  startDate?: string;
}

export interface EnterpriseProfileDto {
  id?: string;
  name?: string;
  description?: string;
  emailId?: string;
  contactPh?: string;
  website?: string;
  linkedin?: string;
  imageUrl?: string;
  setupStatus?: string;
}

export interface EnterpriseMemberDto {
  userId?: string;
  userName?: string;
  role?: string;
  membershipStatus?: string;
}

export interface PageDto<T> {
  content?: T[];
  totalElements?: number;
  number?: number;
  size?: number;
}

export interface EnterpriseInvitePayload {
  userName: string;
  userId?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class EnterpriseApiService {
  private readonly http = inject(HttpClient);

  /** Returns the list of enterprises the current user belongs to. */
  getMyEnterprises(): Observable<EnterpriseMyDto[]> {
    return this.http.get<EnterpriseMyDto[]>('/api/enterprises/my');
  }

  getEnterpriseProfile(id: string): Observable<EnterpriseProfileDto> {
    return this.http.get<EnterpriseProfileDto>(`/api/enterprise-profiles/${encodeURIComponent(id)}`);
  }

  updateEnterpriseProfile(id: string, payload: Partial<EnterpriseProfileDto>): Observable<EnterpriseProfileDto> {
    return this.http.put<EnterpriseProfileDto>(`/api/enterprise-profiles/${encodeURIComponent(id)}`, payload);
  }

  /** List members for an enterprise. Returns a page-shaped result (flat list wrapped). */
  listMembers(enterpriseId: string, page = 0, size = 50): Observable<PageDto<EnterpriseMemberDto>> {
    return this.http.get<EnterpriseMemberDto[]>(`/api/enterprises/${encodeURIComponent(enterpriseId)}/members`).pipe(
      map((members) => {
        const start = page * size;
        const slice = members.slice(start, start + size);
        return { content: slice, totalElements: members.length, number: page, size } as PageDto<EnterpriseMemberDto>;
      })
    );
  }

  inviteMember(enterpriseId: string, payload: EnterpriseInvitePayload): Observable<unknown> {
    return this.http.post(`/api/enterprises/${encodeURIComponent(enterpriseId)}/members/invite`, payload);
  }

  updateRole(enterpriseId: string, userName: string, role: string): Observable<unknown> {
    return this.http.patch(`/api/enterprises/${encodeURIComponent(enterpriseId)}/members/${encodeURIComponent(userName)}/role`, { role });
  }

  activateMember(enterpriseId: string, userName: string): Observable<unknown> {
    return this.http.post(`/api/enterprises/${encodeURIComponent(enterpriseId)}/members/${encodeURIComponent(userName)}/activate`, {});
  }

  suspendMember(enterpriseId: string, userName: string): Observable<unknown> {
    return this.http.post(`/api/enterprises/${encodeURIComponent(enterpriseId)}/members/${encodeURIComponent(userName)}/suspend`, {});
  }

  removeMember(enterpriseId: string, userName: string): Observable<unknown> {
    return this.http.delete(`/api/enterprises/${encodeURIComponent(enterpriseId)}/members/${encodeURIComponent(userName)}`);
  }

  getEnterpriseSubscription(enterpriseId: string): Observable<unknown> {
    return this.http.get(`/api/ext/subscriptions/current?scope=ENTERPRISE&subscriberId=${encodeURIComponent(enterpriseId)}`);
  }
}
