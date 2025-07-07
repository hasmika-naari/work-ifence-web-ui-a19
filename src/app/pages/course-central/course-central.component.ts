import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Owl Carousel
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';
import { FooterWorkifenceComponent } from '../landing/footer-wifence/footer-wifence.component';
import coursesData from './courses.json'; // Import from same folder
import { MatMenuModule } from '@angular/material/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface Course {
  title: string;
  provider: string;           // e.g., "Harvard"
  platform: string;           // e.g., "edX", "Coursera"
  subject: string;            // e.g., "Computer Science", "Health"
  rating: number;             // e.g., 4.7
  certificate: boolean;       // true if certificate available
  cost: string;               // e.g., "Free", "$49"
  providerLogoUrl: string;    // logo of the platform/provider
  courseImageUrl: string;     // banner/visual image for the course
  link: string;               // course URL
  mode: string;               // "Online" or "In-Class"
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
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    CarouselModule,
    HeaderWorkIfenceComponent,
    FooterWorkifenceComponent
  ],
  templateUrl: './course-central.component.html',
  styleUrls: ['./course-central.component.scss']
})
export class CourseDashboardComponent implements OnInit {
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  topCourses: Course[] = [];
  filterForm!: FormGroup;

  subjects: Subject[] = [
  { "title": "Computer Science", "description": "Courses in programming, algorithms, data structures, and computing systems.", "courseCount": 28 },
  { "title": "Business", "description": "Courses on leadership, marketing, finance, entrepreneurship, and strategy.", "courseCount": 15 },
  { "title": "Health & Medicine", "description": "Covers public health, anatomy, nutrition, and medical technologies.", "courseCount": 12 },
  { "title": "Data Science", "description": "Learn data analysis, statistics, machine learning, and data visualization.", "courseCount": 10 },
  { "title": "Personal Development", "description": "Self-improvement, learning techniques, communication, and mindset courses.", "courseCount": 8 },
  { "title": "Mathematics", "description": "Courses in calculus, algebra, statistics, and applied mathematics.", "courseCount": 6 },
  { "title": "Social Sciences", "description": "Topics like psychology, sociology, political science, and economics.", "courseCount": 6 },
  { "title": "Humanities", "description": "Philosophy, history, literature, and cultural studies.", "courseCount": 5 },
  { "title": "Education & Teaching", "description": "Courses for teachers, educators, and academic professionals.", "courseCount": 4 },
  { "title": "Engineering", "description": "Covers electrical, mechanical, and software engineering topics.", "courseCount": 4 },
  { "title": "Language Learning", "description": "Courses to learn English, Spanish, French, and other languages.", "courseCount": 4 },
  { "title": "Science", "description": "General science topics including biology, physics, and chemistry.", "courseCount": 3 },
  { "title": "Arts & Design", "description": "Covers visual arts, music, design theory, and creativity.", "courseCount": 3 }
]


  carouselOptions = {
    loop: true,
    margin: 7,
    nav: false,
    // navText: [
    //     '<span class="material-symbols-outlined">chevron_left</span>',
    //     '<span class="material-symbols-outlined">chevron_right</span>'
    // ],
    dots: true,
    responsive: {
      0: { items: 1 },
      600: { items: 3 },
      960: { items: 4 },
      1280: { items: 5 },
      1600: { items: 6 }
    }
  };

  constructor(private http: HttpClient, private fb: FormBuilder) {
    
  }

  ngOnInit(): void {
    // this.http.get<Course[]>('./courses.json').subscribe({
    //   next: (data) => {
    //     this.allCourses = data;
    //     this.topCourses = data.slice(0, 6);
    //   },
    //   error: (err) => {
    //     console.error('Failed to load courses:', err);
    //   }
    // });

    // this.allCourses = [...coursesData];
    this.topCourses = [...coursesData.slice(0, 12)];

    this.filterForm = this.fb.group({
      title: [''],
      provider: [''],
      subject: [''],
      mode: [''],
      cost: [''],
      certificate: [''],
      platform: ['']
    });

    // fetch your full course list here
    this.allCourses = [...this.getCourses()]; // mock
    this.filteredCourses = [...this.allCourses];
  }

filterCourses($event: any, filterSidenav: any): void {
  const filters = this.filterForm.value;
   if(filterSidenav){filterSidenav.close()};
  const noFiltersApplied = Object.values(filters).every((val: any) => !val || val.trim?.() === '');

  if (noFiltersApplied) {
    this.filteredCourses = [...this.allCourses];
    return;
  }

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

// Mock course data for demo
getCourses() {
    return coursesData as Course[];
}

  share(course: Course): void {
    const url = course.link;
    if (navigator.share) {
      navigator.share({
        title: course.title,
        url: course.link
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

  getMenuId(course: Course): string {
    return 'menu_' + course.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
    }

  getRandomCardClass(course: Course): string {
    const themes = [
        'bg-rose', 'bg-skyblue', 'bg-emerald', 'bg-sunset',
        'bg-royalblue', 'bg-coral', 'bg-violet',
        'bg-mint', 'bg-gold', 'bg-steel'
    ];
    const index = course.title.length % themes.length;
    return themes[index];
   }
}
