import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  'on-time': { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
  'late':    { bg: 'var(--color-warning-light)', text: 'var(--color-warning)' },
  'missed':  { bg: 'var(--color-danger-light)',  text: 'var(--color-danger)' },
  'partial': { bg: 'var(--color-warning-light)', text: 'var(--color-warning)' },
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const BLANK_ROW = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  status: 'on-time',
  amount_paid: '',
  date_paid: '',
  notes: '',
}

export default function PaymentHistory({ property, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK_ROW)
  const [saving, setSaving] = useState(false)

  const payments = (property.payment_history || [])
    .sort((a, b) => b.year - a.year || b.month - a.month)
    .slice(0, 12)

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.from('payment_history').insert({
        property_id: property.id,
        month: parseInt(form.month, 10),
        year: parseInt(form.year, 10),
        status: form.status,
        amount_paid: form.amount_paid ? parseFloat(form.amount_paid) : null,
        date_paid: form.date_paid || null,
        notes: form.notes || null,
      })
      if (error) throw error
      toast.success('Payment logged')
      setShowForm(false)
      setForm(BLANK_ROW)
      onUpdate?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputSt = {
    padding: '6px 9px',
    fontSize: '13px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-background-primary)',
    border: '1px solid var(--color-border-secondary)',
    borderRadius: 'var(--border-radius-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div>
      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 90px 100px 100px 1fr',
        gap: '8px',
        padding: '6px 0',
        borderBottom: '2px solid var(--color-border-primary)',
        marginBottom: '4px',
      }}>
        {['Period', 'Status', 'Amount paid', 'Date paid', 'Notes'].map(h => (
          <div key={h} style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {payments.length === 0 && (
        <div style={{ padding: '20px 0', fontSize: '14px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
          No payment records yet.
        </div>
      )}
      {payments.map(p => {
        const style = STATUS_STYLE[p.status] || STATUS_STYLE['on-time']
        return (
          <div
            key={p.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 90px 100px 100px 1fr',
              gap: '8px',
              padding: '9px 0',
              borderBottom: '1px solid var(--color-border-primary)',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
              {MONTH_NAMES[p.month - 1]} {p.year}
            </div>
            <span style={{
              display: 'inline-flex',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: '600',
              backgroundColor: style.bg,
              color: style.text,
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}>
              {p.status.replace('-', ' ')}
            </span>
            <div style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
              {p.amount_paid ? `£${Number(p.amount_paid).toLocaleString('en-GB', { minimumFractionDigits: 0 })}` : '—'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {p.date_paid ? formatDate(p.date_paid) : '—'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.notes || '—'}
            </div>
          </div>
        )
      })}

      {/* Add form */}
      {showForm ? (
        <form onSubmit={handleAdd} style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '100px 90px 100px 100px 1fr auto auto', gap: '8px', alignItems: 'center' }}>
          <select value={form.month} onChange={set('month')} style={{ ...inputSt, cursor: 'pointer' }}>
            {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" value={form.year} onChange={set('year')} style={inputSt} placeholder="2025" min="2000" max="2100" />
          <select value={form.status} onChange={set('status')} style={{ ...inputSt, cursor: 'pointer' }}>
            {['on-time', 'late', 'missed', 'partial'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" value={form.amount_paid} onChange={set('amount_paid')} style={inputSt} placeholder="£" />
          <input type="date" value={form.date_paid} onChange={set('date_paid')} style={inputSt} />
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '6px 12px', fontSize: '12px', fontWeight: '500',
              fontFamily: 'var(--font-sans)', color: '#fff',
              backgroundColor: 'var(--color-accent)', border: 'none',
              borderRadius: 'var(--border-radius-sm)', cursor: saving ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Check size={12} /> {saving ? '…' : 'Log'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{
              padding: '6px 10px', fontSize: '12px', fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
              border: '1px solid var(--color-border-secondary)',
              borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginTop: '14px', padding: '7px 14px', fontSize: '13px',
            fontWeight: '500', fontFamily: 'var(--font-sans)',
            color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-light)',
            border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
          }}
        >
          <Plus size={13} /> Log payment
        </button>
      )}
    </div>
  )
}
