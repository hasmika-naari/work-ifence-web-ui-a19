// src/app/components/pdf-viewer/pdf-viewer.component.ts
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
type PdfJsDocumentProxy = any;
type PdfJsPageProxy = any;


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-pdf-viewer',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    FooterComponent,
    CarouselModule,
  ],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class PdfViewerComponent implements OnInit {
    @Input() pdfUrl: any = ''; // URL of the PDF file from S3
    @Input() isOnlyFirstPage : boolean = false
  private pdf: PdfJsDocumentProxy | null = null;
  
    ngOnInit(): void {
      if (this.pdfUrl && !this.isOnlyFirstPage) {
        this.loadPDF();
      }
      else if(this.pdfUrl && this.isOnlyFirstPage){
        this.loadFirstPage()
      } else {
        console.error('PDF URL is missing.');
      }
    }
  
    async loadPDF(): Promise<void> {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        this.pdf = await pdfjs.getDocument(this.pdfUrl).promise;
  
        const totalPages = this.pdf.numPages;
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          this.renderPage(pageNumber);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }
  
    async renderPage(pageNumber: number): Promise<void> {
      if (!this.pdf) return;
  
      const page: PdfJsPageProxy = await this.pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
  
      // Create a new canvas for each page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      // Render the page onto the canvas
      await page.render({ canvasContext: context, viewport }).promise;
  
      // Append the canvas to the PDF container
      const container = document.getElementById('pdf-container') as HTMLElement | null;
      if (!container) {
        console.error('PDF container element #pdf-container not found.');
        return;
      }
      container.appendChild(canvas);
    }

    async loadFirstPage(): Promise<void> {
      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const pdf: PdfJsDocumentProxy = await pdfjs.getDocument(this.pdfUrl).promise;
        const firstPage: PdfJsPageProxy = await pdf.getPage(1);
        await this.renderFirstPage(firstPage);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }

    async renderFirstPage(page: PdfJsPageProxy): Promise<void> {
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error('PDF canvas element #pdf-canvas not found.');
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        console.error('2D context not available for #pdf-canvas.');
        return;
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context as CanvasRenderingContext2D, viewport }).promise;
    }

}