import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NavApiResponse } from './nav-api.model';

@Injectable({ providedIn: 'root' })
export class NavApiService {
  constructor(private http: HttpClient) {}

  getMyNav(): Observable<NavApiResponse> {
    const base = (environment.apiUrl ?? '').replace(/\/$/, '');
    const url = `${base}/access/nav/menu`;
    return this.http.get<NavApiResponse>(url);
  }
}
