import { useState } from 'react'
import { X, Building2 } from 'lucide-react'
import { useCreateProperty } from '../../hooks/useProperties'
import toast from 'react-hot-toast'

const INITIAL = {
  address: '',
  unit_identifier: '',
  tenant_name: '',
  tenant_email: '',
  rent_amount: '',
  rent_currency: 'GBP',
  lease_start: '',
  lease_end: '',
  deposit: '',
  notice_period_months: '1',
  pets_allowed: 'No',
  parking: 'No',
  landlord_notes: '',
}

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--color-text-primary)',
        marginBottom: '5px',
      }}>
        {label}
        {required && <span style={{ color: 'var(--color-danger)', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px 11px',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-background-primary)',
  border: '1px solid var(--color-border-secondary)',
  borderRadius: 'var(--border-radius-md)',
  outline: 'none',
  boxSizing: 'border-box',
}

function Input({ value, onChange, type = 'text', placeholder, required, onFocus, onBlur }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; onFocus?.() }}
      onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)'; onBlur?.() }}
    />
  )
}

export default function AddPropertyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(INITIAL)
  const { createProperty, loading } = useCreateProperty()

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await createProperty({
        address: form.address,
        unit_identifier:     form.unit_identifier     || null,
        tenant_name:         form.tenant_name         || null,
        tenant_email:        form.tenant_email        || null,
        rent_amount:         form.rent_amount         ? parseFloat(form.rent_amount) : null,
        rent_currency:       form.rent_currency,
        lease_start:         form.lease_start         || null,
        lease_end:           form.lease_end           || null,
        deposit:             form.deposit             ? parseFloat(form.deposit) : null,
        notice_period_months: parseInt(form.notice_period_months, 10),
        pets_allowed:        form.pets_allowed,
        parking:             form.parking,
        landlord_notes:      form.landlord_notes      || null,
      })
      toast.success('Property added')
      onSuccess?.()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-lg)',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border-primary)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-accent-light)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Building2 size={16} color="var(--color-accent)" />
            </div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              Add property
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '4px',
              borderRadius: 'var(--border-radius-sm)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Section: Property */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '12px',
            }}>
              Property
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Field label="Address" required>
                <Input
                  value={form.address}
                  onChange={set('address')}
                  placeholder="12 Example Street, London"
                  required
                />
              </Field>
              <Field label="Unit / Flat identifier">
                <Input
                  value={form.unit_identifier}
                  onChange={set('unit_identifier')}
                  placeholder="Flat 2A (optional)"
                />
              </Field>
            </div>
          </div>

          {/* Section: Tenant */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '12px',
            }}>
              Tenant
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Tenant name">
                <Input value={form.tenant_name} onChange={set('tenant_name')} placeholder="Jane Smith" />
              </Field>
              <Field label="Tenant email">
                <Input type="email" value={form.tenant_email} onChange={set('tenant_email')} placeholder="jane@email.com" />
              </Field>
            </div>
          </div>

          {/* Section: Financials */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '12px',
            }}>
              Financials
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: '12px' }}>
              <Field label="Monthly rent">
                <Input type="number" value={form.rent_amount} onChange={set('rent_amount')} placeholder="1200" />
              </Field>
              <Field label="Currency">
                <select
                  value={form.rent_currency}
                  onChange={set('rent_currency')}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option>GBP</option>
                  <option>EUR</option>
                  <option>USD</option>
                </select>
              </Field>
              <Field label="Deposit">
                <Input type="number" value={form.deposit} onChange={set('deposit')} placeholder="1200" />
              </Field>
            </div>
          </div>

          {/* Section: Lease */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '12px',
            }}>
              Lease
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <Field label="Lease start">
                <Input type="date" value={form.lease_start} onChange={set('lease_start')} />
              </Field>
              <Field label="Lease end">
                <Input type="date" value={form.lease_end} onChange={set('lease_end')} />
              </Field>
            </div>
            <Field label="Notice period">
              <select
                value={form.notice_period_months}
                onChange={set('notice_period_months')}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="1">1 month</option>
                <option value="2">2 months</option>
                <option value="3">3 months</option>
              </select>
            </Field>
          </div>

          {/* Section: Details */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '12px',
            }}>
              Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <Field label="Pets allowed">
                <Input value={form.pets_allowed} onChange={set('pets_allowed')} placeholder="No" />
              </Field>
              <Field label="Parking">
                <select
                  value={form.parking}
                  onChange={set('parking')}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Street only">Street only</option>
                </select>
              </Field>
            </div>
            <Field label="Landlord notes">
              <textarea
                value={form.landlord_notes}
                onChange={set('landlord_notes')}
                placeholder="Private notes about this property or tenant…"
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: '1.5',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
              />
            </Field>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            paddingTop: '4px',
            borderTop: '1px solid var(--color-border-primary)',
            marginTop: '4px',
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'var(--font-sans)',
                color: '#fff',
                backgroundColor: loading ? 'var(--color-accent-hover)' : 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Adding…' : 'Add property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
