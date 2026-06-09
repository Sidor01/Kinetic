declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: [string, ...unknown[]]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let lastPageLocation = '';

export function trackPageView(path: string) {
  if (!measurementId || !window.gtag) return;

  const pageLocation = `${window.location.origin}${path}`;
  if (pageLocation === lastPageLocation) return;
  lastPageLocation = pageLocation;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: pageLocation,
    page_title: document.title,
  });
}
