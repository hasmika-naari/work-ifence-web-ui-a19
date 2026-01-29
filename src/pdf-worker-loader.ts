import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Set the workerSrc property to use CDN to avoid Vite's dynamic import issues
pdfjsLib.GlobalWorkerOptions.workerSrc = /* @vite-ignore */ 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js';

export { pdfjsLib };
