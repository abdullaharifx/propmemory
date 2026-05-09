import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Upload } from 'lucide-react'
import AddPropertyModal from '../components/property/AddPropertyModal'
import CSVImporter from '../components/import/CSVImporter'

export default function Onboarding() {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImporter, setShowImporter] = useState(false)

  function handlePropertyAdded() {
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--color-accent-light)',
          borderRadius: 'var(--border-radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Building2 size={28} color="var(--color-accent)" strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          margin: '0 0 12px',
          letterSpacing: '-0.3px',
        }}>
          Welcome to Halabrix Property Manager
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'var(--color-text-secondary)',
          margin: '0 0 40px',
          lineHeight: '1.5',
        }}>
          Let's set up your first property.
        </p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 20px',
              backgroundColor: 'var(--color-background-primary)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--border-radius-lg)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border-primary)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-accent-light)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Building2 size={18} color="var(--color-accent)" />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '2px',
              }}>
                Add a property manually
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}>
                Enter tenant details, lease dates, and rent
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowImporter(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 20px',
              backgroundColor: 'var(--color-background-primary)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--border-radius-lg)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border-primary)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-success-light)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Upload size={18} color="var(--color-success)" />
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                marginBottom: '2px',
              }}>
                Import from CSV
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}>
                Upload a spreadsheet with your existing properties
              </div>
            </div>
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddPropertyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handlePropertyAdded}
        />
      )}

      {showImporter && (
        <CSVImporter
          onClose={() => setShowImporter(false)}
          onSuccess={handlePropertyAdded}
        />
      )}
    </div>
  )
}
