import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  handleError(error: any): void {
    // Show error toast
    this.messageService.add({
      severity: 'error',
      summary: 'An error occurred',
      detail: error?.message || error?.toString() || 'Unknown error',
      life: 7000
    });
    // Optionally log to console or send to server
    console.error('Global error:', error);
  }
}
