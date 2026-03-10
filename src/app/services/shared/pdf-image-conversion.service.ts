import { Injectable } from '@angular/core';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = '../../assets/js/pdf.worker.min.mjs';

@Injectable({
  providedIn: 'root',
})
export class PdfToImageService {
  private async renderPdfToImageBytes(pdfData: ArrayBuffer): Promise<string[]> {
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
      imageBytes.push(canvas.toDataURL('image/png'));
    }

    return imageBytes;
  }

  async convertPdfArrayBufferToImageBytes(pdfData: ArrayBuffer): Promise<string[]> {
    try {
      return await this.renderPdfToImageBytes(pdfData);
    } catch (error) {
      console.error('Error converting PDF array buffer to image bytes:', error);
      return [];
    }
  }

  async convertPdfToImageBytes(pdfFile: File): Promise<string[]> {
    try {
      return await this.renderPdfToImageBytes(await pdfFile.arrayBuffer());
    } catch (error) {
      console.error('Error converting PDF to image bytes:', error);
      return [];
    }
  }

  async convertPdfToImageBytesThroughUrl(url: string): Promise<string[]> {
    const normalizedUrl = (url ?? '').trim();
    if (!normalizedUrl || normalizedUrl.endsWith('/undefined') || normalizedUrl.endsWith('/null')) {
      return [];
    }

    try {
      const response = await fetch(normalizedUrl, { method: 'GET' });
      if (!response.ok) {
        console.error('Failed to fetch PDF for preview:', normalizedUrl, response.status, response.statusText);
        return [];
      }

      return await this.renderPdfToImageBytes(await response.arrayBuffer());
    } catch (error: any) {
      console.error('Failed to load PDF from URL:', normalizedUrl, error);
      return [];
    }
  }

}
