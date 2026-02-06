import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavSection } from './nav.model';

@Injectable({ providedIn: 'root' })
export class NavApiService {
  constructor(private http: HttpClient) {}

  getMenu(): Observable<NavSection[]> {
    return this.http.get<NavSection[]>('/api/nav/menu');
  }
}
