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
  const templateCandidates = [
    join(serverDistFolder, 'index.server.html'),
    join(browserDistFolder, 'index.server.html'),
    join(browserDistFolder, 'index.html'),
    resolve(process.cwd(), 'index.server.html'),
  ];

  let cachedTemplate: string | null = null;

  const resolveTemplatePath = (): string | null => {
    for (const candidate of templateCandidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return null;
  };

  const loadSsrTemplate = (): string => {
    const templatePath = resolveTemplatePath();
    if (templatePath) {
      const template = fs.readFileSync(templatePath, 'utf8');
      cachedTemplate = template;
      return template;
    }

    if (cachedTemplate !== null) {
      return cachedTemplate;
    }

    throw new Error(`SSR template not found. Checked: ${templateCandidates.join(', ')}`);
  };

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

  // API Proxy Configuration
  // Some backend endpoints (notably login) may enforce strict Host/Origin/Referer checks.
  // Proxy as if requests were sent to the real backend host, while still serving the UI on localhost.
  const proxyTarget = process.env['API_PROXY_TARGET'] || 'http://workifence.com:8090';
  const proxyOptions = {
    target: proxyTarget,
    changeOrigin: true,
    secure: false,
    ws: true,
    pathRewrite: { '^/api': '/api' },
    onProxyReq: (proxyReq: any, req: any) => {
      try {
        const targetUrl = new URL(proxyTarget);
        const targetOrigin = `${targetUrl.protocol}//${targetUrl.host}`;

        // Avoid backend rejecting localhost origins.
        if (req.headers?.origin) {
          proxyReq.setHeader('origin', targetOrigin);
        }
        if (req.headers?.referer) {
          proxyReq.setHeader('referer', targetOrigin);
        }
      } catch {
        // ignore
      }
    },
  };
  server.use(['/api', '/api*', '/api**'], createProxyMiddleware(proxyOptions));

  // Any request with a file extension (fonts, images, JS, CSS, etc.) that wasn't
  // served by the static middleware above should 404 — not fall through to Angular
  // SSR where the router would try to navigate to e.g. "/assets/resume/fonts/Poppins-Regular.ttf".
  server.use((req: any, res: any, next: any) => {
    if (/\.(?!html)[a-zA-Z0-9]+$/.test(req.path)) {
      res.status(404).end();
      return;
    }
    next();
  });

  // Angular SSR Rendering
  server.get('*', async (req, res, next) => {
    try {
      const html = await renderApplication(bootstrap, {
        document: loadSsrTemplate(),
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
  const forceHttp = (process.env['FORCE_HTTP'] || '').toLowerCase() === 'true';
  const enableHttps = (process.env['ENABLE_HTTPS'] || '').toLowerCase() === 'true';
  const strictHttps = (process.env['STRICT_HTTPS'] || '').toLowerCase() === 'true';

  // Default behavior:
  // - Local/dev: HTTP only (no cert probing, no warnings)
  // - Prod: set ENABLE_HTTPS=true and provide cert paths (or defaults) to run HTTPS
  if (forceHttp || !enableHttps) {
    const port = Number(process.env['PORT']) || 4000;
    const server = http.createServer(app());
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
    return;
  }

  // HTTPS is explicitly enabled
  const keyPath = process.env['SSL_KEY_PATH'] || 'ssl/naarideals/www.naarideals.com.key';
  const certPath = process.env['SSL_CERT_PATH'] || 'ssl/www_naarideals_com/www_naarideals_com.crt';
  const caPaths = [
    process.env['SSL_CA1_PATH'] || 'ssl/www_naarideals_com/SectigoRSADomainValidationSecureServerCA.crt',
    process.env['SSL_CA2_PATH'] || 'ssl/www_naarideals_com/USERTrustRSAAAACA.crt',
  ];

  const hasAllSslFiles =
    fs.existsSync(keyPath) &&
    fs.existsSync(certPath) &&
    caPaths.every((p: string) => fs.existsSync(p));

  if (!hasAllSslFiles) {
    const missingMsg = `ENABLE_HTTPS=true but SSL files not found. Missing one of: ${[
      keyPath,
      certPath,
      ...caPaths,
    ].join(', ')}`;

    if (strictHttps) {
      console.error(missingMsg);
      process.exit(1);
      return;
    }

    console.warn(`${missingMsg}. Falling back to HTTP.`);
    const port = Number(process.env['PORT']) || 4000;
    const server = http.createServer(app());
    server.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
    return;
  }

  const port = Number(process.env['PORT']) || 443;
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    ca: caPaths.map((p: string) => fs.readFileSync(p)),
  };

  const server = https.createServer(httpsOptions, app());
  server.listen(port, () => {
    console.log(`Node Express server listening on https://localhost:${port}`);
  });
}

if (isMainModule(import.meta.url)) {
  run();
}
