import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, AlertCircle, Clock } from 'lucide-react'
import { formatDate, formatCurrency, leaseUrgency, daysUntil } from '../../lib/utils'
import { getInsights } from '../../lib/ai'
import { PROPERTY_STATUS } from '../../constants'

const CACHE_TTL = 60 * 60 * 1000

function getCached(id) {
  try {
    const raw = localStorage.getItem(`insights_${id}`)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch { return null }
}

function setCache(id, data) {
  try {
    localStorage.setItem(`insights_${id}`, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

const colorMap = {
  success:   { bg: 'var(--color-success-light)',    text: 'var(--color-success)' },
  warning:   { bg: 'var(--color-warning-light)',    text: 'var(--color-warning)' },
  danger:    { bg: 'var(--color-danger-light)',     text: 'var(--color-danger)' },
  secondary: { bg: 'var(--color-background-secondary)', text: 'var(--color-text-secondary)' },
}

const urgencyColor = {
  expired:  'var(--color-danger)',
  critical: 'var(--color-danger)',
  warning:  'var(--color-warning)',
  ok:       'var(--color-success)',
  unknown:  'var(--color-text-secondary)',
}

export default function PropertyCard({ property }) {
  const navigate = useNavigate()
  const [insight, setInsight] = useState(null)

  const urgency = leaseUrgency(property.lease_end)
  const days = daysUntil(property.lease_end)
  const statusInfo = PROPERTY_STATUS[property.status] || PROPERTY_STATUS.active
  const badgeColors = colorMap[statusInfo.color] || colorMap.secondary

  useEffect(() => {
    const cached = getCached(property.id)
    if (cached) {
      setInsight(cached.insights?.[0] ?? null)
      return
    }
    getInsights(property)
      .then(result => {
        setCache(property.id, result)
        setInsight(result.insights?.[0] ?? null)
      })
      .catch(() => {})
  }, [property.id])

  const insightColors = {
    critical: colorMap.danger,
    warning:  colorMap.warning,
    info:     { bg: 'var(--color-accent-light)', text: 'var(--color-accent)' },
  }

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`)}
      style={{
        backgroundColor: 'var(--color-background-primary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--color-accent)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--color-border-primary)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '3px',
          }}>
            {property.address}
            {property.unit_identifier && (
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: '400' }}>
                {', '}{property.unit_identifier}
              </span>
            )}
          </div>
          {property.tenant_name ? (
            <div style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <User size={12} strokeWidth={2} />
              {property.tenant_name}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              No tenant
            </div>
          )}
        </div>
        <span style={{
          padding: '3px 9px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: badgeColors.bg,
          color: badgeColors.text,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          {statusInfo.label}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '3px',
          }}>
            Rent / mo
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            {property.rent_amount ? formatCurrency(property.rent_amount, property.rent_currency) : '—'}
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '3px',
          }}>
            Lease end
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: urgencyColor[urgency],
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            {property.lease_end ? formatDate(property.lease_end) : '—'}
            {days !== null && days >= 0 && days <= 60 && (
              <span style={{
                fontSize: '11px',
                backgroundColor: urgency === 'critical' ? 'var(--color-danger-light)' : 'var(--color-warning-light)',
                color: urgencyColor[urgency],
                padding: '1px 5px',
                borderRadius: '999px',
                fontWeight: '600',
              }}>
                {days}d
              </span>
            )}
            {urgency === 'expired' && (
              <span style={{
                fontSize: '11px',
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                padding: '1px 5px',
                borderRadius: '999px',
                fontWeight: '600',
              }}>
                Expired
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <div style={{
          backgroundColor: (insightColors[insight.urgency] || insightColors.info).bg,
          borderRadius: 'var(--border-radius-sm)',
          padding: '9px 11px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '7px',
        }}>
          <AlertCircle
            size={13}
            color={(insightColors[insight.urgency] || insightColors.info).text}
            style={{ flexShrink: 0, marginTop: '1px' }}
          />
          <span style={{
            fontSize: '12px',
            lineHeight: '1.4',
            color: (insightColors[insight.urgency] || insightColors.info).text,
          }}>
            {insight.text}
          </span>
        </div>
      )}
    </div>
  )
}
