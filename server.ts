import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import { isMainModule } from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');
const http = require('http');

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
  const keyPath = process.env['SSL_KEY_PATH'] || 'ssl/naarideals/www.naarideals.com.key';
  const certPath = process.env['SSL_CERT_PATH'] || 'ssl/www_naarideals_com/www_naarideals_com.crt';
  const caPaths = [
    process.env['SSL_CA1_PATH'] || 'ssl/www_naarideals_com/SectigoRSADomainValidationSecureServerCA.crt',
    process.env['SSL_CA2_PATH'] || 'ssl/www_naarideals_com/USERTrustRSAAAACA.crt',
  ];

  const forceHttp = (process.env['FORCE_HTTP'] || '').toLowerCase() === 'true';
  const hasAllSslFiles =
    fs.existsSync(keyPath) &&
    fs.existsSync(certPath) &&
    caPaths.every((p: string) => fs.existsSync(p));

  if (forceHttp || !hasAllSslFiles) {
    const port = Number(process.env['PORT']) || 4000;
    const server = http.createServer(app());
    server.listen(port, () => {
      if (!forceHttp) {
        console.warn(
          `SSL files not found; falling back to HTTP. Missing one of: ${[keyPath, certPath, ...caPaths].join(', ')}`
        );
      }
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
    return;
  }

  const port = Number(process.env['PORT']) || 443;

  // HTTPS Certificate Configuration
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    ca: caPaths.map((p: string) => fs.readFileSync(p)),
  };

  // Start HTTPS Server
  const server = https.createServer(httpsOptions, app());
  server.listen(port, () => {
    console.log(`Node Express server listening on https://localhost:${port}`);
  });
}

if (isMainModule(import.meta.url)) {
  run();
}
