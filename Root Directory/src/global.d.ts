export {};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

declare module "./analytics";
