import LeaseSection from './LeaseSection'
import PaymentHistory from './PaymentHistory'
import MaintenanceLog from './MaintenanceLog'
import LandlordNotes from './LandlordNotes'

function Section({ title, children }) {
  return (
    <div style={{
      backgroundColor: 'var(--color-background-primary)',
      border: '1px solid var(--color-border-primary)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--color-border-primary)',
        backgroundColor: 'var(--color-background-secondary)',
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  )
}

export default function MemoryPanel({ property, onUpdate }) {
  return (
    <div style={{ maxWidth: '860px' }}>
      <Section title="Lease & Tenant Details">
        <LeaseSection property={property} onUpdate={onUpdate} />
      </Section>

      <Section title="Payment History">
        <PaymentHistory property={property} onUpdate={onUpdate} />
      </Section>

      <Section title="Maintenance Log">
        <MaintenanceLog property={property} onUpdate={onUpdate} />
      </Section>

      <Section title="Landlord Notes">
        <LandlordNotes property={property} onUpdate={onUpdate} />
      </Section>
    </div>
  )
}
