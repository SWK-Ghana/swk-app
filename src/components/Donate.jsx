import React, { useEffect, useState } from 'react'
import Seo from './Seo'
import { trackConversion, trackEvent } from '../utils/analytics'
import { loadPaystack, loadFlutterwave } from '../utils/payments'

// ─── Payment configuration ────────────────────────────────────────────────────
// Public keys only (safe in the browser). Set in .env / Vercel:
//   VITE_PAYSTACK_PUBLIC_KEY     → enables Card & Mobile Money (GHS, Paystack)
//   VITE_FLUTTERWAVE_PUBLIC_KEY  → enables International giving (USD/GBP/EUR, Flutterwave)
// Until a key is set, that tab guides donors to the always-working
// Bank / Mobile Money transfer option — the donate flow is never dead.
const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''
const FLW_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || ''

const BANK_NAME = 'Fidelity Bank'
const BANK_ACCOUNT = '2030192755111'
const MOMO_NUMBER = '+233 548 704 107'
const DONATE_EMAIL = 'info@swkghana.org'
const LOGO_URL = 'https://res.cloudinary.com/dwgj3lovn/image/upload/v1760294682/SWK_LOGO_es585y.png'

const CURRENCIES = {
  GHS: { symbol: 'GH₵', presets: [50, 100, 250, 500] },
  USD: { symbol: '$', presets: [10, 25, 50, 100] },
  GBP: { symbol: '£', presets: [10, 25, 50, 100] },
  EUR: { symbol: '€', presets: [10, 25, 50, 100] },
}

const METHODS = [
  { id: 'paystack', icon: '🇬🇭', label: 'Card & Mobile Money', sub: 'Ghana · GH₵' },
  { id: 'intl', icon: '🌍', label: 'International', sub: 'USD · GBP · EUR' },
  { id: 'transfer', icon: '🏦', label: 'Bank / MoMo Transfer', sub: 'Direct transfer' },
]

// ─── Copy-to-clipboard field for the transfer tab ─────────────────────────────
const CopyField = ({ label, value, copyValue, event }) => {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue || value)
      setCopied(true)
      trackEvent('donate_copy_details', { field: event })
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — value is still visible to copy manually */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
        <div className="text-base font-bold text-gray-900 break-all">{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
          copied
            ? 'bg-[#F2FAE8] border-[#C0E870] text-[#1E963C]'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}

const Donate = () => {
  const [method, setMethod] = useState('paystack')
  const [currency, setCurrency] = useState('USD') // international tab only
  const [amount, setAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | success | error
  const [message, setMessage] = useState('')

  const activeCurrency = method === 'intl' ? currency : 'GHS'
  const { symbol, presets } = CURRENCIES[activeCurrency]
  const numericAmount = Number(amount)
  const amountValid = numericAmount >= 1 && Number.isFinite(numericAmount)

  // Warm up the relevant checkout script so the payment window opens instantly.
  useEffect(() => {
    if (method === 'paystack' && PAYSTACK_KEY) loadPaystack().catch(() => {})
    if (method === 'intl' && FLW_KEY) loadFlutterwave().catch(() => {})
    if (method === 'transfer') trackEvent('donate_transfer_view')
  }, [method])

  const switchMethod = (id) => {
    setMethod(id)
    setStatus('idle')
    setMessage('')
    setAmount('')
    setSelectedPreset(null)
  }

  const switchCurrency = (c) => {
    setCurrency(c)
    setAmount('')
    setSelectedPreset(null)
  }

  const choosePreset = (v) => { setSelectedPreset(v); setAmount(String(v)) }
  const onAmountChange = (e) => { setAmount(e.target.value); setSelectedPreset(null) }

  const onSuccess = (reference) => {
    trackConversion('donate', {
      value: numericAmount,
      currency: activeCurrency,
      method,
      transaction_id: reference,
    })
    setStatus('success')
    setMessage(`Thank you for your generous donation of ${symbol}${numericAmount}! A receipt has been sent to your email.`)
  }

  const handlePaystack = async () => {
    const PaystackPop = await loadPaystack()
    const handler = PaystackPop.setup({
      key: PAYSTACK_KEY,
      email,
      amount: Math.round(numericAmount * 100), // pesewas
      currency: 'GHS',
      metadata: {
        custom_fields: [
          { display_name: 'Donor Name', variable_name: 'donor_name', value: name || 'Anonymous' },
        ],
      },
      callback: (response) => onSuccess(response?.reference),
      onClose: () => {
        setStatus('idle')
        setMessage('Payment window closed. You can try again whenever you are ready.')
      },
    })
    handler.openIframe()
  }

  const handleFlutterwave = async () => {
    const FlutterwaveCheckout = await loadFlutterwave()
    FlutterwaveCheckout({
      public_key: FLW_KEY,
      tx_ref: `SWK-DON-${Date.now()}`,
      amount: numericAmount,
      currency,
      payment_options: 'card',
      customer: { email, name: name || 'Anonymous Donor' },
      customizations: {
        title: 'SWK Ghana',
        description: 'Donation to SWK Ghana — empowering youth for sustainable change',
        logo: LOGO_URL,
      },
      callback: (payment) => {
        if (payment.status === 'successful' || payment.status === 'completed') {
          onSuccess(payment.transaction_id || payment.tx_ref)
        } else {
          setStatus('error')
          setMessage('The payment was not completed. Please try again, or use a bank transfer.')
        }
      },
      onclose: () => {
        setStatus((s) => (s === 'success' ? s : 'idle'))
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!amountValid) {
      setStatus('error')
      setMessage(`Please enter a donation amount of at least ${symbol}1.`)
      return
    }
    trackEvent('donate_start', { value: numericAmount, currency: activeCurrency, method })

    const key = method === 'paystack' ? PAYSTACK_KEY : FLW_KEY
    if (!key) {
      // Gateway not activated yet → guide the donor to the transfer option.
      setStatus('error')
      setMessage('Online checkout for this option is being activated. Please use the Bank / MoMo Transfer option — it takes under a minute.')
      return
    }

    try {
      setStatus('processing')
      if (method === 'paystack') await handlePaystack()
      else await handleFlutterwave()
    } catch {
      setStatus('error')
      setMessage(`We could not open the secure payment window. Please try again, use a bank transfer, or email ${DONATE_EMAIL}.`)
    }
  }

  const receiptMailto = `mailto:${DONATE_EMAIL}?subject=${encodeURIComponent('Donation Transfer — SWK Ghana')}&body=${encodeURIComponent(
    `Hi SWK Ghana,\n\nI have just sent a donation by bank/mobile money transfer.\n\nName: \nAmount: \nMethod (Bank / MoMo): \nDate: \n\nPlease acknowledge receipt. Thank you!`
  )}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <Seo
        title="Donate to SWK Ghana – Support Youth-Led Sustainable Change"
        description="Support SWK Ghana by card, Mobile Money, bank transfer, or international payment in USD, GBP or EUR. Every gift funds youth programs, climate action, and community initiatives across Ghana."
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
              community initiatives across Ghana. Give from anywhere in the world.
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

          {/* Payment method tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 xs:gap-3 mb-5">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => switchMethod(m.id)}
                aria-pressed={method === m.id}
                className={`flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 text-left rounded-xl border-2 px-4 py-3 transition-colors ${
                  method === m.id
                    ? 'border-[#78C31E] bg-white shadow-sm'
                    : 'border-transparent bg-white/60 hover:bg-white hover:border-[#C0E870]'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{m.icon}</span>
                <span>
                  <span className={`block text-sm font-bold ${method === m.id ? 'text-[#1E963C]' : 'text-gray-800'}`}>{m.label}</span>
                  <span className="block text-xs text-gray-500">{m.sub}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 xs:p-6 sm:p-8 md:p-10 shadow-sm border border-gray-200">

            {/* ── Success state (shared) ── */}
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

            /* ── Bank / MoMo transfer tab ── */
            ) : method === 'transfer' ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Give by direct transfer</h2>
                  <p className="text-sm text-gray-600">
                    Send your donation straight to our accounts below — no fees, no middleman.
                    Please use the reference <span className="font-semibold text-gray-800">“Donation — your name”</span>.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">🏦 Bank Transfer</div>
                  <CopyField label="Bank" value={BANK_NAME} event="bank_name" />
                  <CopyField label="Account Number" value={BANK_ACCOUNT} event="bank_account" />
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">📱 Mobile Money</div>
                  <CopyField label="MoMo Number" value={MOMO_NUMBER} copyValue={MOMO_NUMBER.replace(/\s/g, '')} event="momo_number" />
                </div>

                <div className="bg-[#F2FAE8] border border-[#D4F0A0] rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  After transferring, please{' '}
                  <a href={receiptMailto} className="font-bold text-[#1E963C] hover:underline">email us at {DONATE_EMAIL}</a>{' '}
                  with your name and amount so we can acknowledge your gift and send you a receipt.
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Donating from outside Ghana? International cards are accepted on the{' '}
                  <button type="button" onClick={() => switchMethod('intl')} className="font-semibold text-[#1E963C] hover:underline">International</button> option.
                </p>
              </div>

            /* ── Gateway tabs (Paystack / Flutterwave) ── */
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Currency selector — international only */}
                {method === 'intl' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Currency</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['USD', 'GBP', 'EUR'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => switchCurrency(c)}
                          aria-pressed={currency === c}
                          className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                            currency === c
                              ? 'border-[#78C31E] bg-[#F2FAE8] text-[#1E963C]'
                              : 'border-gray-200 text-gray-600 hover:border-[#C0E870]'
                          }`}
                        >
                          {CURRENCIES[c].symbol} {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amount presets */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Choose an amount ({symbol})</label>
                  <div className="grid grid-cols-4 gap-2 xs:gap-3 mb-3">
                    {presets.map((v) => (
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">{symbol}</span>
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
                  <div className="space-y-2" role="alert">
                    <p className="text-sm text-red-600">{message}</p>
                    <button
                      type="button"
                      onClick={() => switchMethod('transfer')}
                      className="text-sm font-bold text-[#1E963C] hover:underline"
                    >
                      → Use Bank / MoMo Transfer instead
                    </button>
                  </div>
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
                      ? `Donate ${symbol}${numericAmount}`
                      : 'Donate'}
                </button>

                <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1E963C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {method === 'paystack'
                    ? 'Secure payment via Paystack — card & Mobile Money accepted'
                    : 'Secure international payment via Flutterwave — Visa & Mastercard accepted'}
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Questions about giving? Email{' '}
            <a href={`mailto:${DONATE_EMAIL}`} className="text-[#1E963C] font-semibold hover:underline">{DONATE_EMAIL}</a>{' '}
            — we're happy to help.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Donate
