import { useState } from 'react'
import { Plus, X, Check, Wrench } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import { MAINTENANCE_TYPES } from '../../constants'
import toast from 'react-hot-toast'

const STATUS_DOT = {
  'open':        { color: 'var(--color-danger)',   label: 'Open' },
  'in-progress': { color: 'var(--color-warning)',  label: 'In progress' },
  'resolved':    { color: 'var(--color-success)',  label: 'Resolved' },
}

const BLANK = {
  title: '', description: '', type: 'issue',
  contractor: '', cost: '', logged_date: new Date().toISOString().split('T')[0],
}

export default function MaintenanceLog({ property, onUpdate }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)

  const entries = (property.maintenance_log || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      const { error } = await supabase.from('maintenance_log').insert({
        property_id: property.id,
        title: form.title,
        description: form.description || null,
        type: form.type,
        status: 'open',
        contractor: form.contractor || null,
        cost: form.cost ? parseFloat(form.cost) : null,
        logged_date: form.logged_date,
      })
      if (error) throw error
      toast.success('Issue logged')
      setShowModal(false)
      setForm(BLANK)
      onUpdate?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputSt = {
    width: '100%', padding: '8px 10px', fontSize: '13px',
    fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-background-primary)',
    border: '1px solid var(--color-border-secondary)',
    borderRadius: 'var(--border-radius-sm)', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div>
      {entries.length === 0 && (
        <div style={{ padding: '16px 0', fontSize: '14px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
          No maintenance records yet.
        </div>
      )}

      {entries.map(entry => {
        const dot = STATUS_DOT[entry.status] || STATUS_DOT.open
        const typeLabel = MAINTENANCE_TYPES.find(t => t.value === entry.type)?.label || entry.type
        return (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 0',
              borderBottom: '1px solid var(--color-border-primary)',
              alignItems: 'flex-start',
            }}
          >
            <span style={{
              width: '9px', height: '9px', borderRadius: '50%',
              backgroundColor: dot.color, flexShrink: 0, marginTop: '5px',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
                  {entry.title}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '500', color: dot.color }}>
                  {dot.label}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  {typeLabel}
                </span>
              </div>
              {entry.description && (
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '3px', lineHeight: '1.4' }}>
                  {entry.description}
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '5px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {formatDate(entry.logged_date)}
                </span>
                {entry.contractor && (
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Contractor: {entry.contractor}
                  </span>
                )}
                {entry.cost && (
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Cost: £{Number(entry.cost).toLocaleString('en-GB')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <button
        onClick={() => setShowModal(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginTop: '14px', padding: '7px 14px', fontSize: '13px',
          fontWeight: '500', fontFamily: 'var(--font-sans)',
          color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-light)',
          border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
        }}
      >
        <Plus size={13} /> Log issue
      </button>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '16px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            backgroundColor: 'var(--color-background-primary)',
            borderRadius: 'var(--border-radius-lg)',
            width: '100%', maxWidth: '480px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px', borderBottom: '1px solid var(--color-border-primary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <Wrench size={16} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  Log maintenance issue
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px', display: 'flex', alignItems: 'center' }}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Title <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input value={form.title} onChange={set('title')} placeholder="e.g. Boiler not heating" style={inputSt}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '5px' }}>
                  Description
                </label>
                <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Additional details…"
                  style={{ ...inputSt, resize: 'vertical', lineHeight: '1.5' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '5px' }}>Type</label>
                  <select value={form.type} onChange={set('type')} style={{ ...inputSt, cursor: 'pointer' }}>
                    {MAINTENANCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '5px' }}>Date</label>
                  <input type="date" value={form.logged_date} onChange={set('logged_date')} style={inputSt}
                    onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '5px' }}>Contractor</label>
                  <input value={form.contractor} onChange={set('contractor')} placeholder="Name or company" style={inputSt}
                    onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '5px' }}>Cost (£)</label>
                  <input type="number" value={form.cost} onChange={set('cost')} placeholder="0.00" style={inputSt}
                    onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-border-primary)', marginTop: '4px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 18px', fontSize: '13px', fontWeight: '500',
                    fontFamily: 'var(--font-sans)', color: '#fff',
                    backgroundColor: 'var(--color-accent)', border: 'none',
                    borderRadius: 'var(--border-radius-sm)', cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Check size={13} /> {saving ? 'Saving…' : 'Log issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
