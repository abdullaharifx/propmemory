import { useState } from 'react'
import { Edit2, CheckCircle, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { TONE_LABELS, TONE_COLORS } from '../../constants'
import toast from 'react-hot-toast'

const toneColorMap = {
  success:   { bg: 'var(--color-success-light)',    text: 'var(--color-success)' },
  warning:   { bg: 'var(--color-warning-light)',    text: 'var(--color-warning)' },
  danger:    { bg: 'var(--color-danger-light)',     text: 'var(--color-danger)' },
  secondary: { bg: 'var(--color-background-secondary)', text: 'var(--color-text-secondary)' },
}

export default function DraftCard({ draft: initialDraft, tone, property, onSent }) {
  const [draft, setDraft] = useState(initialDraft)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(initialDraft)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const toneColor = TONE_COLORS[tone] || 'secondary'
  const colors = toneColorMap[toneColor] || toneColorMap.secondary
  const toneLabel = TONE_LABELS[tone] || tone

  async function handleApprove() {
    if (loading) return
    setLoading(true)
    try {
      await supabase.from('activity_log').insert({
        property_id: property.id,
        type: 'message_sent',
        description: `Draft approved and marked as sent: "${draft.substring(0, 80)}${draft.length > 80 ? '…' : ''}"`,
        metadata: { draft, tone, tenant_email: property.tenant_email },
      })
      setSent(true)
      onSent?.()
      toast.success('Logged as sent')
    } catch (err) {
      toast.error('Failed to log: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSaveEdit() {
    setDraft(editValue)
    setEditing(false)
  }

  if (sent) {
    return (
      <div style={{
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '8px 12px',
        backgroundColor: 'var(--color-success-light)',
        borderRadius: 'var(--border-radius-md)',
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--color-success)',
      }}>
        <CheckCircle size={14} />
        Sent to {property.tenant_name || property.tenant_email || 'tenant'}
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '8px',
      border: '1px solid var(--color-border-primary)',
      borderRadius: 'var(--border-radius-md)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: 'var(--color-background-secondary)',
        borderBottom: '1px solid var(--color-border-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Draft message
          </span>
          {tone && (
            <span style={{
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: '500',
              backgroundColor: colors.bg,
              color: colors.text,
            }}>
              {toneLabel}
            </span>
          )}
        </div>
        {!editing && (
          <button
            onClick={() => { setEditValue(draft); setEditing(true) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-secondary)',
              padding: '3px 6px',
              borderRadius: 'var(--border-radius-sm)',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-border-primary)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Edit2 size={11} />
            Edit
          </button>
        )}
      </div>

      {/* Draft text */}
      <div style={{ padding: '12px' }}>
        {editing ? (
          <textarea
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            autoFocus
            rows={6}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.6',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-background-primary)',
              border: '1px solid var(--color-accent)',
              borderRadius: 'var(--border-radius-sm)',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: '1.7',
            color: 'var(--color-text-primary)',
            whiteSpace: 'pre-wrap',
          }}>
            {draft}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        padding: '8px 12px',
        borderTop: '1px solid var(--color-border-primary)',
        backgroundColor: 'var(--color-background-secondary)',
      }}>
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                color: '#fff',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
              }}
            >
              Save & Approve
            </button>
          </>
        ) : (
          <button
            onClick={handleApprove}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'var(--font-sans)',
              color: '#fff',
              backgroundColor: loading ? 'var(--color-accent-hover)' : 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--border-radius-sm)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Send size={12} />
            {loading ? 'Logging…' : 'Approve & Send'}
          </button>
        )}
      </div>
    </div>
  )
}
