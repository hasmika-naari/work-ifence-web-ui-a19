import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-our-dashboard-demo',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, CarouselModule, NgxPaginationModule, RouterLink],
  templateUrl: './our-dashboard-demo.component.html',
  styleUrls: ['./our-dashboard-demo.component.scss']
})
export class OurDashboardDemoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
