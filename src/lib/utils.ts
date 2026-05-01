import { addDays, differenceInCalendarDays, format, isValid, parseISO } from 'date-fns'

export function hhmmToMinutes(hhmm: string | null | undefined): number | null {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map((x) => Number(x))
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

export function formatMinutesAsTime(minutes: number | null | undefined) {
  if (minutes == null) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function ymdToDate(ymd: string) {
  // date stored as YYYY-MM-DD
  const d = parseISO(ymd)
  return isValid(d) ? d : new Date(ymd)
}

export function dateToYmd(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

export function longestStreak(daysMet: string[]) {
  if (daysMet.length === 0) return 0
  const sorted = [...new Set(daysMet)].sort()
  let best = 1
  let cur = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = ymdToDate(sorted[i - 1]!)
    const next = ymdToDate(sorted[i]!)
    const diff = differenceInCalendarDays(next, prev)
    if (diff === 1) {
      cur += 1
      best = Math.max(best, cur)
    } else {
      cur = 1
    }
  }
  return best
}

export function lastNDaysRange(n: number, end = new Date()) {
  const endYmd = dateToYmd(end)
  const start = addDays(end, -(n - 1))
  const startYmd = dateToYmd(start)
  return { startYmd, endYmd }
}

