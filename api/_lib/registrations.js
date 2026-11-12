// Registration totals, read from the Apps Scripts behind each form. The scripts
// return counts only, so no registrant's details ever reach this server.
const script = (id) => `https://script.google.com/macros/s/${id}/exec`

export const FORMS = [
  { id: 'summit', name: 'Agribusiness Summit 2026', url: script('AKfycbyTB-DhRDXS_nk3ny0UfRP1epFs7a5RK5Z2_CjWuugk5bb9n4GfTPNOQPVk_d9VRGTu') },
  { id: 'volunteers', name: 'Summit volunteers', url: script('AKfycbxh2cVDAxesZqKyUeIdWj4RHCP-Jo8Da-OKIA0SwvjZ9LyZITcjH68SaS-t4CeVMQSN') },
  { id: 'partners', name: 'Summit partners', url: script('AKfycbxiyaBhVtDEOtYfcoa3FWkMEg-7sD3LaSSdvBz0p25HRfsZsCvY7jOJy8jFoBk8BKTo') },
  { id: 'pitch', name: 'Elevator Pitch Workshop', url: script('AKfycbyevrLSaUWhtZRlJS65og3t8fnlYLj-xIR6-ObooQbHo6DYV9IYBbY_xLQdkowq0tsk') },
  { id: 'feedback', name: 'Summit feedback', url: script('AKfycbwdwun0tcLkKGm2HfWWjO3ZjmRzUfXbGM-nG08BK-9S8OkIc2WoSalDpJgQeMXYoMAD7A') },
  { id: 'mentorship', name: 'Mentorship requests', url: script('AKfycbw2nWywX4y50eirUYCKGmZ9j7XTGj2GDIybsKdOTe2aNLNrkLuRU6ZkdMn6PRKQk_JfGg') },
]

const TIMEOUT_MS = 8000

// state: ok | not-connected (no key set) | needs-update (old script) | refused (wrong key) | unreachable
const readForm = async (form, key, fetcher) => {
  const { id, name } = form
  if (!key) return { id, name, state: 'not-connected' }
  try {
    const res = await fetcher(`${form.url}?stats=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    const data = await res.json()
    if (data.ok && typeof data.total === 'number') {
      const { total, last7, previous7, duplicates, latest, daily, groups } = data
      return { id, name, state: 'ok', total, last7, previous7, duplicates, latest, daily, groups }
    }
    return { id, name, state: data.status === 'ready' ? 'needs-update' : 'refused' }
  } catch {
    return { id, name, state: 'unreachable' }
  }
}

export const readRegistrations = async (env, fetcher) => ({
  forms: await Promise.all(FORMS.map((form) => readForm(form, env.REGISTRATION_STATS_KEY, fetcher))),
})

export const registrations = async ({ env, fetcher }) => readRegistrations(env, fetcher)
