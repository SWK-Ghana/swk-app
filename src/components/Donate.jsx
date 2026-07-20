import React, { useEffect, useRef, useState } from 'react'
import Seo from './Seo'
import { trackConversion, trackEvent } from '../utils/analytics'

// ─── Paystack config ──────────────────────────────────────────────────────────
// Paystack is Ghana's standard payment gateway (cards + Mobile Money: MTN,
// Telecel/Vodafone, AirtelTigo). Only the PUBLIC key is used here — it is safe
// to expose in the browser. Set VITE_PAYSTACK_PUBLIC_KEY in .env to go live.
// Until then, the form falls back to emailing info@swkghana.org so the donate
// button always does something (a dead donate button breaks Ad Grants policy).
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''
const PAYSTACK_SRC = 'https://js.paystack.co/v1/inline.js'
const PRESETS = [50, 100, 250, 500]

const loadPaystack = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    if (window.PaystackPop) return resolve(window.PaystackPop)
    const existing = document.querySelector(`script[src="${PAYSTACK_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.PaystackPop))
      existing.addEventListener('error', reject)
      return
    }
    const s = document.createElement('script')
    s.src = PAYSTACK_SRC
    s.async = true
    s.onload = () => resolve(window.PaystackPop)
    s.onerror = reject
    document.body.appendChild(s)
  })

const Donate = () => {
  const [amount, setAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [frequency, setFrequency] = useState('once')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | success | error
  const [message, setMessage] = useState('')
  const paystackReady = useRef(false)

  // Warm up the Paystack script on mount so checkout opens instantly.
  useEffect(() => {
    if (!PAYSTACK_PUBLIC_KEY) return
    loadPaystack()
      .then(() => { paystackReady.current = true })
      .catch(() => { paystackReady.current = false })
  }, [])

  const choosePreset = (value) => {
    setSelectedPreset(value)
    setAmount(String(value))
  }

  const onAmountChange = (e) => {
    setAmount(e.target.value)
    setSelectedPreset(null)
  }

  const numericAmount = Number(amount)
  const amountValid = numericAmount >= 1 && Number.isFinite(numericAmount)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!amountValid) {
      setStatus('error')
      setMessage('Please enter a donation amount of at least GH₵1.')
      return
    }

    trackEvent('donate_start', { value: numericAmount, currency: 'GHS', frequency })

    // No gateway configured yet → graceful email fallback (button still works).
    if (!PAYSTACK_PUBLIC_KEY) {
      const subject = encodeURIComponent(`Donation pledge — GH₵${numericAmount} (${frequency})`)
      const body = encodeURIComponent(
        `Hi SWK Ghana,\n\nI would like to donate GH₵${numericAmount} (${frequency}).\n\nName: ${name}\nEmail: ${email}\n\nPlease send me payment instructions.\n\nThank you!`
      )
      window.location.href = `mailto:info@swkghana.org?subject=${subject}&body=${body}`
      setStatus('success')
      setMessage("Thank you! Your email app is opening so you can send us your pledge and we'll share secure payment details.")
      return
    }

    try {
      setStatus('processing')
      const PaystackPop = await loadPaystack()
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email || 'donations@swkghana.org',
        amount: Math.round(numericAmount * 100), // pesewas
        currency: 'GHS',
        metadata: {
          custom_fields: [
            { display_name: 'Donor Name', variable_name: 'donor_name', value: name || 'Anonymous' },
            { display_name: 'Frequency', variable_name: 'frequency', value: frequency },
          ],
        },
        callback: (response) => {
          trackConversion('donate', {
            value: numericAmount,
            currency: 'GHS',
            frequency,
            transaction_id: response?.reference,
          })
          setStatus('success')
          setMessage(`Thank you for your generous donation of GH₵${numericAmount}! A receipt has been sent to your email.`)
        },
        onClose: () => {
          setStatus('idle')
          setMessage('Donation window closed. You can try again whenever you are ready.')
        },
      })
      handler.openIframe()
    } catch {
      setStatus('error')
      setMessage('We could not open the secure payment window. Please try again, or email info@swkghana.org.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Seo
        title="Donate to SWK Ghana – Support Youth-Led Sustainable Change"
        description="Your donation empowers young people across Ghana and Africa through climate action, agribusiness, circular economy, and community programs. Give securely via card or Mobile Money."
        path="/donate"
      />
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest bg-white text-[#1E963C] border border-[#D4F0A0]">
              Support Our Mission
            </span>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Donate to SWK Ghana</h1>
            <p className="text-sm xs:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Every contribution funds youth programs, climate action, agribusiness training, and
              community initiatives across Ghana. 100% of your gift goes directly to our work.
            </p>
          </div>

          {/* Impact statements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { amt: 'GH₵50', impact: 'Sponsors a youth for one webinar session' },
              { amt: 'GH₵250', impact: 'Funds a community outreach activity' },
              { amt: 'GH₵500', impact: 'Supports a skills-training workshop' },
            ].map((i) => (
              <div key={i.amt} className="bg-white rounded-xl border border-[#D4F0A0] p-4 text-center">
                <div className="text-lg font-bold text-[#1E963C]">{i.amt}</div>
                <div className="text-xs text-gray-600 mt-1 leading-snug">{i.impact}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#F2FAE8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#78C31E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You! 🌱</h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">{message}</p>
                <button
                  onClick={() => { setStatus('idle'); setMessage(''); setAmount(''); setSelectedPreset(null); setName(''); setEmail('') }}
                  className="btn-gradient px-6 py-2.5 text-sm"
                >
                  Make Another Donation
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Donation type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ id: 'once', label: 'One-time' }, { id: 'monthly', label: 'Monthly' }].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFrequency(f.id)}
                        aria-pressed={frequency === f.id}
                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                          frequency === f.id
                            ? 'border-[#78C31E] bg-[#F2FAE8] text-[#1E963C]'
                            : 'border-gray-200 text-gray-600 hover:border-[#C0E870]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount presets */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Choose an amount (GH₵)</label>
                  <div className="grid grid-cols-4 gap-2 xs:gap-3 mb-3">
                    {PRESETS.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => choosePreset(v)}
                        aria-pressed={selectedPreset === v}
                        className={`py-2.5 xs:py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                          selectedPreset === v
                            ? 'border-[#78C31E] bg-[#F2FAE8] text-[#1E963C]'
                            : 'border-gray-200 text-gray-700 hover:border-[#C0E870]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">GH₵</span>
                    <label htmlFor="donate-amount" className="sr-only">Custom amount</label>
                    <input
                      id="donate-amount"
                      type="number"
                      min="1"
                      inputMode="decimal"
                      value={amount}
                      onChange={onAmountChange}
                      className="w-full pl-12 pr-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#78C31E] focus:border-emerald-500"
                      placeholder="Enter a custom amount"
                    />
                  </div>
                </div>

                {/* Donor details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="donate-name" className="block text-sm font-semibold text-gray-800 mb-1">Name <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      id="donate-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#78C31E] focus:border-emerald-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="donate-email" className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
                    <input
                      id="donate-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#78C31E] focus:border-emerald-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600" role="alert">{message}</p>
                )}
                {status !== 'error' && message && (
                  <p className="text-sm text-gray-600">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'processing'}
                  className="btn-gradient w-full py-3.5 text-base xs:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'processing'
                    ? 'Opening secure checkout…'
                    : amountValid
                      ? `Donate GH₵${numericAmount}${frequency === 'monthly' ? ' / month' : ''}`
                      : 'Donate'}
                </button>

                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1E963C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure payment via Paystack — card &amp; Mobile Money accepted
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Prefer another way to give? Email{' '}
            <a href="mailto:info@swkghana.org" className="text-[#1E963C] font-semibold hover:underline">info@swkghana.org</a>{' '}
            and our team will share bank &amp; Mobile Money details.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Donate
