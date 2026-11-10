import React, { useEffect, useState } from 'react'
import {
  LuAward, LuChartColumn, LuClipboardList, LuFileText, LuLayoutDashboard, LuLogOut, LuReceiptText, LuShieldCheck, LuStore, LuTicketCheck, LuUsers,
} from 'react-icons/lu'
import Seo from './Seo'
import { FlowStrip } from './Patterns'
import { SESSION_EXPIRED_EVENT, clearSession, getMe, getSession } from '../utils/adminApi'
import AdminLogin, { ChangePasswordForm } from './admin/AdminLogin'
import Certificates from './admin/Certificates'
import Overview from './admin/Overview'
import Quality from './admin/Quality'
import Receipts from './admin/Receipts'
import Registrations from './admin/Registrations'
import Summit from './admin/Summit'
import Team from './admin/Team'
import Website from './admin/Website'
import { MarketplaceAdmin, PostsAdmin } from './admin/ContentAdmin'
import { Loading } from './admin/ui'

const EVERYONE = ['owner', 'finance', 'content', 'viewer']

// Each screen and who sees it. The server checks every action as well; this
// only keeps people's menus to what they can use.
const SCREENS = [
  { id: 'overview', label: 'Overview', icon: LuLayoutDashboard, roles: EVERYONE, Screen: Overview },
  { id: 'summit', label: 'Summit check-in', icon: LuTicketCheck, roles: EVERYONE, Screen: Summit },
  { id: 'certificates', label: 'Certificates', icon: LuAward, roles: ['owner', 'finance', 'content'], Screen: Certificates },
  { id: 'registrations', label: 'Registrations', icon: LuClipboardList, roles: EVERYONE, Screen: Registrations },
  { id: 'website', label: 'Website visitors', icon: LuChartColumn, roles: EVERYONE, Screen: Website },
  { id: 'quality', label: 'Quality checks', icon: LuShieldCheck, roles: EVERYONE, Screen: Quality },
  { id: 'receipts', label: 'Donations and receipts', icon: LuReceiptText, roles: ['owner', 'finance'], Screen: Receipts },
  { id: 'posts', label: 'Blog posts', icon: LuFileText, roles: ['owner', 'content'], Screen: PostsAdmin },
  { id: 'marketplace', label: 'Marketplace', icon: LuStore, roles: ['owner', 'content'], Screen: MarketplaceAdmin },
  { id: 'team', label: 'Team', icon: LuUsers, roles: ['owner'], Screen: Team },
]

const ROLE_NAMES = { owner: 'Owner', finance: 'Finance', content: 'Content', viewer: 'Viewer' }

const Admin = () => {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [screenId, setScreenId] = useState('overview')
  const [notice, setNotice] = useState('')

  // Restore an existing session on refresh (server enforces expiry).
  useEffect(() => {
    if (!getSession()) { setChecking(false); return }
    getMe().then(setUser).catch(() => clearSession()).finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    const expired = () => {
      clearSession()
      setUser(null)
      setNotice('Your session ended. Please sign in again.')
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, expired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, expired)
  }, [])

  const signedIn = (next) => { setNotice(''); setScreenId('overview'); setUser(next) }
  const signOut = () => { clearSession(); setNotice(''); setUser(null) }

  const seo = <Seo title="Staff dashboard | SWK Ghana" description="SWK Ghana staff dashboard." path="/admin" noindex />

  if (checking) return <>{seo}<Loading /></>
  if (!user) return <>{seo}<AdminLogin onSignedIn={signedIn} notice={notice} /></>
  if (user.mustChangePassword) return <>{seo}<ChangePasswordForm user={user} onChanged={signedIn} /></>

  const allowed = SCREENS.filter((s) => s.roles.includes(user.role))
  const { Screen } = allowed.find((s) => s.id === screenId) || allowed[0]

  return (
    <div className="min-h-screen bg-[#F7FAF2] lg:flex">
      {seo}
      <aside className="bg-[#0C2E11] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-none lg:flex-col">
        <FlowStrip className="h-2.5 flex-none" />
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block lg:py-6">
          <div>
            <p className="text-lg font-bold leading-tight text-white">SWK Ghana</p>
            <p className="text-xs text-white/70">Staff dashboard</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/85 hover:bg-white/10 lg:hidden">
            <LuLogOut aria-hidden="true" /> Sign out
          </button>
        </div>
        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {allowed.map((s) => (
            <button
              key={s.id}
              onClick={() => setScreenId(s.id)}
              aria-current={s.Screen === Screen ? 'page' : undefined}
              className={`flex flex-none items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${s.Screen === Screen ? 'bg-[#78C31E] text-[#0C2E11]' : 'text-white/85 hover:bg-white/10'}`}
            >
              <s.icon className="h-4 w-4 flex-none" aria-hidden="true" />
              {s.label}
            </button>
          ))}
        </nav>
        <div className="hidden border-t border-white/15 px-5 py-4 lg:block">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-white/70">{ROLE_NAMES[user.role]}</p>
          <button onClick={signOut} className="mt-2 inline-flex items-center gap-2 rounded-lg py-1.5 text-sm text-white/85 hover:text-white">
            <LuLogOut aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <Screen user={user} onNavigate={setScreenId} />
      </main>
    </div>
  )
}

export default Admin
