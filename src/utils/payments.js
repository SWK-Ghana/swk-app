// ─── Payment gateway script loaders ──────────────────────────────────────────
// Both Paystack and Flutterwave use the same pattern: load a small inline
// checkout script, then open a secure hosted payment window with a PUBLIC key.
// Public keys are safe to expose in the browser — money always settles into
// the account that owns the key, and card details never touch our code.

const pending = {}

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve()
      existing.addEventListener('load', resolve)
      existing.addEventListener('error', reject)
      return
    }
    if (pending[src]) return pending[src].then(resolve, reject)
    pending[src] = new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = src
      s.async = true
      s.onload = () => { s.dataset.loaded = 'true'; res() }
      s.onerror = rej
      document.body.appendChild(s)
    })
    pending[src].then(resolve, reject)
  })

/** Paystack inline checkout — resolves to window.PaystackPop */
export const loadPaystack = () =>
  loadScript('https://js.paystack.co/v1/inline.js').then(() => window.PaystackPop)

/** Flutterwave inline checkout — resolves to window.FlutterwaveCheckout */
export const loadFlutterwave = () =>
  loadScript('https://checkout.flutterwave.com/v3.js').then(() => window.FlutterwaveCheckout)
