// src/types/ssr-window.d.ts
declare module 'ssr-window' {
  export const window: Window;
  export const document: Document;
  export function getWindow(): Window;
}
