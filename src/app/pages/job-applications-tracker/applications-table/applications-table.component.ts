import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApplicationTrackingApiService,
  JobApplicationSummary,
} from '../../../services/application-tracking-api.service';

interface ApplicationStatus {
  id: number;
  primaryDisplayName: string;
  keyName: string;
  backgroundColor?: string;
  color?: string;
}

/** Flattened view model used by the template. */
interface ApplicationRow {
  id: number;
  company: string;
  position: string;
  status: string;
  statusKey: string;
  applicationDate: string;
  jobUrl?: string;
  source?: string;
}

@Component({
  selector: 'app-applications-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule],
  templateUrl: './applications-table.component.html',
  styleUrls: ['./applications-table.component.scss']
})
export class ApplicationsTableComponent implements OnInit {

  Math = Math;

  loading = false;
  error: string | null = null;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  filters = { company: '', position: '', status: '' };
  uniqueStatuses: string[] = [];

  allRows: ApplicationRow[] = [];
  filteredRows: ApplicationRow[] = [];
  paginatedApplications: ApplicationRow[] = [];

  private statusMap = new Map<number, ApplicationStatus>();

  constructor(
    private readonly api: ApplicationTrackingApiService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      statuses: this.http.get<ApplicationStatus[]>('/api/application-statuses').pipe(catchError(() => of([]))),
      applications: this.api.list(0, 200).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ statuses, applications }) => {
        statuses.forEach(s => this.statusMap.set(s.id, s));
        this.allRows = applications.map(a => this.toRow(a));
        this.uniqueStatuses = [...new Set(this.allRows.map(r => r.status))].sort();
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load applications.';
        this.loading = false;
      }
    });
  }

  private toRow(a: JobApplicationSummary): ApplicationRow {
    const st = this.statusMap.get(a.statusId);
    return {
      id: a.id,
      company: a.company,
      position: a.jobTitle,
      status: st?.primaryDisplayName ?? `Status ${a.statusId}`,
      statusKey: st?.keyName ?? String(a.statusId),
      applicationDate: a.applicationDate ?? a.createdAt,
      jobUrl: a.jobUrl,
      source: a.source,
    };
  }

  applyFilters(): void {
    this.filteredRows = this.allRows.filter(r => {
      const companyMatch = !this.filters.company || r.company.toLowerCase().includes(this.filters.company.toLowerCase());
      const positionMatch = !this.filters.position || r.position.toLowerCase().includes(this.filters.position.toLowerCase());
      const statusMatch = !this.filters.status || r.status === this.filters.status;
      return companyMatch && positionMatch && statusMatch;
    });
    this.currentPage = 1;
    this.totalItems = this.filteredRows.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updatePage();
  }

  onFilterChange(): void { this.applyFilters(); }

  clearFilters(): void {
    this.filters = { company: '', position: '', status: '' };
    this.applyFilters();
  }

  private updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedApplications = this.filteredRows.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePage();
    }
  }

  previousPage(): void { this.goToPage(this.currentPage - 1); }
  nextPage(): void { this.goToPage(this.currentPage + 1); }

  changePageSize(event: Event): void {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updatePage();
  }

  getPageNumbers(): number[] {
    const max = 5;
    const half = Math.floor(max / 2);
    let start = Math.max(1, this.currentPage - half);
    const end = Math.min(this.totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getStatusClass(statusKey: string): string {
    return statusKey.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
