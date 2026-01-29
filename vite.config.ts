// vite.config.ts
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      include: ['pdfjs-dist/build/pdf'],
      exclude: ['pdfjs-dist/build/pdf.worker'],
    },
    define: {
      // Define any global constants here
    },
    plugins: [
      // Custom plugin to handle the PDF.js worker
      {
        name: 'pdf-worker-fix',
        transform(code, id) {
          if (id.includes('pdfjs-dist') && code.includes('this.workerSrc')) {
            // Add the vite-ignore comment to suppress the warning
            return code.replace(
              'this.workerSrc',
              '/* @vite-ignore */ this.workerSrc'
            );
          }
          return null;
        },
      },
    ],
  };
});