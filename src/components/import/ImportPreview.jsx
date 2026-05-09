import { useState } from 'react'
import { AlertTriangle, CheckSquare, Square, ArrowLeft } from 'lucide-react'

export default function ImportPreview({ result, onBack, onImport, importing }) {
  const [selected, setSelected] = useState(() =>
    new Set(result.properties.map((_, i) => i))
  )

  function toggle(i) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === result.properties.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(result.properties.map((_, i) => i)))
    }
  }

  const selectedProps = result.properties.filter((_, i) => selected.has(i))

  const th = {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '8px 10px',
    textAlign: 'left',
    borderBottom: '2px solid var(--color-border-primary)',
    backgroundColor: 'var(--color-background-secondary)',
    whiteSpace: 'nowrap',
  }

  const td = {
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    padding: '9px 10px',
    borderBottom: '1px solid var(--color-border-primary)',
    verticalAlign: 'top',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Summary */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border-primary)',
        backgroundColor: 'var(--color-accent-light)',
      }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--color-accent)' }}>
          {result.summary || `Found ${result.properties.length} properties.`}
        </p>
      </div>

      {/* Warnings */}
      {result.warnings?.length > 0 && (
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--color-border-primary)' }}>
          {result.warnings.map((w, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '7px',
              marginBottom: i < result.warnings.length - 1 ? '6px' : 0,
              padding: '7px 10px',
              backgroundColor: 'var(--color-warning-light)',
              borderRadius: 'var(--border-radius-sm)',
            }}>
              <AlertTriangle size={13} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-warning)' }}>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ ...th, width: '36px', cursor: 'pointer' }} onClick={toggleAll}>
                {selected.size === result.properties.length
                  ? <CheckSquare size={14} color="var(--color-accent)" />
                  : <Square size={14} color="var(--color-text-secondary)" />}
              </th>
              <th style={th}>Address</th>
              <th style={th}>Tenant</th>
              <th style={th}>Rent</th>
              <th style={th}>Lease end</th>
              <th style={th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {result.properties.map((p, i) => {
              const on = selected.has(i)
              return (
                <tr
                  key={i}
                  onClick={() => toggle(i)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: on ? 'var(--color-background-primary)' : 'var(--color-background-secondary)',
                    opacity: on ? 1 : 0.5,
                  }}
                >
                  <td style={{ ...td, textAlign: 'center' }}>
                    {on
                      ? <CheckSquare size={14} color="var(--color-accent)" />
                      : <Square size={14} color="var(--color-text-secondary)" />}
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: '500' }}>{p.address}</div>
                    {p.unit_identifier && <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{p.unit_identifier}</div>}
                  </td>
                  <td style={td}>
                    <div>{p.tenant_name || <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No name</span>}</div>
                    {p.tenant_email && <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{p.tenant_email}</div>}
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    {p.rent_amount ? `£${Number(p.rent_amount).toLocaleString('en-GB')}` : '—'}
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    {p.lease_end || <span style={{ color: 'var(--color-text-secondary)' }}>—</span>}
                  </td>
                  <td style={{ ...td, maxWidth: '180px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.landlord_notes || '—'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 24px',
        borderTop: '1px solid var(--color-border-primary)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'var(--font-sans)',
            color: 'var(--color-text-secondary)', padding: '8px 0',
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => onImport(selectedProps)}
          disabled={selected.size === 0 || importing}
          style={{
            padding: '9px 20px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            color: '#fff',
            backgroundColor: selected.size === 0 ? 'var(--color-border-secondary)' : 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            cursor: selected.size === 0 || importing ? 'not-allowed' : 'pointer',
          }}
        >
          {importing ? 'Importing…' : `Import ${selected.size} propert${selected.size === 1 ? 'y' : 'ies'}`}
        </button>
      </div>
    </div>
  )
}
