import { withBase } from '@/utils/asset'

export function assetUrl(path: string) {
  return /^(https?:|mailto:|tel:|data:)/.test(path) ? path : withBase(path)
}

export function shortVenue(venue: string) {
  return venue.replace(/\b(19|20)\d{2}\b/g, '').replace(/\bMain(?: Conference)?\b/g, '').trim()
}

export function periodStart(period: string) {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  const year = Number(period.match(/\d{4}/)?.[0] ?? 0)
  return year * 100 + Math.max(0, months.indexOf(period.trim().slice(0, 3).toLowerCase()) + 1)
}
