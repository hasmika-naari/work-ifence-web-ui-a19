import { Component, computed, inject } from '@angular/core';
import { ThemeCustomizerService } from '../../../common2/theme-customizer/theme-customizer.service';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnimateOnScrollDirective } from 'src/app/shared/directives/animate-on-scroll.directive';
import { Course } from '../../course-central/course-central.component';
import { MatMenuModule } from '@angular/material/menu';
import { RemoteConfigFacadeService } from 'src/app/facades/remote-config-facade.service';

@Component({
    selector: 'app-hometwo-courses',
    standalone: true,
    imports: [CommonModule, NgClass, RouterLink, MatButtonModule, MatMenuModule, MatIconModule, AnimateOnScrollDirective],
    templateUrl: './hometwo-courses.component.html',
    styleUrls: ['./hometwo-courses.component.scss']
})
export class HometwoCoursesComponent {

    isToggled = false;

    private readonly remoteConfig = inject(RemoteConfigFacadeService);
    readonly courseCentralEnabled = computed(() => this.remoteConfig.isFlagEnabled('COURSE_CENTRAL'));

    courses: Course[] = [
    {
        image: 'images/courses/courses1.jpg',
        title: 'Mastering JavaScript Essentials',
        shortDescription: 'Get hands-on with modern JavaScript for frontend & backend apps.',
        instructor: 'Jane Doe',
        instructorImage: 'images/user1.jpg',
        rating: 4.7,
        reviewsCount: 132,
        students: 3200,
        slug: 'mastering-javascript',
        category: 'Technology',
        provider: 'Online Academy',
        platform: 'Web',
        subject: 'JavaScript',
        certificate: true,
        duration: '8h',
        level: 'Intermediate',
        language: 'English',
        price: 49.99,
        startDate: '2024-07-01',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses2.jpg',
        title: 'Python for Data Science',
        shortDescription: 'Explore data analysis and visualization using Python.',
        instructor: 'John Smith',
        instructorImage: 'images/user2.jpg',
        rating: 4.8,
        reviewsCount: 210,
        students: 4500,
        slug: 'python-data-science',
        category: 'Technology',
        provider: 'Online Academy',
        platform: 'Web',
        subject: 'Python',
        certificate: true,
        duration: '10h',
        level: 'Beginner',
        language: 'English',
        price: 59.99,
        startDate: '2024-07-10',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses3.jpg',
        title: 'Computer Networks & Security',
        shortDescription: 'Understand TCP/IP, routing, firewalls, and secure architecture.',
        instructor: 'Alice Johnson',
        instructorImage: 'images/user5.jpg',
        rating: 4.6,
        reviewsCount: 89,
        students: 1300,
        slug: 'computer-networks-security',
        category: 'Computer Science',
        provider: 'Tech Institute',
        platform: 'Web',
        subject: 'Networking',
        certificate: true,
        duration: '12h',
        level: 'Advanced',
        language: 'English',
        price: 69.99,
        startDate: '2024-08-01',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses4.jpg',
        title: 'Data Structures & Algorithms',
        shortDescription: 'Crack interviews with in-depth knowledge of DSA in Java.',
        instructor: 'Robert Lee',
        instructorImage: 'images/user6.jpg',
        rating: 4.9,
        reviewsCount: 301,
        students: 5200,
        slug: 'data-structures-algorithms',
        category: 'Computer Science',
        provider: 'Tech Institute',
        platform: 'Web',
        subject: 'Algorithms',
        certificate: true,
        duration: '15h',
        level: 'Advanced',
        language: 'English',
        price: 79.99,
        startDate: '2024-08-15',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses5.jpg',
        title: 'Full Stack Web Development',
        shortDescription: 'Build real apps using Angular, Node, Express & MongoDB.',
        instructor: 'Clara West',
        instructorImage: 'images/user1.jpg',
        rating: 4.8,
        reviewsCount: 180,
        students: 3900,
        slug: 'fullstack-web-dev',
        category: 'Development',
        provider: 'Dev School',
        platform: 'Web',
        subject: 'Web Development',
        certificate: true,
        duration: '20h',
        level: 'Intermediate',
        language: 'English',
        price: 99.99,
        startDate: '2024-09-01',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses6.jpg',
        title: 'Spanish for Beginners',
        shortDescription: 'Learn conversational Spanish with real-life examples.',
        instructor: 'Carlos Mendes',
        instructorImage: 'images/user2.jpg',
        rating: 4.5,
        reviewsCount: 110,
        students: 2500,
        slug: 'spanish-beginners',
        category: 'Language',
        provider: 'Language Hub',
        platform: 'Web',
        subject: 'Spanish',
        certificate: true,
        duration: '6h',
        level: 'Beginner',
        language: 'Spanish',
        price: 39.99,
        startDate: '2024-07-15',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses7.jpg',
        title: 'Business English Mastery',
        shortDescription: 'Boost your career with fluent business communication.',
        instructor: 'Emily Turner',
        instructorImage: 'images/user3.jpg',
        rating: 4.7,
        reviewsCount: 145,
        students: 3100,
        slug: 'business-english',
        category: 'Language',
        provider: 'Language Hub',
        platform: 'Web',
        subject: 'English',
        certificate: true,
        duration: '8h',
        level: 'Intermediate',
        language: 'English',
        price: 49.99,
        startDate: '2024-07-20',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses8.jpg',
        title: 'Project Management Pro',
        shortDescription: 'Manage teams, deliver projects, and grow leadership.',
        instructor: 'Mark Davidson',
        instructorImage: 'images/user4.jpg',
        rating: 4.6,
        reviewsCount: 190,
        students: 3400,
        slug: 'project-management-pro',
        category: 'Management',
        provider: 'Business School',
        platform: 'Web',
        subject: 'Project Management',
        certificate: true,
        duration: '10h',
        level: 'Advanced',
        language: 'English',
        price: 89.99,
        startDate: '2024-09-10',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses1.jpg',
        title: 'Photography Essentials',
        shortDescription: 'Master camera settings and capture stunning visuals.',
        instructor: 'Laura Kim',
        instructorImage: 'images/user5.jpg',
        rating: 4.7,
        reviewsCount: 160,
        students: 2800,
        slug: 'photography-essentials',
        category: 'Photography',
        provider: 'Photo Academy',
        platform: 'Web',
        subject: 'Photography',
        certificate: true,
        duration: '7h',
        level: 'Beginner',
        language: 'English',
        price: 59.99,
        startDate: '2024-08-05',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    },
    {
        image: 'images/courses/courses2.jpg',
        title: 'Advanced Lightroom Techniques',
        shortDescription: 'Edit like a pro and create breathtaking portfolios.',
        instructor: 'Derek Young',
        instructorImage: 'images/user6.jpg',
        rating: 4.9,
        reviewsCount: 220,
        students: 4100,
        slug: 'lightroom-advanced',
        category: 'Photography',
        provider: 'Photo Academy',
        platform: 'Web',
        subject: 'Lightroom',
        certificate: true,
        duration: '9h',
        level: 'Advanced',
        language: 'English',
        price: 69.99,
        startDate: '2024-08-20',
        cost: '',
        providerLogoUrl: '',
        courseImageUrl: '',
        link: '',
        mode: ''
    }
    ];

    categoryTabs = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7'];

    getCoursesForTab(tab: string): Course[] {
    if (tab === 'tab1') return this.courses;
    return this.courses.filter(c => c.category === this.getCategoryFromTab(tab));
    }

    getCategoryFromTab(tab: string): string {
    const map: { [key: string]: string } = {
        tab2: 'Technology',
        tab3: 'Computer Science',
        tab4: 'Development',
        tab5: 'Language',
        tab6: 'Management',
        tab7: 'Photography',
    };
    return map[tab] || '';
    }

	
    constructor(
        public themeService: ThemeCustomizerService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // for tab click event
    currentTab = 'tab2';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

  getCoursesByCategory(category: string) {
    return this.courses.filter(c => c.category === category);
  }

    goToCourse(course: Course): void {
      window.open(course.link, '_blank');
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
    getMenuId(course: Course): string {
        return 'menu_' + course.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
    }

}