import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express, { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import fs from 'fs';
import http from 'http';
// import https from 'https'; // Uncomment if using SSL
import bootstrap from './src/main.server';
import { createProxyMiddleware } from 'http-proxy-middleware'; // Import properly

// Function to determine if compression should be applied
function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}

export function app(): Express {
  const server = express();
  const options: compression.CompressionOptions = {
    filter: shouldCompress,
    threshold: 0
  };

  server.use(compression(options));
  server.use(cors());

  // Define the distribution folder paths
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtmlPath = join(serverDistFolder, 'index.server.html');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, { maxAge: '1y' }));

  // API Proxy Configuration
  server.use('/api/**', createProxyMiddleware({
    target: "http://132.148.79.209:8090",
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    ws: true
  }));

  // Angular Universal SSR Rendering
  server.get('*', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!fs.existsSync(indexHtmlPath)) {
        return res.status(500).send("Server rendering template not found.");
      }

      const html = await renderApplication(bootstrap, {
        document: fs.readFileSync(indexHtmlPath, 'utf8'),
        url: req.originalUrl,
        platformProviders: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      });

      res.send(html);
    } catch (err) {
      next(err);
    }
    return;
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 80;

  // Uncomment this section if using HTTPS certificates
  /*
  const httpsOptions = {
    key: fs.readFileSync('ssl/naarideals/www.naarideals.com.key'),
    cert: fs.readFileSync('ssl/www_naarideals_com/www_naarideals_com.crt'),
    ca: [
      fs.readFileSync('ssl/www_naarideals_com/SectigoRSADomainValidationSecureServerCA.crt'),
      fs.readFileSync('ssl/www_naarideals_com/USERTrustRSAAAACA.crt')
    ]
  };
  const server = https.createServer(httpsOptions, app());
  */

  // HTTP Server
  const server = http.createServer(app());
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

export * from './src/main.server';
export { renderApplication } from '@angular/platform-server';
