import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Location } from '@angular/common';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';

// Owl Carousel
import { CarouselModule } from 'ngx-owl-carousel-o';

// Layout Components
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';

// Course Data
import coursesData from './courses.json';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { RouterModule } from '@angular/router';
import { IconsModule } from 'src/app/shared/icons.module';
import { ThemeCustomizerService } from 'src/app/services/theme-customizer/theme-customizer.service';

export interface Course {
  title: string;
  provider: string;
  platform: string;
  subject: string;
  rating: number;
  certificate: boolean;
  cost: string;
  providerLogoUrl: string;
  courseImageUrl: string;
  shortDescription: string;
  instructor: string;
  instructorImage: string;
  reviewsCount: number;
  students: number;
  slug: string;
  duration: string;
  category: string;
  level: string;
  language: string;
  startDate: string;
  price: number;
  link: string;
  image: string
  mode: string;
}

export interface Subject {
  title: string;
  description: string;
  courseCount: number;
}

@Component({
  selector: 'app-course-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSidenavModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    CarouselModule,
    NgxScrollTopModule,
    IconsModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent
  ],
  templateUrl: './course-central.component.html',
  styleUrls: ['./course-central.component.scss']
})
export class CourseDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('sentinel') sentinel!: ElementRef;
  @ViewChild('pageSection') pageSection!: ElementRef;
  
  isSticky = false;
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  paginatedCourses: Course[] = [];
  topCourses: Course[] = [];
  filterForm!: FormGroup;

  pageSize = 20;
  currentPage = 0;
  totalCourses = 0;
  hdrContainer = false;

  subjects: Subject[] = [
    { title: 'Computer Science', description: '', courseCount: 28 },
    { title: 'Business', description: '', courseCount: 15 },
    { title: 'Health & Medicine', description: '', courseCount: 12 },
    { title: 'Data Science', description: '', courseCount: 10 },
    { title: 'Personal Development', description: '', courseCount: 8 },
    { title: 'Mathematics', description: '', courseCount: 6 },
    { title: 'Social Sciences', description: '', courseCount: 6 },
    { title: 'Humanities', description: '', courseCount: 5 },
    { title: 'Education & Teaching', description: '', courseCount: 4 },
    { title: 'Engineering', description: '', courseCount: 4 },
    { title: 'Language Learning', description: '', courseCount: 4 },
    { title: 'Science', description: '', courseCount: 3 },
    { title: 'Arts & Design', description: '', courseCount: 3 }
  ];

  carouselOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    margin: 7,
    nav: false,
    dots: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1.5 },
      960: { items: 1.7 },
      1280: { items: 2.2 },
      1600: { items: 2.5 }
    }
  };

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder, 
    private location: Location,
    public themeService: ThemeCustomizerService
  ) {}

  ngOnInit(): void {
    this.topCourses = [...coursesData.slice(0, 12)];
    this.allCourses = [...this.getCourses()];
    this.filteredCourses = [...this.allCourses];
    this.totalCourses = this.filteredCourses.length;

    this.filterForm = this.fb.group({
      title: [''],
      provider: [''],
      subject: [''],
      mode: [''],
      cost: [''],
      certificate: [''],
      platform: ['']
    });

    this.updatePaginatedCourses();
  }

  getCourses(): Course[] {
    return coursesData;
  }

  filterCourses($event: any, filterSidenav: any): void {
    const filters = this.filterForm.value;
    if (filterSidenav) filterSidenav.close();

    const noFilters = Object.values(filters).every(val =>
      val === null ||
      val === undefined ||
      (typeof val === 'string' && val.trim() === '')
    );

    if (noFilters) {
      this.filteredCourses = [...this.allCourses];
    } else {
      this.filteredCourses = this.allCourses.filter(course => {
        return (
          (!filters.title || course.title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (!filters.provider || course.provider === filters.provider) &&
          (!filters.subject || course.subject === filters.subject) &&
          (!filters.mode || course.mode === filters.mode) &&
          (!filters.cost || course.cost === filters.cost) &&
          (!filters.certificate || (filters.certificate === 'Yes' ? course.certificate : !course.certificate)) &&
          (!filters.platform || course.platform === filters.platform)
        );
      });
    }

    this.currentPage = 0;
    this.totalCourses = this.filteredCourses.length;
    this.updatePaginatedCourses();
  }

  updatePaginatedCourses(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCourses = this.filteredCourses.slice(start, end);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedCourses();
     // ✅ Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.course-grid')?.scrollIntoView({ behavior: 'smooth' });
  }

  getMenuId(course: Course): string {
    return 'menu_' + course.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
  }

  share(course: Course): void {
    const url = course.link;
    if (navigator.share) {
      navigator.share({
        title: course.title,
        url: url
      });
    } else {
      const mailto = `mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(url)}`;
      window.open(mailto, '_blank');
    }
  }

  viewDetails(course: Course): void {
    alert(`Details for "${course.title}"\n\nProvider: ${course.provider}\nRating: ${course.rating} ⭐\nCertificate: ${course.certificate ? 'Yes' : 'No'}\nCost: ${course.cost}`);
  }

  goToCourse(course: Course): void {
    window.open(course.link, '_blank');
  }

  getRandomCardClass(course: Course): string {
    const themes = ['bg-rose', 'bg-skyblue', 'bg-emerald', 'bg-sunset', 'bg-royalblue', 'bg-coral', 'bg-violet', 'bg-mint', 'bg-gold', 'bg-steel'];
    const index = course.title.length % themes.length;
    return themes[index];
  }

  // Add the missing methods for the new UI
  ngAfterViewInit(): void {
    if (this.sentinel && this.pageSection) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.isSticky = !entry.isIntersecting;
        },
        { threshold: [0] }
      );
      
      observer.observe(this.sentinel.nativeElement);
    }
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.location.back();
  }
}
