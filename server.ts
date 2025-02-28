import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express, { Express, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import fs from 'fs';
import http from 'http';
import { createProxyMiddleware, Options } from 'http-proxy-middleware'; 
import bootstrap from './src/main.server';

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

  console.log(`Checking SSR template file at: ${indexHtmlPath}`);

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser (SSR safe)
  server.use(express.static(browserDistFolder, { maxAge: '1y', index: false }));

  // Define proxy middleware options
// const proxyOptions: any = {
//   target: "http://132.148.79.209:8090", // ✅ Ensure it explicitly points to 8090
//   changeOrigin: true, // ✅ Ensures Host header matches target
//   ws: true, // ✅ Enables WebSockets
//   secure: false, // ✅ Allows HTTP (skip SSL verification if backend is HTTPS)
//   onProxyReq: (proxyReq: any, req: any, res: any) => {
//     console.log(`🔄 Proxying request: ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
//   },
//   onError: (err: any, req: any, res: any) => {
//     console.error(`❌ Proxy error: ${err.message}`);
//     res.status(500).send("Proxy Error");
//   }
// };

// const proxyOptions: any = {
//   target: "http://132.148.79.209:8090",   
//   changeOrigin: true,
//   pathRewrite: {
//       [`^/api`]: '/api',
//   },
//   ws: true
// };

const proxyOptions: any = {
  target: "http://132.148.79.209:8090",
  changeOrigin: true,
  secure: false,  // Ensure HTTPS does not interfere
  logLevel: "debug",  // Logs details for debugging
  pathRewrite: {
    [`^/api`]: '/api',
  },
  ws: true
};

// Use proxy middleware in Express server
server.use('/api/**', createProxyMiddleware(proxyOptions));

  // API Proxy Configuration
  // server.use('/api', createProxyMiddleware({
  //   target: "http://132.148.79.209:8090",
  //   changeOrigin: true,
  //   ws: true
  // }));

  server.get('*', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`SSR Rendering for: ${req.originalUrl}`);
  
      if (!fs.existsSync(indexHtmlPath)) {
        console.error("SSR template missing:", indexHtmlPath);
        return res.status(500).send("SSR template not found.");
      }
  
      const html = await renderApplication(bootstrap, {
        document: fs.readFileSync(indexHtmlPath, 'utf8'),
        url: req.originalUrl,
        platformProviders: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      });
  
      return res.send(html); // ✅ Ensure the function always returns
    } catch (err) {
      console.error("SSR Rendering Error:", err);
      return res.status(500).send("Internal Server Error"); // ✅ Ensure return on error
    }
  });
  return server;
}

function run(): void {
  const port = Number(process.env['PORT']) || 80;

  // HTTP Server
  const server = http.createServer(app());
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

export * from './src/main.server';
export { renderApplication } from '@angular/platform-server';
