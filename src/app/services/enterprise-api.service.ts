import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface EnterpriseMyDto {
  enterpriseId?: string;
  profileId?: string;
  enterpriseProfileId?: string;
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

export interface EnterpriseRelationDto {
  id?: string;
  userName?: string;
  email?: string;
  role?: string;
  membershipStatus?: string;
  startDate?: string;
  invitedBy?: string;
}

export interface PageDto<T> {
  content?: T[];
  totalElements?: number;
  number?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class EnterpriseApiService {
  private readonly http = inject(HttpClient);

  getMyEnterprise(): Observable<EnterpriseMyDto> {
    return this.http.get<EnterpriseMyDto>('/api/enterprise/my');
  }

  getEnterpriseProfile(id: string): Observable<EnterpriseProfileDto> {
    return this.http.get<EnterpriseProfileDto>(`/api/enterprise-profiles/${encodeURIComponent(id)}`);
  }

  updateEnterpriseProfile(id: string, payload: Partial<EnterpriseProfileDto>): Observable<EnterpriseProfileDto> {
    return this.http.put<EnterpriseProfileDto>(`/api/enterprise-profiles/${encodeURIComponent(id)}`, payload);
  }

  listRelations(enterpriseId: string, page: number, size: number): Observable<PageDto<EnterpriseRelationDto>> {
    const params = new HttpParams()
      .set('enterpriseId', enterpriseId)
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<PageDto<EnterpriseRelationDto> | EnterpriseRelationDto[]>('/api/enterprise-profile-relations', { params })
      .pipe(
        map((res: any) => {
          if (Array.isArray(res)) {
            return { content: res, totalElements: res.length, number: page, size } as PageDto<EnterpriseRelationDto>;
          }
          return res as PageDto<EnterpriseRelationDto>;
        })
      );
  }

  inviteMember(payload: any): Observable<any> {
    return this.http.post('/api/enterprise-profile-relations/invite', payload);
  }

  activateRelation(id: string): Observable<any> {
    return this.http.post(`/api/enterprise-profile-relations/${encodeURIComponent(id)}/activate`, {});
  }

  suspendRelation(id: string): Observable<any> {
    return this.http.post(`/api/enterprise-profile-relations/${encodeURIComponent(id)}/suspend`, {});
  }

  removeRelation(id: string): Observable<any> {
    return this.http.delete(`/api/enterprise-profile-relations/${encodeURIComponent(id)}`);
  }

  getEnterpriseSubscription(enterpriseId: string): Observable<any> {
    const params = new HttpParams().set('scope', 'ENTERPRISE').set('subscriberId', enterpriseId);
    return this.http.get('/api/subscriptions/current', { params });
  }
}
