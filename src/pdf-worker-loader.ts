import * as pdfjsLib from 'pdfjs-dist';

// Set the workerSrc property
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js';

export { pdfjsLib };
