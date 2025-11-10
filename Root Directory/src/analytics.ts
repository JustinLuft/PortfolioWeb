export const initAnalytics = () => {
  const id = "G-PQZ1RGMR8S";

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

  // Wait for script to load before firing first pageview
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", id, { anonymize_ip: true });

    // Force initial pageview
    gtag("event", "page_view", { page_path: window.location.pathname });
  };

  document.head.appendChild(script);
};
