import { useState, useEffect } from 'react'
import { AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { getInsights } from '../../lib/ai'

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

const urgencyStyle = {
  critical: {
    bg: 'var(--color-danger-light)',
    text: 'var(--color-danger)',
    border: 'var(--color-danger)',
    Icon: AlertCircle,
  },
  warning: {
    bg: 'var(--color-warning-light)',
    text: 'var(--color-warning)',
    border: 'var(--color-warning)',
    Icon: AlertTriangle,
  },
  info: {
    bg: 'var(--color-accent-light)',
    text: 'var(--color-accent)',
    border: 'var(--color-accent)',
    Icon: Info,
  },
}

export default function InsightsBar({ property, onPromptSelect }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!property?.id) return
    const cached = getCached(property.id)
    if (cached) {
      setInsights((cached.insights || []).slice(0, 2))
      setLoading(false)
      return
    }
    getInsights(property)
      .then(result => {
        setCache(property.id, result)
        setInsights((result.insights || []).slice(0, 2))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [property?.id])

  if (loading || insights.length === 0) return null

  return (
    <div style={{
      padding: '10px 16px',
      borderBottom: '1px solid var(--color-border-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      {insights.map((insight, i) => {
        const style = urgencyStyle[insight.urgency] || urgencyStyle.info
        const Icon = style.Icon
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: style.bg,
              borderRadius: 'var(--border-radius-sm)',
              padding: '7px 10px',
            }}
          >
            <Icon size={13} color={style.text} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '12px', color: style.text, lineHeight: '1.4' }}>
              {insight.text}
            </span>
            {insight.action && onPromptSelect && (
              <button
                onClick={() => onPromptSelect(insight.action)}
                style={{
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-sans)',
                  color: style.text,
                  backgroundColor: 'transparent',
                  border: `1px solid ${style.border}`,
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {insight.action}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
