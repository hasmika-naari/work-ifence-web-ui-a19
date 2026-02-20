import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountDTO } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountApi {
  private readonly http = inject(HttpClient);

  getAccount(): Observable<AccountDTO> {
    return this.http.get<AccountDTO>('/api/account').pipe(
      catchError((error) => throwError(() => error)),
    );
  }
}
