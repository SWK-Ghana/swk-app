// ─── Payment gateway script loaders ──────────────────────────────────────────
// Both Paystack and Flutterwave use the same pattern: load a small inline
// checkout script, then open a secure hosted payment window with a PUBLIC key.
// Public keys are safe to expose in the browser — money always settles into
// the account that owns the key, and card details never touch our code.

const LOAD_TIMEOUT_MS = 15000
const pending = {}

// One attempt per script at a time. A failed attempt (blocked by a privacy
// extension, offline, slow network) is forgotten so the next click tries again
// instead of waiting on a script tag that already gave up.
const loadScript = (src) => {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  const existing = document.querySelector(`script[src="${src}"]`)
  if (existing?.dataset.loaded === 'true') return Promise.resolve()
  if (pending[src]) return pending[src]
  pending[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    const timer = setTimeout(() => fail(new Error('timeout')), LOAD_TIMEOUT_MS)
    const fail = (err) => {
      clearTimeout(timer)
      s.remove()
      delete pending[src]
      reject(err)
    }
    s.src = src
    s.async = true
    s.onload = () => { clearTimeout(timer); s.dataset.loaded = 'true'; resolve() }
    s.onerror = () => fail(new Error(`could not load ${src}`))
    existing?.remove()
    document.body.appendChild(s)
  })
  return pending[src]
}

/** Paystack inline checkout — resolves to window.PaystackPop */
export const loadPaystack = () =>
  loadScript('https://js.paystack.co/v1/inline.js').then(() => window.PaystackPop)

/** Flutterwave inline checkout — resolves to window.FlutterwaveCheckout */
export const loadFlutterwave = () =>
  loadScript('https://checkout.flutterwave.com/v3.js').then(() => window.FlutterwaveCheckout)
