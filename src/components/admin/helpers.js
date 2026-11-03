/** How this week compares with last week, in words. */
export const weekChange = (now, before) => {
  if (now === before) return `same as the week before (${before})`
  return `${now > before ? 'up' : 'down'} from ${before} the week before`
}

const WORST_FIRST = ['fail', 'warn', 'pass']

export const worstFirst = (checks) =>
  [...checks].sort((a, b) => WORST_FIRST.indexOf(a.status) - WORST_FIRST.indexOf(b.status))

export const problemsIn = (groups) =>
  worstFirst(groups.flatMap((group) => group.checks)).filter((check) => check.status !== 'pass')
