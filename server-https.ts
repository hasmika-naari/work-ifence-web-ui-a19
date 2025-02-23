import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');

function shouldCompress(req: any, res: any) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}

// Exported Express app for serverless deployment
export function app(): express.Express {
  const server = express();
  let options: compression.CompressionOptions = {
    filter: shouldCompress,
    threshold: 0
  };

  server.use(compression(options));
  server.use(cors());

  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

  // API Proxy Configuration
  const proxyOptions = {
    target: 'http://132.148.79.209:8090',
    changeOrigin: true,
    ws: true,
    pathRewrite: { '^/api': '/api' }
  };
  server.use(['/api', '/api*', '/api**'], createProxyMiddleware(proxyOptions));

  // Angular SSR Rendering
  server.get('*', async (req, res, next) => {
    try {
      const html = await renderApplication(bootstrap, {
        document: fs.readFileSync(indexHtml, 'utf8'),
        url: req.originalUrl,
        platformProviders: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      });

      res.send(html);
    } catch (err) {
      next(err);
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 443;

  // HTTPS Certificate Configuration
  const httpsOptions = {
    key: fs.readFileSync('ssl/naarideals/www.naarideals.com.key'),
    cert: fs.readFileSync('ssl/www_naarideals_com/www_naarideals_com.crt'),
    ca: [
      fs.readFileSync('ssl/www_naarideals_com/SectigoRSADomainValidationSecureServerCA.crt'),
      fs.readFileSync('ssl/www_naarideals_com/USERTrustRSAAAACA.crt')
    ]
  };

  // Start HTTPS Server
  const server = https.createServer(httpsOptions, app());
  server.listen(port, () => {
    console.log(`Node Express server listening on https://localhost:${port}`);
  });
}

run();
