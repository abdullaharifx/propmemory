import { format, parseISO, differenceInDays } from 'date-fns'

export function formatDate(dateStr) {
  if (!dateStr) return 'Not set'
  try { return format(parseISO(dateStr), 'd MMM yyyy') }
  catch { return dateStr }
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  try { return differenceInDays(parseISO(dateStr), new Date()) }
  catch { return null }
}

export function leaseUrgency(dateStr) {
  const days = daysUntil(dateStr)
  if (days === null) return 'unknown'
  if (days < 0) return 'expired'
  if (days <= 30) return 'critical'
  if (days <= 60) return 'warning'
  return 'ok'
}

export function formatCurrency(amount, currency = 'GBP') {
  if (!amount) return 'Not set'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency', currency
  }).format(amount)
}

export function paymentStatusColor(status) {
  const map = {
    'on-time': 'success',
    'late': 'warning',
    'missed': 'danger',
    'partial': 'warning'
  }
  return map[status] || 'secondary'
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
