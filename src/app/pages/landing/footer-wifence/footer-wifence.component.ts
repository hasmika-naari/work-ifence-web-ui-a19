import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxScrollTopModule } from 'ngx-scrolltop';

@Component({
  selector: 'app-work-ifence-footer',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxScrollTopModule, RouterModule, 
    RouterLink,],
  templateUrl: './footer-wifence.component.html',
  styleUrls: ['./footer-wifence.component.scss']
})
export class FooterWorkifenceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
