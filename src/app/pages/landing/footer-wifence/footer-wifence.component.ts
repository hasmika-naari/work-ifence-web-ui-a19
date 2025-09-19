import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxScrollTopModule } from 'ngx-scrolltop';

@Component({
  selector: 'app-work-ifence-footer',
  standalone: true,
  imports: [
    CommonModule, 
    NgOptimizedImage, 
    NgxScrollTopModule, 
    RouterModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './footer-wifence.component.html',
  styleUrls: ['./footer-wifence.component.scss']
})
export class FooterWorkifenceComponent implements OnInit {
  @Input() isToggled: boolean = false;
  
  newsletterForm: FormGroup;
  submittedForm = false;
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  constructor(private formBuilder: FormBuilder) {
    this.newsletterForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
    });
  }

  ngOnInit(): void {
  }

  // Getter for easy access to form fields
  get f() { 
    return this.newsletterForm.controls; 
  }

  onSubmit() {
    this.submittedForm = true;
    
    // Stop here if form is invalid
    if (this.newsletterForm.invalid) {
      return;
    }
    
    // Form is valid, proceed with subscription
    console.log('News Letter subscription for email:', this.newsletterForm.value.email);
    
    // Reset form after submission
    this.newsletterForm.reset();
    this.submittedForm = false;
  }
}
