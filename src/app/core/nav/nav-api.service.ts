import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NavApiResponse, NavApiSection } from './nav-api.model';

@Injectable({ providedIn: 'root' })
export class NavApiService {
  constructor(private http: HttpClient) {}

  getMyNav(): Observable<NavApiResponse> {
    const base = (environment.apiUrl ?? '').replace(/\/$/, '');
    // Profile-dependent menu endpoint (used to rebuild sidebar immediately after profile switch)
    const url = `${base}/api/access/nav/menu`;
    return this.http.get<NavApiResponse | NavApiSection[]>(url).pipe(
      map(resp => {
        if (Array.isArray(resp)) {
          return {
            user: {
              login: '',
              userId: '',
              roleKey: '',
              roles: [],
              planTier: '',
              planCode: '',
              subscriptionStatus: ''
            },
            sections: resp
          };
        }
        return resp;
      })
    );
  }
}
