import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'summary-profile-display',
  standalone: true,
  imports: [NgClass, CardModule, ButtonModule],
  templateUrl: './summary-display.component.html',
  styleUrls: ['./summary-display.component.scss']
})
export class SummaryProfileDisplayComponent {
  @Input() summary: string = '';
  @Output() editSummary = new EventEmitter<void>();
  @Output() addSummary = new EventEmitter<void>();
  dummySummary: string = `
    <p><strong>Versatile Full Stack Developer</strong> with 8+ years of experience designing, developing, and deploying robust web applications using modern front-end and back-end technologies.</p>
    <ul>
      <li>Proficient in Angular, React, and Vue.js for building dynamic, responsive UIs.</li>
      <li>Extensive experience with Node.js, Express, and RESTful API development.</li>
      <li>Skilled in server-side programming with Java (Spring Boot) and .NET Core.</li>
      <li>Expertise in database design and management: MongoDB, PostgreSQL, MySQL.</li>
      <li>Implemented authentication and authorization using JWT, OAuth2, and Passport.js.</li>
      <li>Integrated third-party APIs and microservices for payment, messaging, and analytics.</li>
      <li>Developed and maintained CI/CD pipelines using Jenkins, GitHub Actions, and Docker.</li>
      <li>Deployed scalable applications to AWS, Azure, and Google Cloud using Kubernetes and Docker Compose.</li>
      <li>Applied TDD/BDD practices with Jest, Mocha, Jasmine, and Cypress for high test coverage.</li>
      <li>Optimized application performance through code splitting, lazy loading, and caching strategies.</li>
      <li>Led Agile teams, conducted code reviews, and mentored junior developers.</li>
      <li>Collaborated with UI/UX designers to deliver pixel-perfect, accessible interfaces.</li>
      <li>Implemented real-time features using WebSockets and Socket.IO.</li>
      <li>Strong understanding of DevOps, monitoring, and logging (ELK, Prometheus, Grafana).</li>
      <li>Excellent communicator, problem solver, and continuous learner.</li>
    </ul>
  `;
}
