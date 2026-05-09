import { useState, useEffect } from 'react'
import { useUpdateProperty } from '../../hooks/useProperties'
import toast from 'react-hot-toast'

const MAX = 2000

export default function LandlordNotes({ property, onUpdate }) {
  const [notes, setNotes] = useState(property.landlord_notes || '')
  const [dirty, setDirty] = useState(false)
  const { updateProperty } = useUpdateProperty()

  useEffect(() => {
    setNotes(property.landlord_notes || '')
    setDirty(false)
  }, [property.landlord_notes])

  async function handleBlur() {
    if (!dirty) return
    try {
      await updateProperty(property.id, { landlord_notes: notes })
      setDirty(false)
      onUpdate?.()
      toast.success('Notes saved')
    } catch {
      toast.error('Failed to save notes')
    }
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{
          fontSize: '12px',
          color: dirty ? 'var(--color-warning)' : 'var(--color-text-secondary)',
        }}>
          {dirty ? 'Unsaved — click outside to save' : 'Auto-saves on blur'}
        </span>
        <span style={{
          fontSize: '12px',
          color: notes.length > MAX * 0.9 ? 'var(--color-danger)' : 'var(--color-text-secondary)',
        }}>
          {notes.length} / {MAX}
        </span>
      </div>
      <textarea
        value={notes}
        onChange={e => { setNotes(e.target.value); setDirty(true) }}
        maxLength={MAX}
        rows={7}
        placeholder="Add private notes about this tenant — the AI will use them."
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-secondary)',
          borderRadius: 'var(--border-radius-md)',
          outline: 'none',
          resize: 'vertical',
          lineHeight: '1.6',
          boxSizing: 'border-box',
          minHeight: '140px',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)'; handleBlur() }}
      />
    </div>
  )
}
