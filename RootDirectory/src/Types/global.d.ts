export {};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
//declaration for google analytics gtag and datalayer that is added via runtime