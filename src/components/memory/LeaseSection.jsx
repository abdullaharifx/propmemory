import { useState } from 'react'
import { Edit2, Save, X } from 'lucide-react'
import { useUpdateProperty } from '../../hooks/useProperties'
import { formatDate, formatCurrency } from '../../lib/utils'
import { PROPERTY_STATUS } from '../../constants'
import toast from 'react-hot-toast'

function Row({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      padding: '10px 0',
      borderBottom: '1px solid var(--color-border-primary)',
      alignItems: 'flex-start',
      gap: '16px',
    }}>
      <div style={{
        width: '160px',
        flexShrink: 0,
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--color-text-secondary)',
      }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', flex: 1 }}>
        {value || <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Not set</span>}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '7px 10px',
  fontSize: '13px',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-background-primary)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--border-radius-sm)',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function LeaseSection({ property, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const { updateProperty, loading } = useUpdateProperty()

  function startEdit() {
    setForm({
      address:              property.address || '',
      unit_identifier:      property.unit_identifier || '',
      tenant_name:          property.tenant_name || '',
      tenant_email:         property.tenant_email || '',
      rent_amount:          property.rent_amount || '',
      rent_currency:        property.rent_currency || 'GBP',
      lease_start:          property.lease_start || '',
      lease_end:            property.lease_end || '',
      deposit:              property.deposit || '',
      notice_period_months: property.notice_period_months || '1',
      pets_allowed:         property.pets_allowed || 'No',
      parking:              property.parking || 'No',
      status:               property.status || 'active',
    })
    setEditing(true)
  }

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSave() {
    try {
      await updateProperty(property.id, {
        ...form,
        rent_amount:  form.rent_amount  ? parseFloat(form.rent_amount)  : null,
        deposit:      form.deposit      ? parseFloat(form.deposit)      : null,
        notice_period_months: parseInt(form.notice_period_months, 10),
        unit_identifier: form.unit_identifier || null,
        tenant_name:     form.tenant_name     || null,
        tenant_email:    form.tenant_email    || null,
        lease_start:     form.lease_start     || null,
        lease_end:       form.lease_end       || null,
      })
      toast.success('Lease details saved')
      setEditing(false)
      onUpdate?.()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        {editing ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', fontSize: '13px', fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-secondary)', backgroundColor: 'transparent',
                border: '1px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
              }}
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', fontSize: '13px', fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                color: '#fff', backgroundColor: 'var(--color-accent)',
                border: 'none', borderRadius: 'var(--border-radius-sm)', cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <Save size={13} /> {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', fontSize: '13px', fontFamily: 'var(--font-sans)',
              color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-light)',
              border: 'none', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
            }}
          >
            <Edit2 size={13} /> Edit
          </button>
        )}
      </div>

      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            ['Address', 'address', 'text'],
            ['Unit / Flat', 'unit_identifier', 'text'],
            ['Tenant name', 'tenant_name', 'text'],
            ['Tenant email', 'tenant_email', 'email'],
            ['Monthly rent', 'rent_amount', 'number'],
            ['Deposit', 'deposit', 'number'],
            ['Lease start', 'lease_start', 'date'],
            ['Lease end', 'lease_end', 'date'],
          ].map(([label, field, type]) => (
            <div key={field} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '160px', flexShrink: 0, fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
                {label}
              </div>
              <input
                type={type}
                value={form[field]}
                onChange={set(field)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
              />
            </div>
          ))}
          {[
            ['Currency', 'rent_currency', ['GBP', 'EUR', 'USD']],
            ['Notice period', 'notice_period_months', ['1', '2', '3']],
            ['Status', 'status', ['active', 'vacant', 'archived']],
          ].map(([label, field, opts]) => (
            <div key={field} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '160px', flexShrink: 0, fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
                {label}
              </div>
              <select value={form[field]} onChange={set(field)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '160px', flexShrink: 0, fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
              Pets allowed
            </div>
            <input
              value={form.pets_allowed}
              onChange={set('pets_allowed')}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '160px', flexShrink: 0, fontSize: '13px', fontWeight: '500', color: 'var(--color-text-secondary)' }}>
              Parking
            </div>
            <select value={form.parking} onChange={set('parking')} style={{ ...inputStyle, cursor: 'pointer' }}>
              {['No', 'Yes', 'Street only'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div>
          <Row label="Address" value={property.address} />
          <Row label="Unit / Flat" value={property.unit_identifier} />
          <Row label="Tenant name" value={property.tenant_name} />
          <Row label="Tenant email" value={property.tenant_email} />
          <Row label="Monthly rent" value={property.rent_amount ? formatCurrency(property.rent_amount, property.rent_currency) : null} />
          <Row label="Deposit" value={property.deposit ? formatCurrency(property.deposit, property.rent_currency) : null} />
          <Row label="Lease start" value={formatDate(property.lease_start)} />
          <Row label="Lease end" value={formatDate(property.lease_end)} />
          <Row label="Notice period" value={property.notice_period_months ? `${property.notice_period_months} month${property.notice_period_months > 1 ? 's' : ''}` : null} />
          <Row label="Pets allowed" value={property.pets_allowed} />
          <Row label="Parking" value={property.parking} />
          <Row label="Status" value={PROPERTY_STATUS[property.status]?.label} />
        </div>
      )}
    </div>
  )
}
