import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, Signal, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, map, startWith } from 'rxjs';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TableRowSelectEvent, TableModule } from 'primeng/table';
import { UserStoreService } from 'src/app/services/store/user-store.service';
import { Resume, ResumeContact } from 'src/app/services/resume.model';
import { PromptService } from 'src/app/services/shared/prompt.service';
import { GenAIService } from 'src/app/services/shared/genai.service';
import { TemplatesService } from 'src/app/services/shared/templates.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ResumeAccess, ResumeCategory, ResumeRoleLevel } from 'src/app/services/store/resume.model';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from 'src/app/pages/landing/header-wifence/header-wifence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-feedback-tab',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, 
    HeaderWorkIfenceComponent,  MatStepperModule,
    MatFormFieldModule,InputTextModule,TableModule,
    MatCheckboxModule, MatAutocompleteModule,
    MatInputModule,ButtonModule,OverlayPanelModule,
    MatButtonModule,AccordionModule,
    MatIconModule,MatExpansionModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class FeedbackComponent implements OnInit, OnDestroy {

  imageBase64: String | null = null; // Define a class property to store the image bytes
  cPage : number = 0
  panelOpenState = true;
  showProfileImage : boolean = false

  private userStore: UserStoreService = inject(UserStoreService);
  sidebarIconOnly: Signal<boolean> = this.userStore.getSidebarIconOnly();
  // resumeTtile : Signal<string> = this.userStore.getCurrentResumeTitle();
  // resumePrimary : Signal<boolean> = this.userStore.getCurrentResumePrimary();
  // resumePublic : Signal<boolean> = this.userStore.getCurrentResumePublic();
  // resumeActive : Signal<boolean> = this.userStore.getCurrentResumeIsActive();
  // resumeCategory : Signal<string> = this.userStore.getCurrentResumeCategory();
  // roleCategory : Signal<string> = this.userStore.getCurrentRoleCategory();
  // accessLevel : Signal<string> = this.userStore.getCurrentAccessLevel();
  resumeSignalForm : Signal<Resume> = this.userStore.getResumeForm();


  visible = true;
  outLineButton = true;
  @Output() contact = new EventEmitter();

  filteredCategories: Array<any> = [];
  filteredRoles : Array<any> = [];
  
  categories: Array<ResumeCategory> = [
    {
      id: 1,
      category: "Front-End Development",
      sub_category: "Angular",
      tags: "HTML, CSS, JavaScript, Angular, TypeScript, Front-End Frameworks"
    },
    {
      id: 2,
      category: "Front-End Development",
      sub_category: "ReactJS",
      tags: "HTML, CSS, JavaScript, React, TypeScript, Front-End Frameworks"
    },
    {
      id: 3,
      category: "Front-End Development",
      sub_category: "Vue.js",
      tags: "HTML, CSS, JavaScript, Vue, TypeScript, Front-End Frameworks"
    },
    {
      id: 4,
      category: "Back-End Development",
      sub_category: "Node.js",
      tags: "Node.js, Express.js, JavaScript, TypeScript, Back-End Frameworks"
    },
    {
      id: 5,
      category: "Back-End Development",
      sub_category: "Java",
      tags: "Java, Spring Boot, Hibernate, Back-End Frameworks"
    },
    {
      id: 6,
      category: "Back-End Development",
      sub_category: "Python",
      tags: "Python, Django, Flask, Back-End Frameworks"
    },
    {
      id: 7,
      category: "Back-End Development",
      sub_category: "Ruby on Rails",
      tags: "Ruby, Rails, Back-End Frameworks"
    },
    {
      id: 8,
      category: "Full Stack Development",
      sub_category: "Full Stack Developer",
      tags: "Front-End, Back-End, JavaScript, HTML, CSS, Node.js, Angular, React, Databases"
    },
    {
      id: 9,
      category: "DevOps",
      sub_category: "DevOps Engineer",
      tags: "CI/CD, Jenkins, Docker, Kubernetes, AWS, Infrastructure Automation"
    },
    {
      id: 10,
      category: "DevOps",
      sub_category: "Site Reliability Engineer (SRE)",
      tags: "SRE, Monitoring, Infrastructure, Automation, Cloud Services"
    },
    {
      id: 11,
      category: "Data Science & Machine Learning",
      sub_category: "Data Scientist",
      tags: "Python, R, SQL, Data Analysis, Machine Learning, Statistics"
    },
    {
      id: 12,
      category: "Data Science & Machine Learning",
      sub_category: "Machine Learning Engineer",
      tags: "Python, TensorFlow, Scikit-learn, Deep Learning, Machine Learning"
    },
    {
      id: 13,
      category: "Cloud Computing",
      sub_category: "Cloud Architect",
      tags: "AWS, Azure, Google Cloud, Cloud Infrastructure, Architecture"
    },
    {
      id: 14,
      category: "Cybersecurity",
      sub_category: "Cybersecurity Engineer",
      tags: "Security, Firewalls, Network Security, Penetration Testing, Risk Management"
    },
    {
      id: 15,
      category: "Cloud Computing",
      sub_category: "Cloud Engineer",
      tags: "AWS, Azure, Google Cloud, Cloud Services, Infrastructure, DevOps"
    },
    {
      id: 16,
      category: "Cloud Computing",
      sub_category: "Cloud Solutions Engineer",
      tags: "Cloud Architecture, AWS, Azure, Google Cloud, Solutions Design"
    },
    {
      id: 17,
      category: "Business Intelligence",
      sub_category: "Business Intelligence Analyst",
      tags: "Data Visualization, Power BI, Tableau, SQL, Data Analysis"
    },
    {
      id: 18,
      category: "Data Science & Machine Learning",
      sub_category: "AI Engineer",
      tags: "Artificial Intelligence, Neural Networks, Deep Learning, TensorFlow, PyTorch"
    },
    {
      id: 19,
      category: "Software Development",
      sub_category: "Software Engineer",
      tags: "Programming, Software Design, Algorithms, Data Structures"
    },
    {
      id: 20,
      category: "Software Development",
      sub_category: "Software Architect",
      tags: "System Design, Architecture Patterns, Software Engineering, Scalability"
    },
    {
      id: 21,
      category: "Quality Assurance",
      sub_category: "QA Automation Engineer",
      tags: "Automation Testing, Selenium, Test Scripts, CI/CD"
    },
    {
      id: 22,
      category: "Quality Assurance",
      sub_category: "Software Test Engineer",
      tags: "Manual Testing, Test Cases, Bug Tracking, QA Processes"
    },
    {
      id: 23,
      category: "Product Management",
      sub_category: "Product Manager",
      tags: "Product Roadmap, Stakeholder Management, Agile, Market Research"
    },
    {
      id: 24,
      category: "Product Management",
      sub_category: "Product Manager (Tech)",
      tags: "Technical Product Management, Roadmapping, Agile, Tech-Product Integration"
    },
    {
      id: 25,
      category: "User Experience",
      sub_category: "UX/UI Designer",
      tags: "User Experience, User Interface Design, Prototyping, Wireframing"
    },
    {
      id: 26,
      category: "Game Development",
      sub_category: "Game Developer",
      tags: "Game Engines, C++, Unity, Unreal Engine, Game Design"
    },
    {
      id: 27,
      category: "Game Development",
      sub_category: "Game Designer",
      tags: "Game Mechanics, Storytelling, Level Design, User Experience"
    },
    {
      id: 28,
      category: "Robotic Process Automation",
      sub_category: "RPA Developer",
      tags: "Robotic Process Automation, UiPath, Automation Scripts"
    },
    {
      id: 29,
      category: "Integration",
      sub_category: "Integration Developer",
      tags: "APIs, Middleware, Data Integration, Systems Integration"
    },
    {
      id: 30,
      category: "Customer Relations",
      sub_category: "Customer Success Manager",
      tags: "Customer Engagement, Account Management, Product Adoption"
    },
    {
      id: 31,
      category: "E-Commerce",
      sub_category: "E-commerce Manager",
      tags: "E-commerce Platforms, Digital Marketing, Sales Strategies, Customer Experience"
    },
    {
      id: 32,
      category: "Business Analysis",
      sub_category: "Business Analyst (Tech)",
      tags: "Requirements Gathering, Process Improvement, Stakeholder Communication"
    },
    {
      id: 33,
      category: "Database Management",
      sub_category: "Database Administrator",
      tags: "Database Design, SQL, Performance Tuning, Data Security"
    },
    {
      id: 34,
      category: "Software Development",
      sub_category: "Embedded Systems Developer",
      tags: "Embedded C, Firmware Development, Hardware Integration"
    },
    {
      id: 35,
      category: "Security",
      sub_category: "Security Software Engineer",
      tags: "Security Protocols, Cryptography, Threat Analysis, Vulnerability Assessment"
    },
    {
      id: 36,
      category: "Professional Management",
      sub_category: "Project Manager",
      tags: "Project Planning, Risk Management, Team Leadership, Project Delivery"
    },
    {
      id: 37,
      category: "Marketing & Sales",
      sub_category: "Digital Marketing Specialist",
      tags: "SEO, SEM, Content Marketing, Social Media, Analytics"
    },
    {
      id: 38,
      category: "Human Resources",
      sub_category: "HR Specialist (Tech)",
      tags: "Recruitment, Employee Relations, HR Tech Systems"
    },
    {
      id: 39,
      category: "Executive Leadership",
      sub_category: "Chief Technology Officer (CTO)",
      tags: "Technology Strategy, Leadership, Innovation, IT Management"
    },
    {
      id: 40,
      category: "Data Science & Machine Learning",
      sub_category: "Data Analytics Engineer",
      tags: "Data Analysis, Data Engineering, SQL, Python, Data Visualization"
    },
    {
      id: 41,
      category: "Technical Support",
      sub_category: "Technical Support Specialist",
      tags: "Customer Support, Troubleshooting, Technical Assistance, Help Desk"
    },
    {
      id: 42,
      category: "Technical Writing",
      sub_category: "Technical Writer",
      tags: "Documentation, Technical Communication, User Manuals, API Documentation"
    },
    {
      id: 43,
      category: "Business Intelligence",
      sub_category: "BI Developer",
      tags: "Data Warehousing, BI Tools, ETL, SQL, Report Development"
    },
    {
      id: 44,
      category: "Networking",
      sub_category: "Network Engineer",
      tags: "Network Configuration, Routing, Switching, Network Security"
    },
    {
      id: 45,
      category: "Networking",
      sub_category: "Network Administrator",
      tags: "Network Management, System Maintenance, Network Troubleshooting"
    },
    {
      id: 46,
      category: "Blockchain",
      sub_category: "Blockchain Developer",
      tags: "Blockchain, Smart Contracts, Ethereum, Solidity, Cryptocurrency"
    },
    {
      id: 47,
      category: "Augmented & Virtual Reality",
      sub_category: "AR/VR Developer",
      tags: "Augmented Reality, Virtual Reality, Unity, Unreal Engine, 3D Modeling"
    },
    {
      id: 48,
      category: "Data Science & Machine Learning",
      sub_category: "Quantitative Analyst",
      tags: "Quantitative Analysis, Financial Modeling, Data Analysis, Statistical Tools"
    },
    {
      id: 49,
      category: "Automation",
      sub_category: "Automation Engineer",
      tags: "Process Automation, Automation Tools, Scripting, Workflow Automation"
    },
    {
      id: 50,
      category: "Technical Project Management",
      sub_category: "Technical Project Manager",
      tags: "Project Management, Agile Methodologies, Technical Coordination, Delivery Management"
    },
    {
      id: 51,
      category: "Software Development",
      sub_category: "JavaScript Developer",
      tags: "JavaScript, ES6, Node.js, Front-End Development, Web Development"
    },
    {
      id: 52,
      category: "Software Development",
      sub_category: "TypeScript Developer",
      tags: "TypeScript, Angular, React, Static Typing, Front-End Development"
    },
    {
      id: 53,
      category: "Mobile Development",
      sub_category: "iOS Developer",
      tags: "Swift, Objective-C, iOS SDK, Xcode, Mobile App Development"
    },
    {
      id: 54,
      category: "Mobile Development",
      sub_category: "Android Developer",
      tags: "Java, Kotlin, Android SDK, Mobile App Development, Android Studio"
    },
    {
      id: 55,
      category: "Mobile Development",
      sub_category: "Cross-Platform Developer",
      tags: "React Native, Flutter, Xamarin, Mobile App Development"
    },
    {
      id: 56,
      category: "Database Management",
      sub_category: "Data Engineer",
      tags: "Data Engineering, ETL, Big Data, SQL, Data Pipelines"
    },
    {
      id: 57,
      category: "Database Management",
      sub_category: "Database Developer",
      tags: "SQL, NoSQL, Database Design, Performance Tuning, Data Modeling"
    },
    {
      id: 58,
      category: "Software Testing",
      sub_category: "Test Automation Engineer",
      tags: "Test Automation, Selenium, Test Scripts, QA, Continuous Integration"
    },
    {
      id: 59,
      category: "User Experience",
      sub_category: "UX Researcher",
      tags: "User Research, Usability Testing, User Interviews, Persona Development"
    },
    {
      id: 60,
      category: "User Experience",
      sub_category: "UI Designer",
      tags: "User Interface Design, Wireframing, Prototyping, Design Systems"
    },
    {
      id: 61,
      category: "Sales Engineering",
      sub_category: "Sales Engineer",
      tags: "Technical Sales, Product Demonstrations, Solution Selling, Pre-Sales Support"
    },
    {
      id: 62,
      category: "Business Analysis",
      sub_category: "Business Systems Analyst",
      tags: "Systems Analysis, Requirements Gathering, Process Improvement, Business Processes"
    },
    {
      id: 63,
      category: "Product Management",
      sub_category: "Product Owner",
      tags: "Product Ownership, Agile Scrum, Product Backlog Management, Stakeholder Communication"
    },
    {
      id: 64,
      category: "Digital Marketing",
      sub_category: "SEO Specialist",
      tags: "Search Engine Optimization, Keyword Research, On-Page SEO, Off-Page SEO"
    },
    {
      id: 65,
      category: "Digital Marketing",
      sub_category: "Content Marketing Specialist",
      tags: "Content Strategy, Content Creation, Blogging, SEO"
    },
    {
      id: 66,
      category: "Business Intelligence",
      sub_category: "Data Visualization Specialist",
      tags: "Data Visualization, Power BI, Tableau, Dashboards, Reporting"
    },
    {
      id: 67,
      category: "E-Commerce",
      sub_category: "E-Commerce Developer",
      tags: "E-Commerce Platforms, Shopify, Magento, WooCommerce, Online Stores"
    },
    {
      id: 68,
      category: "Technical Support",
      sub_category: "IT Support Specialist",
      tags: "IT Support, Hardware Troubleshooting, Software Support, System Maintenance"
    },
    {
      id: 69,
      category: "Business Analysis",
      sub_category: "Product Analyst",
      tags: "Product Analysis, Market Research, Data Analysis, Product Metrics"
    },
    {
      id: 70,
      category: "Data Science & Machine Learning",
      sub_category: "Business Intelligence Developer",
      tags: "BI Tools, Data Analysis, Reporting, Data Warehousing"
    },
    {
      id: 71,
      category: "Networking",
      sub_category: "Network Security Engineer",
      tags: "Network Security, Firewalls, Intrusion Detection, Security Policies"
    },
    {
      id: 72,
      category: "Security",
      sub_category: "Information Security Analyst",
      tags: "Information Security, Risk Management, Security Policies, Vulnerability Assessment"
    },
    {
      id: 73,
      category: "Game Development",
      sub_category: "Game Artist",
      tags: "3D Modeling, Game Art, Animation, Texturing"
    },
    {
      id: 74,
      category: "Cloud Computing",
      sub_category: "Cloud Consultant",
      tags: "Cloud Strategy, Cloud Migration, Cloud Solutions, Consulting"
    },
    {
      id: 75,
      category: "Software Development",
      sub_category: "C++ Developer",
      tags: "C++, Object-Oriented Programming, Systems Programming, Performance Optimization"
    },
    {
      id: 76,
      category: "Software Development",
      sub_category: "PHP Developer",
      tags: "PHP, Laravel, CodeIgniter, Web Development, Server-Side Scripting"
    },
    {
      id: 77,
      category: "Software Development",
      sub_category: "Go Developer",
      tags: "Go (Golang), Concurrency, Microservices, Server-Side Development"
    },
    {
      id: 78,
      category: "Software Development",
      sub_category: "Scala Developer",
      tags: "Scala, Functional Programming, Akka, Big Data, Spark"
    },
    {
      id: 79,
      category: "Automation",
      sub_category: "Test Automation Architect",
      tags: "Test Automation Strategy, Framework Design, Test Scripts, Automation Tools"
    },
    {
      id: 80,
      category: "Digital Marketing",
      sub_category: "PPC Specialist",
      tags: "Pay-Per-Click Advertising, Google Ads, Bing Ads, Campaign Management"
    },
    {
      id: 81,
      category: "Business Analysis",
      sub_category: "Financial Analyst",
      tags: "Financial Modeling, Data Analysis, Budgeting, Forecasting"
    },
    {
      id: 82,
      category: "Technical Writing",
      sub_category: "API Documentation Specialist",
      tags: "API Documentation, Technical Writing, RESTful APIs, Swagger"
    },
    {
      id: 83,
      category: "Sales Engineering",
      sub_category: "Pre-Sales Engineer",
      tags: "Pre-Sales Support, Solution Engineering, Technical Presentations, Customer Requirements"
    },
    {
      id: 84,
      category: "User Experience",
      sub_category: "Interaction Designer",
      tags: "Interaction Design, User Flows, Wireframes, Prototyping"
    },
    {
      id: 85,
      category: "Software Development",
      sub_category: "Systems Programmer",
      tags: "Systems Programming, C/C++, Operating Systems, Low-Level Programming"
    },
    {
      id: 86,
      category: "Cybersecurity",
      sub_category: "Penetration Tester",
      tags: "Penetration Testing, Ethical Hacking, Security Vulnerabilities, Risk Assessment"
    },
    {
      id: 87,
      category: "Business Intelligence",
      sub_category: "Data Warehouse Architect",
      tags: "Data Warehousing, ETL, Data Modeling, Data Architecture"
    },
    {
      id: 88,
      category: "Cloud Computing",
      sub_category: "Cloud Security Specialist",
      tags: "Cloud Security, Risk Management, Security Compliance, Cloud Platforms"
    },
    {
      id: 89,
      category: "E-Commerce",
      sub_category: "E-Commerce Product Manager",
      tags: "E-Commerce Strategy, Product Development, Customer Experience, Online Retail"
    },
    {
      id: 90,
      category: "Game Development",
      sub_category: "Game Producer",
      tags: "Game Production, Project Management, Game Development Cycle, Team Coordination"
    },
    {
      id: 91,
      category: "Networking",
      sub_category: "Wireless Network Engineer",
      tags: "Wireless Networks, Wi-Fi, Network Design, Wireless Technologies"
    },
    {
      id: 92,
      category: "Technical Support",
      sub_category: "IT Consultant",
      tags: "IT Consulting, System Design, Infrastructure, Client Solutions"
    },
    {
      id: 93,
      category: "Data Science & Machine Learning",
      sub_category: "Data Science Manager",
      tags: "Data Science Leadership, Team Management, Data Strategy, Machine Learning"
    },
    {
      id: 94,
      category: "Business Analysis",
      sub_category: "Requirements Analyst",
      tags: "Requirements Gathering, Business Analysis, Process Mapping, Stakeholder Management"
    },
    {
      id: 95,
      category: "Software Development",
      sub_category: "Embedded Systems Engineer",
      tags: "Embedded Systems, Firmware Development, C/C++, Hardware Integration"
    },
    {
      id: 96,
      category: "Cybersecurity",
      sub_category: "Incident Responder",
      tags: "Incident Response, Cybersecurity Incidents, Forensics, Threat Analysis"
    },
    {
      id: 97,
      category: "Cloud Computing",
      sub_category: "Cloud Operations Engineer",
      tags: "Cloud Operations, Infrastructure Management, Cloud Platforms, Automation"
    },
    {
      id: 98,
      category: "Business Intelligence",
      sub_category: "BI Architect",
      tags: "BI Architecture, Data Modeling, BI Tools, Strategic Planning"
    },
    {
      id: 99,
      category: "Digital Marketing",
      sub_category: "Email Marketing Specialist",
      tags: "Email Campaigns, Marketing Automation, List Management, Performance Analysis"
    },
    {
      id: 100,
      category: "Game Development",
      sub_category: "Game Programmer",
      tags: "Game Programming, C++, Game Engines, Gameplay Mechanics"
    },
    {
      id: 101,
      category: "Data Science & Machine Learning",
      sub_category: "Data Science Consultant",
      tags: "Data Science Strategy, Consulting, Data Analysis, Machine Learning Models"
    },
    {
      id: 102,
      category: "Software Development",
      sub_category: "Software Development Manager",
      tags: "Team Management, Software Development Lifecycle, Project Coordination"
    },
    {
      id: 103,
      category: "Mobile Development",
      sub_category: "Mobile App Designer",
      tags: "Mobile UI/UX Design, App Prototyping, User Experience, Mobile Platforms"
    },
    {
      id: 104,
      category: "Cybersecurity",
      sub_category: "Network Security Architect",
      tags: "Network Security, Security Architecture, Threat Modeling, Risk Management"
    },
    {
      id: 105,
      category: "Cloud Computing",
      sub_category: "Cloud Platform Engineer",
      tags: "Cloud Platforms, Platform Management, Cloud Architecture, Automation"
    },
    {
      id: 106,
      category: "Business Intelligence",
      sub_category: "Data Analyst",
      tags: "Data Analysis, Reporting, SQL, Data Visualization"
    },
    {
      id: 107,
      category: "Business Analysis",
      sub_category: "Change Management Specialist",
      tags: "Change Management, Process Improvement, Stakeholder Communication, Project Management"
    },
    {
      id: 108,
      category: "E-Commerce",
      sub_category: "E-Commerce Operations Manager",
      tags: "E-Commerce Operations, Inventory Management, Logistics, Customer Service"
    },
    {
      id: 109,
      category: "Networking",
      sub_category: "Network Architect",
      tags: "Network Design, Network Architecture, Scalability, Network Solutions"
    },
    {
      id: 110,
      category: "Game Development",
      sub_category: "Game Sound Designer",
      tags: "Game Audio, Sound Effects, Music Composition, Audio Engineering"
    },
    {
      id: 111,
      category: "Automation",
      sub_category: "Robotic Process Automation (RPA) Consultant",
      tags: "RPA Implementation, UiPath, Automation Strategy, Process Optimization"
    },
    {
      id: 112,
      category: "Data Science & Machine Learning",
      sub_category: "Data Science Researcher",
      tags: "Data Science Research, Machine Learning Research, Algorithms, Statistical Models"
    },
    {
      id: 113,
      category: "Technical Support",
      sub_category: "Help Desk Technician",
      tags: "Help Desk Support, Technical Troubleshooting, Customer Assistance, Ticket Management"
    },
    {
      id: 114,
      category: "User Experience",
      sub_category: "UX Strategist",
      tags: "UX Strategy, User Research, Experience Design, User Journey Mapping"
    },
    {
      id: 115,
      category: "Technical Writing",
      sub_category: "Content Writer (Tech)",
      tags: "Technical Content, Blogging, Content Strategy, Technical Documentation"
    },
    {
      id: 116,
      category: "Digital Marketing",
      sub_category: "Social Media Manager",
      tags: "Social Media Strategy, Content Creation, Social Media Analytics, Brand Management"
    },
    {
      id: 117,
      category: "Software Development",
      sub_category: "API Developer",
      tags: "API Development, RESTful APIs, API Integration, Software Design"
    },
    {
      id: 118,
      category: "Business Intelligence",
      sub_category: "Data Science Engineer",
      tags: "Data Engineering, Data Science, Machine Learning, Data Processing"
    },
    {
      id: 119,
      category: "Cloud Computing",
      sub_category: "Cloud Systems Engineer",
      tags: "Cloud Systems, Infrastructure Management, Cloud Solutions, Deployment"
    },
    {
      id: 120,
      category: "Security",
      sub_category: "Chief Information Security Officer (CISO)",
      tags: "Information Security Leadership, Security Strategy, Risk Management, Compliance"
    },
    {
      id: 121,
      category: "Software Development",
      sub_category: "Software Development Intern",
      tags: "Internship, Software Development, Learning, Project Assistance"
    },
    {
      id: 122,
      category: "Game Development",
      sub_category: "Game Quality Assurance Tester",
      tags: "Game Testing, Bug Reporting, Quality Assurance, Gameplay Analysis"
    },
    {
      id: 123,
      category: "Data Science & Machine Learning",
      sub_category: "Data Scientist (Healthcare)",
      tags: "Healthcare Data Analysis, Machine Learning, Predictive Modeling, Data Insights"
    },
    {
      id: 124,
      category: "Business Analysis",
      sub_category: "Business Process Analyst",
      tags: "Business Processes, Process Improvement, Workflow Analysis, Business Metrics"
    },
    {
      id: 125,
      category: "Software Development",
      sub_category: "Blockchain Developer",
      tags: "Blockchain Technology, Smart Contracts, Cryptocurrencies, Decentralized Applications"
    }
  ]

  experienceCategory : Array<string> = ["0", "1<", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "15+"]
  

  accessCategories: Array<ResumeAccess> = [
    {
      id: 1,
      access_category: 'PUBLIC',
      access_description: 'Public',
      tags: ''
    },
    {
      id : 2,
      access_category : 'PRIVATE',
      access_description: 'Private',
      tags : ''
    },
    {
      id : 3,
      access_category : 'PRIVATE_ONLY_EMPLOYER',
      access_description: 'Only Employer',
      tags : ''
    },
    {
      id : 4,
      access_category : 'PUBLIC_ONLY_EMPLOYER',
      access_description: 'Public & Only Employer',
      tags : ''
    },
    {
      id : 5,
      access_category : 'PRIVATE_ONLY_EMPLOYER',
      access_description: 'Private & Only Employer',
      tags : ''
    }
  ]

  roleCategories : Array<ResumeRoleLevel>=[
    { id: 1, role_level: 'Mid Level', role_level_desc: 'Full Stack Developer', tags: '' },
    { id: 2, role_level: 'Mid Level', role_level_desc: 'Front-End Developer', tags: '' },
    { id: 3, role_level: 'Mid Level', role_level_desc: 'Back-End Developer', tags: '' },
    { id: 4, role_level: 'Mid Level', role_level_desc: 'DevOps Engineer', tags: '' },
    { id: 5, role_level: 'Mid Level', role_level_desc: 'Data Scientist', tags: '' },
    { id: 6, role_level: 'Mid Level', role_level_desc: 'Machine Learning Engineer', tags: '' },
    { id: 7, role_level: 'Mid Level', role_level_desc: 'Artificial Intelligence (AI) Engineer', tags: '' },
    { id: 8, role_level: 'Senior Level', role_level_desc: 'Cloud Architect', tags: '' },
    { id: 9, role_level: 'Mid Level', role_level_desc: 'Cybersecurity Engineer', tags: '' },
    { id: 10, role_level: 'Mid Level', role_level_desc: 'Software Engineer', tags: '' },
    { id: 11, role_level: 'Mid Level', role_level_desc: 'Mobile App Developer', tags: '' },
    { id: 12, role_level: 'Mid Level', role_level_desc: 'Blockchain Developer', tags: '' },
    { id: 13, role_level: 'Senior Level', role_level_desc: 'Site Reliability Engineer (SRE)', tags: '' },
    { id: 14, role_level: 'Senior Level', role_level_desc: 'Product Manager (Tech)', tags: '' },
    { id: 15, role_level: 'Mid Level', role_level_desc: 'UX/UI Designer', tags: '' },
    { id: 16, role_level: 'Mid Level', role_level_desc: 'Data Engineer', tags: '' },
    { id: 17, role_level: 'Mid Level', role_level_desc: 'QA Automation Engineer', tags: '' },
    { id: 18, role_level: 'Senior Level', role_level_desc: 'Software Architect', tags: '' },
    { id: 19, role_level: 'Mid Level', role_level_desc: 'Systems Engineer', tags: '' },
    { id: 20, role_level: 'Mid Level', role_level_desc: 'API Developer', tags: '' },
    { id: 21, role_level: 'Mid Level', role_level_desc: 'AR/VR Developer', tags: '' },
    { id: 22, role_level: 'Mid Level', role_level_desc: 'IoT Developer', tags: '' },
    { id: 23, role_level: 'Senior Level', role_level_desc: 'Solutions Architect', tags: '' },
    { id: 24, role_level: 'Mid Level', role_level_desc: 'IT Security Analyst', tags: '' },
    { id: 25, role_level: 'Senior Level', role_level_desc: 'Technical Lead', tags: '' },
    { id: 26, role_level: 'Mid Level', role_level_desc: 'Embedded Systems Developer', tags: '' },
    { id: 27, role_level: 'Mid Level', role_level_desc: 'Game Developer', tags: '' },
    { id: 28, role_level: 'Mid Level', role_level_desc: 'Robotic Process Automation (RPA) Developer', tags: '' },
    { id: 29, role_level: 'Mid Level', role_level_desc: 'DevSecOps Engineer', tags: '' },
    { id: 30, role_level: 'Mid Level', role_level_desc: 'Cloud Engineer', tags: '' },
    { id: 31, role_level: 'Mid Level', role_level_desc: 'Big Data Engineer', tags: '' },
    { id: 32, role_level: 'Mid Level', role_level_desc: 'Business Analyst (Tech)', tags: '' },
    { id: 33, role_level: 'Mid Level', role_level_desc: 'Database Administrator', tags: '' },
    { id: 34, role_level: 'Mid Level', role_level_desc: 'Integration Developer', tags: '' },
    { id: 35, role_level: 'Mid Level', role_level_desc: 'AI/ML Research Scientist', tags: '' },
    { id: 36, role_level: 'Mid Level', role_level_desc: 'CRM Developer (Salesforce, HubSpot)', tags: '' },
    { id: 37, role_level: 'Mid Level', role_level_desc: 'E-commerce Software Developer', tags: '' },
    { id: 38, role_level: 'Mid Level', role_level_desc: 'No-Code/Low-Code Developer', tags: '' },
    { id: 39, role_level: 'Mid Level', role_level_desc: 'API Integration Specialist', tags: '' },
    { id: 40, role_level: 'Mid Level', role_level_desc: 'Software Test Engineer', tags: '' },
    { id: 41, role_level: 'Senior Level', role_level_desc: 'Digital Transformation Specialist', tags: '' },
    { id: 42, role_level: 'Mid Level', role_level_desc: 'Software Development Engineer in Test (SDET)', tags: '' },
    { id: 43, role_level: 'Mid Level', role_level_desc: 'IT Support Engineer (Software)', tags: '' },
    { id: 44, role_level: 'Mid Level', role_level_desc: 'Platform Engineer', tags: '' },
    { id: 45, role_level: 'Mid Level', role_level_desc: 'Data Analytics Engineer', tags: '' },
    { id: 46, role_level: 'Senior Level', role_level_desc: 'Release Manager', tags: '' },
    { id: 47, role_level: 'Mid Level', role_level_desc: 'Security Software Engineer', tags: '' },
    { id: 48, role_level: 'Mid Level', role_level_desc: 'Cloud Solutions Engineer', tags: '' },
    { id: 49, role_level: 'Mid Level', role_level_desc: 'ERP Software Developer', tags: '' },
    { id: 50, role_level: 'Mid Level', role_level_desc: 'Game Designer (Tech)', tags: '' },
    { id: 51, role_level: 'Senior Level', role_level_desc: 'Project Manager', tags: '' },
    { id: 52, role_level: 'Senior Level', role_level_desc: 'Product Manager', tags: '' },
    { id: 53, role_level: 'Mid Level', role_level_desc: 'Business Intelligence Analyst', tags: '' },
    { id: 54, role_level: 'Mid Level', role_level_desc: 'Salesforce Administrator', tags: '' },
    { id: 55, role_level: 'Senior Level', role_level_desc: 'Operations Manager', tags: '' },
    { id: 56, role_level: 'Mid Level', role_level_desc: 'Customer Success Manager', tags: '' },
    { id: 57, role_level: 'Mid Level', role_level_desc: 'Digital Marketing Specialist', tags: '' },
    { id: 58, role_level: 'Mid Level', role_level_desc: 'E-commerce Manager', tags: '' },
    { id: 59, role_level: 'Mid Level', role_level_desc: 'HR Specialist (Tech)', tags: '' },
    { id: 60, role_level: 'Executive Level', role_level_desc: 'Chief Technology Officer (CTO)', tags: '' }
  ]
  
  private _formBuilder: FormBuilder = inject(FormBuilder);

  constructor(
      private router : Router, 
      private cdr: ChangeDetectorRef,
      private routeActivated: ActivatedRoute,
      public promptService : PromptService, 
      public genaiService : GenAIService, 
      public templateService : TemplatesService, 
      public dialog: MatDialog) {
        effect(()=>{
        //   this.setContactValues()
        })
      }

 
  subs: Array<Subscription> = [];

  applicationForm = this._formBuilder.group({
    job_role: [''],
    company_name: [''],
    location : [''],
    email_provided : [''],
    applied_date: [''],
    job_type: [''],
    job_mode: [''],
    job_reference_url : [''],
    job_description : [''],
    status : ['']
  })

  categoryValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = this.filteredCategories.some(cat => cat.sub_category === value);
      return isValid ? null : { 'invalidCategory': { value } };
    };
  }

  roleValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = this.filteredRoles.some(cat => cat.role_level_desc === value);
      return isValid ? null : { 'invalidRole': { value } };
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggle() {
}

  ngOnInit() {
    this.filteredCategories = [...this.categories];
    this.filteredRoles = [...this.roleCategories]
    this.subs.push(this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('/resumes/resume')) {
        // The current active route matches the desired route
        // console.log('Current route matches the desired route');
        this.userStore.updateSidebar(true);
      } else if(currentUrl.includes('/user/resumes')){
        this.userStore.updateSidebar(false);
        // The current active route does not match the desired route
        console.log('Current route does not match the desired route');
      }
    }));

    // this.applicationForm.controls['category'].valueChanges.subscribe(val => {
    //   if(val){
    //     this.filteredCategories = [...this._filterCategory(val)];
    //   }else{
    //     this.filteredCategories = [...this.categories];
    //   }
    // });

    // this.applicationForm.controls['roleLevel'].valueChanges.subscribe(val =>{
    //   if(val){
    //     this.filteredRoles = [...this._filterRole(val)];
    //   }else{
    //     this.filteredRoles = [...this.roleCategories];
    //   }
    // })
    // this.userStore.updateSidebar(true);
  }

  displayFn(category: any): string {
    return category && category.sub_category ? category.sub_category : '';
  }

  private _filterCategory(title: string): any[] {
    return this.categories.filter(cat => cat.sub_category.toLowerCase().indexOf(title.toLowerCase()) === 0);
  }

  private _filterRole(title : string): any[]{
    return this.roleCategories.filter(cat => cat.role_level_desc.toLowerCase().indexOf(title.toLowerCase()) === 0);
  }

//   setContactValues(){
//     this.applicationForm.controls['title'].setValue(this.resumeSignalForm().title);
//     this.applicationForm.controls['category'].setValue(this.resumeSignalForm().resume_category);
//     this.applicationForm.controls['roleLevel'].setValue(this.resumeSignalForm().role_category);
//     this.applicationForm.controls['access'].setValue(this.resumeSignalForm().access_level);
//     this.applicationForm.controls['isPrimary'].setValue(this.resumeSignalForm().isPrimary);
//     this.applicationForm.controls['isActive'].setValue(this.resumeSignalForm().isActive);
//   }

//   saveAndContinue(display : String | null){
//     this.markFormGroupTouched(this.applicationForm);
//     let resume_form = this.resumeSignalForm();
//     resume_form.title = this.applicationForm.controls['title'].value?.toString() || '';
//     resume_form.resume_category = this.applicationForm.controls['category'].value?.toString() || '';
//     resume_form.isPrimary = this.applicationForm.controls['isPrimary'].value || false;
//     resume_form.isActive = this.applicationForm.controls['isActive'].value || false;
//     resume_form.role_category = this.applicationForm.controls['roleLevel'].value?.toString() || '';
//     resume_form.access_level = this.applicationForm.controls['access'].value?.toString() || '';
//     this.userStore.updateResumeForm(resume_form);
//     this.contact.emit();
//   }


  closeSheet(){
    const sheet = document.getElementById("sheet");
    if (sheet) {
      sheet.classList.remove("open");
    }
  }

  currentTab = 'tab1';
  switchTab(event: MouseEvent, tab: string) {
      event.preventDefault();
      this.currentTab = tab;
  }

  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

