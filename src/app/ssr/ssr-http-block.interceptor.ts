import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class SsrHttpBlockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = req.url || '';

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/api')) {
      return of(new HttpResponse({ status: 204, body: null }));
    }

    return next.handle(req);
  }
}