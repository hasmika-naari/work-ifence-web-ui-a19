// Server-side polyfills for SSR.
// Avoid zone.js/node in Vite SSR; disable MessagePort patch before loading zone.js.
(globalThis as any).__Zone_disable_MessagePort = true;
(globalThis as any).__Zone_disable_messagePort = true;
import 'zone.js';
import 'zone.js/plugins/task-tracking';
