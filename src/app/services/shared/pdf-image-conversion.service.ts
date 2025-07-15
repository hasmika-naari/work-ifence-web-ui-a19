import { Injectable } from '@angular/core';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '../../assets/js/pdf.worker.min.mjs';

@Injectable({
  providedIn: 'root',
})
export class PdfToImageService {
async convertPdfToImageBytes(pdfFile: File): Promise<string[]> {
  try {
    const pdfData = await pdfFile.arrayBuffer();
    const pdf: PDFDocumentProxy = await getDocument({ data: pdfData }).promise;

    const imageBytes: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      const viewport = page.getViewport({ scale: 2 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageData = canvas.toDataURL('image/png');
      imageBytes.push(imageData);
    }

    return imageBytes;
  } catch (error) {
    console.error('Error converting PDF to image bytes:', error);
    return [];
  }
}


async convertPdfToImageBytesThroughUrl(url: string): Promise<string[]> {
  try {
    const pdf: PDFDocumentProxy = await getDocument({ url }).promise;

    const imageBytes: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      const viewport = page.getViewport({ scale: 2 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageData = canvas.toDataURL('image/png');
      imageBytes.push(imageData);
    }

    return imageBytes;
  } catch (error: any) {
    console.error('Failed to load PDF from URL:', error);
    // Optional: handle specific status codes like 403
    if (error?.message?.includes('403') || error?.status === 403) {
      // alert('Access denied to PDF (403 Forbidden). Make sure the URL is public or signed.');
    }
    return [];
  }
}

}
