// ─── Google Analytics 4 helpers ──────────────────────────────────────────────
// The GA4 base snippet lives in index.html. Set your Measurement ID there and
// in VITE_GA_MEASUREMENT_ID (.env). Conversion tracking is required to keep a
// Google Ad Grants account compliant (the 5% CTR + "at least one conversion"
// rules depend on it).

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

const isConfigured = () =>
  typeof window !== 'undefined' &&
  typeof window.gtag === 'function' &&
  GA_ID &&
  GA_ID !== 'G-XXXXXXXXXX'

/**
 * Record a single-page-app page view. GA4 does not auto-track client-side
 * route changes, so call this on every navigation.
 * @param {string} path  e.g. '/about'
 * @param {string} title Document title for the page
 */
export function trackPageView(path, title) {
  if (!isConfigured()) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title || document.title,
  })
}

/**
 * Record a custom event.
 * @param {string} name    Event name, e.g. 'newsletter_signup'
 * @param {object} [params] Extra event parameters
 */
export function trackEvent(name, params = {}) {
  if (!isConfigured()) return
  window.gtag('event', name, params)
}

/**
 * Record a conversion (the events Ad Grants cares about). Mark these as
 * conversions in your GA4 admin so they count toward the program's
 * conversion requirement.
 * @param {string} name    e.g. 'donate', 'volunteer_signup', 'contact_submit'
 * @param {object} [params]
 */
export function trackConversion(name, params = {}) {
  trackEvent(name, { ...params, conversion: true })
}
