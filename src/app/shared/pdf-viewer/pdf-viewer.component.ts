// src/app/components/pdf-viewer/pdf-viewer.component.ts
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Signal, SimpleChanges, effect, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FlexLayoutModule } from '@angular/flex-layout';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FooterComponent } from 'src/app/pages/home-page-one/footer/footer.component';
import { getDocument, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';


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
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule,
     NgOptimizedImage,FooterComponent,
    CarouselModule,FlexLayoutModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
})
export class PdfViewerComponent implements OnInit {
    @Input() pdfUrl: any = ''; // URL of the PDF file from S3
    @Input() isOnlyFirstPage : boolean = false
    private pdf: PDFDocumentProxy | null = null;
  
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
        this.pdf = await getDocument(this.pdfUrl).promise;
  
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
  
      const page: PDFPageProxy = await this.pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
  
      // Create a new canvas for each page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      // Render the page onto the canvas
      await page.render({ canvasContext: context, viewport }).promise;
  
      // Append the canvas to the PDF container
      const container = document.getElementById('pdf-container') as HTMLElement;
      container.appendChild(canvas);
    }

    async loadFirstPage(): Promise<void> {
        try {
          const pdf: PDFDocumentProxy = await getDocument(this.pdfUrl).promise;
          const firstPage: PDFPageProxy = await pdf.getPage(1);
          this.renderFirstPage(firstPage);
        } catch (error) {
          console.error('Error loading PDF:', error);
        }
      }
    
      async renderFirstPage(page: PDFPageProxy): Promise<void> {
        const viewport = page.getViewport({ scale: 1.5 });
    
        // Create a canvas for the first page
        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    
        canvas.width = viewport.width;
        canvas.height = viewport.height;
    
        // Render the page onto the canvas
        await page.render({ canvasContext: context, viewport }).promise;
      }

}