// Screens that refresh themselves (the door check-in page, the dashboard's Summit
// screen) should only call the server while someone is actually using them. A tab
// left open on a phone or laptop after the event otherwise keeps calling every
// 30 seconds, day and night, and uses up the hosting plan's server time.
//
// "Active" means the tab is visible and someone has touched, typed or scrolled in
// the last IDLE_MS. Coming back to the tab counts as activity.
const IDLE_MS = 15 * 60 * 1000

let lastActive = Date.now()
const markActive = () => { lastActive = Date.now() }

if (typeof window !== 'undefined') {
  for (const type of ['pointerdown', 'keydown', 'touchstart', 'scroll']) {
    window.addEventListener(type, markActive, { passive: true })
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') markActive()
  })
}

/** True while the tab is on screen and has been used recently. */
export const tabActive = (now = Date.now()) =>
  typeof document === 'undefined' || (document.visibilityState === 'visible' && now - lastActive < IDLE_MS)

/** Calls `refresh` whenever the tab comes back on screen. Returns a cleanup function. */
export const onTabReturn = (refresh) => {
  if (typeof document === 'undefined') return () => {}
  const handler = () => { if (document.visibilityState === 'visible') refresh() }
  document.addEventListener('visibilitychange', handler)
  return () => document.removeEventListener('visibilitychange', handler)
}
