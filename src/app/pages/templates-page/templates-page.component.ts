import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../home-page-one/footer/footer.component';
import { HeaderWorkIfenceComponent } from '../landing/header-wifence/header-wifence.component';


interface Template {
  name: string;
  image: string;
  helpfulCount: number;
}

@Component({
  selector: 'app-templates-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,ReactiveFormsModule, FormsModule, HeaderWorkIfenceComponent],
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page.component.scss']
})
export class TemplatesPageComponent {
  templates: Template[] = [
    { name: 'delloite_template', image: 'assets/img/templates/template1.jpg', helpfulCount: 1000 },
    { name: 'devresume_template', image: 'assets/img/templates/template2.png', helpfulCount: 750 },
    { name: 'Template 3', image: 'assets/img/templates/template3.png', helpfulCount: 1200 }
    // Add more templates here
  ];

  constructor(private router : Router){

  }

  showButton: boolean = false;

  toggleButton(show: boolean) {
    this.showButton = show;
  }

  saveTemplate(template: Template) {
    // Implement logic to save the template
    console.log('Saved template:', template);
  }

  selectTemplate(template : Template){
    this.router.navigateByUrl('/resume-form');
  }
}
