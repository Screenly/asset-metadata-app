import { formatTime, getLocale, getTimeZone } from '@screenly/edge-apps'

let clockTimer: ReturnType<typeof setInterval> | undefined

function setText(id: string, value: string): void {
  const el = document.getElementById(id)
  if (el) el.textContent = value
}

export function renderDisplay(): void {
  const ratio = window.devicePixelRatio || 1
  const width = Math.round(window.innerWidth * ratio)
  const height = Math.round(window.innerHeight * ratio)
  const orientation = width >= height ? 'Landscape' : 'Portrait'
  setText('display', `${width} × ${height} · ${orientation}`)
}

export function formatClock(date: Date, locale: string, tz: string): string {
  const { hour, minute, dayPeriod } = formatTime(date, locale, tz)
  return dayPeriod ? `${hour}:${minute} ${dayPeriod}` : `${hour}:${minute}`
}

export async function startClock(): Promise<void> {
  const [timezone, locale] = await Promise.all([getTimeZone(), getLocale()])
  setText('timezone', timezone.replaceAll('_', ' '))

  const tick = () =>
    setText('local-time', formatClock(new Date(), locale, timezone))
  tick()

  if (clockTimer) clearInterval(clockTimer)
  clockTimer = setInterval(tick, 1000)
}

export function stopClock(): void {
  if (clockTimer) clearInterval(clockTimer)
  clockTimer = undefined
}
