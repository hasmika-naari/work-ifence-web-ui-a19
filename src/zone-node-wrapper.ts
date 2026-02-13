import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Avoid Node 22 MessagePort patch issues in Zone.js
(globalThis as any).__Zone_disable_MessagePort = true;
(globalThis as any).__Zone_disable_messagePort = true;

require('zone.js/node');
require('zone.js/plugins/task-tracking');
