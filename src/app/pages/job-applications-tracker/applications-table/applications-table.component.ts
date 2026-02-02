import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';


interface ApplicationRecord {
  company: {
    name: string;
    website: string;
  };
  position: string;
  status: string;
  applicationDate: string;
  salary: number;
  nextActions: string[];
  contact: string;
  referenceLink: string;
}

@Component({
  selector: 'app-applications-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule , MatIconModule, MatSortModule, MatTableModule, MatInputModule, MatPaginatorModule],
  templateUrl: './applications-table.component.html',
  styleUrls: ['./applications-table.component.scss']
})
export class ApplicationsTableComponent implements OnInit {

  // Make Math available in template
  Math = Math;

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedApplications: ApplicationRecord[] = [];
  pageSizeOptions: number[] = [5, 10, 15, 20];

  // Filter properties
  filteredApplications: ApplicationRecord[] = [];
  filters = {
    company: '',
    position: '',
    status: ''
  };
  
  // Get unique values for filter dropdowns
  uniqueStatuses: string[] = [];
  uniqueCompanies: string[] = [];
  uniquePositions: string[] = [];

 constructor() { }

  ngOnInit(): void {
    //  const gridElement = document.querySelector('.applications-grid-card') as HTMLElement;

    //   let remainingHeight = window.innerHeight - 290;
    //   // Check if the element exists
    //   if (gridElement) {
    //       // Set the height style
    //       gridElement.style.maxHeight = remainingHeight + 'px'; // Example height
    //   }
      
      // Initialize filters and pagination
      this.initializeFilters();
      this.applyFilters();
  }

//   displayedColumns: string[] = ['company', 'position', 'status', 'applicationDate', 'salary', 'nextActions', 'website', 'contact', 'referenceLink'];


  applications: ApplicationRecord[] = [
    {
      company: { name: 'Airbnb', website: 'airbnb.com' },
      position: 'Full Stack Developer',
      status: 'Applied',
      applicationDate: 'July 22, 2025',
      salary: 95000,
      nextActions: ['Prepare Interview'],
      contact: 'Brian Chesky',
      referenceLink: 'Notion Portfolio'
    },
    {
      company: { name: 'Spotify', website: 'spotify.com' },
      position: 'Frontend Developer',
      status: 'Interviewed',
      applicationDate: 'July 21, 2025',
      salary: 130000,
      nextActions: ['Waiting', 'Follow up'],
      contact: 'Daniel Ek',
      referenceLink: 'Personal Website'
    },
    {
      company: { name: 'Apple', website: 'apple.com' },
      position: 'iOS Engineer',
      status: 'Applied',
      applicationDate: 'July 20, 2025',
      salary: 120000,
      nextActions: ['Prepare Interview'],
      contact: 'Tim Cook',
      referenceLink: 'LinkedIn Profile'
    },
    {
      company: { name: 'Netflix', website: 'netflix.com' },
      position: 'DevOps Specialist',
      status: 'Rejected',
      applicationDate: 'July 5, 2025',
      salary: 105000,
      nextActions: ['Send email'],
      contact: 'Reed Hastings',
      referenceLink: 'Portfolio Site'
    },
    {
      company: { name: 'Airbnb', website: 'airbnb.com' },
      position: 'Full Stack Developer',
      status: 'Applied',
      applicationDate: 'July 22, 2025',
      salary: 95000,
      nextActions: ['Prepare Interview'],
      contact: 'Brian Chesky',
      referenceLink: 'Notion Portfolio'
    },
    {
      company: { name: 'Spotify', website: 'spotify.com' },
      position: 'Frontend Developer',
      status: 'Interviewed',
      applicationDate: 'July 21, 2025',
      salary: 130000,
      nextActions: ['Waiting', 'Follow up'],
      contact: 'Daniel Ek',
      referenceLink: 'Personal Website'
    },
    {
      company: { name: 'Apple', website: 'apple.com' },
      position: 'iOS Engineer',
      status: 'Applied',
      applicationDate: 'July 20, 2025',
      salary: 120000,
      nextActions: ['Prepare Interview'],
      contact: 'Tim Cook',
      referenceLink: 'LinkedIn Profile'
    },
    {
      company: { name: 'Netflix', website: 'netflix.com' },
      position: 'DevOps Specialist',
      status: 'Rejected',
      applicationDate: 'July 5, 2025',
      salary: 105000,
      nextActions: ['Send email'],
      contact: 'Reed Hastings',
      referenceLink: 'Portfolio Site'
    },
    {
      company: { name: 'Airbnb', website: 'airbnb.com' },
      position: 'Full Stack Developer',
      status: 'Applied',
      applicationDate: 'July 22, 2025',
      salary: 95000,
      nextActions: ['Prepare Interview'],
      contact: 'Brian Chesky',
      referenceLink: 'Notion Portfolio'
    },
    {
      company: { name: 'Spotify', website: 'spotify.com' },
      position: 'Frontend Developer',
      status: 'Interviewed',
      applicationDate: 'July 21, 2025',
      salary: 130000,
      nextActions: ['Waiting', 'Follow up'],
      contact: 'Daniel Ek',
      referenceLink: 'Personal Website'
    },
    {
      company: { name: 'Apple', website: 'apple.com' },
      position: 'iOS Engineer',
      status: 'Applied',
      applicationDate: 'July 20, 2025',
      salary: 120000,
      nextActions: ['Prepare Interview'],
      contact: 'Tim Cook',
      referenceLink: 'LinkedIn Profile'
    },
    {
      company: { name: 'Netflix', website: 'netflix.com' },
      position: 'DevOps Specialist',
      status: 'Rejected',
      applicationDate: 'July 5, 2025',
      salary: 105000,
      nextActions: ['Send email'],
      contact: 'Reed Hastings',
      referenceLink: 'Portfolio Site'
    },
    {
      company: { name: 'Airbnb', website: 'airbnb.com' },
      position: 'Full Stack Developer',
      status: 'Applied',
      applicationDate: 'July 22, 2025',
      salary: 95000,
      nextActions: ['Prepare Interview'],
      contact: 'Brian Chesky',
      referenceLink: 'Notion Portfolio'
    },
    {
      company: { name: 'Spotify', website: 'spotify.com' },
      position: 'Frontend Developer',
      status: 'Interviewed',
      applicationDate: 'July 21, 2025',
      salary: 130000,
      nextActions: ['Waiting', 'Follow up'],
      contact: 'Daniel Ek',
      referenceLink: 'Personal Website'
    },
    {
      company: { name: 'Apple', website: 'apple.com' },
      position: 'iOS Engineer',
      status: 'Applied',
      applicationDate: 'July 20, 2025',
      salary: 120000,
      nextActions: ['Prepare Interview'],
      contact: 'Tim Cook',
      referenceLink: 'LinkedIn Profile'
    },
    {
      company: { name: 'Netflix', website: 'netflix.com' },
      position: 'DevOps Specialist',
      status: 'Rejected',
      applicationDate: 'July 5, 2025',
      salary: 105000,
      nextActions: ['Send email'],
      contact: 'Reed Hastings',
      referenceLink: 'Portfolio Site'
    }
  ];



//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

//   applyFilter(event: Event) {
//     const value = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = value.trim().toLowerCase();
//   }

  // Filter methods
  initializeFilters(): void {
    // Get unique values for dropdowns
    this.uniqueCompanies = [...new Set(this.applications.map(app => app.company.name))].sort();
    this.uniquePositions = [...new Set(this.applications.map(app => app.position))].sort();
    this.uniqueStatuses = [...new Set(this.applications.map(app => app.status))].sort();
  }

  applyFilters(): void {
    this.filteredApplications = this.applications.filter(app => {
      const companyMatch = !this.filters.company || 
        app.company.name.toLowerCase().includes(this.filters.company.toLowerCase());
      const positionMatch = !this.filters.position || 
        app.position.toLowerCase().includes(this.filters.position.toLowerCase());
      const statusMatch = !this.filters.status || app.status === this.filters.status;
      
      return companyMatch && positionMatch && statusMatch;
    });
    
    // Reset to first page and update pagination
    this.currentPage = 1;
    this.initializePagination();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      company: '',
      position: '',
      status: ''
    };
    this.applyFilters();
  }

  // Pagination methods
  initializePagination(): void {
    this.totalItems = this.filteredApplications.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedApplications = this.filteredApplications.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  changePageSize(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1; // Reset to first page
    this.initializePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getStatusClass(status: string): string {
  return status
    .toLowerCase()
    .replace(/\s+/g, '-'); // "Offer Received" → "offer-received"
}




}