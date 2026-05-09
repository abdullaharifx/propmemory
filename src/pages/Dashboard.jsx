import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Upload, Building2, AlertCircle, Calendar, Home } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useProperties } from '../hooks/useProperties'
import { daysUntil } from '../lib/utils'
import AppShell from '../components/layout/AppShell'
import PropertyCard from '../components/property/PropertyCard'
import AddPropertyModal from '../components/property/AddPropertyModal'
import CSVImporter from '../components/import/CSVImporter'
import { PropertyCardSkeleton } from '../components/ui/Skeleton'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { properties, loading, error, refetch } = useProperties()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImporter, setShowImporter] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => { document.title = 'Halabrix Property Manager — Dashboard' }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserName(user.email?.split('@')[0] || 'there')
    })
  }, [])

  const openIssuesCount = properties.reduce(
    (sum, p) => sum + (p.maintenance_log || []).filter(m => m.status === 'open').length, 0
  )
  const renewalsDue = properties.filter(p => {
    const d = daysUntil(p.lease_end)
    return d !== null && d >= 0 && d <= 60
  }).length

  function handlePropertyAdded() {
    setShowAddModal(false)
    refetch()
  }

  return (
    <AppShell
      properties={properties}
      onAddProperty={() => setShowAddModal(true)}
      onImportCSV={() => setShowImporter(true)}
    >
      <div className="mobile-bottom-pad">
        {/* Greeting */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '600', color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Here's what's happening across your portfolio today.
          </p>
        </div>

        {/* Summary row */}
        {!loading && properties.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {[
              { icon: <Home size={14} />, value: properties.length, label: `propert${properties.length === 1 ? 'y' : 'ies'}`, color: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
              { icon: <AlertCircle size={14} />, value: openIssuesCount, label: `open issue${openIssuesCount === 1 ? '' : 's'}`, color: openIssuesCount > 0 ? 'var(--color-warning)' : 'var(--color-success)', bg: openIssuesCount > 0 ? 'var(--color-warning-light)' : 'var(--color-success-light)' },
              { icon: <Calendar size={14} />, value: renewalsDue, label: `renewal${renewalsDue === 1 ? '' : 's'} due`, color: renewalsDue > 0 ? 'var(--color-danger)' : 'var(--color-success)', bg: renewalsDue > 0 ? 'var(--color-danger-light)' : 'var(--color-success-light)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: item.bg, borderRadius: 'var(--border-radius-md)', padding: '8px 14px' }}>
                <span style={{ color: item.color, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: item.color }}>{item.value}</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          /* Skeleton grid */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="skeleton" style={{ height: '15px', width: '120px', borderRadius: 'var(--border-radius-sm)' }} />
              <div className="skeleton" style={{ height: '32px', width: '110px', borderRadius: 'var(--border-radius-md)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {[1, 2, 3, 4].map(i => <PropertyCardSkeleton key={i} />)}
            </div>
          </div>
        ) : error ? (
          <div style={{ backgroundColor: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', borderRadius: 'var(--border-radius-md)', padding: '16px', fontSize: '14px', color: 'var(--color-danger)' }}>
            <strong>Connection issue</strong> — {error}
            <br />
            <span style={{ fontSize: '12px', opacity: 0.8 }}>Check your Supabase URL and anon key in .env.local</span>
          </div>
        ) : properties.length === 0 ? (
          /* Empty state */
          <div style={{ backgroundColor: 'var(--color-background-primary)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--border-radius-lg)', padding: '56px 32px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
            {/* Illustration */}
            <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 20px' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--color-accent-light)', borderRadius: 'var(--border-radius-lg)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={32} color="var(--color-accent)" strokeWidth={1.5} />
              </div>
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              Add your first property
            </h2>
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              PropMemory keeps a full memory of every property — lease dates, payment history, maintenance, and more.
            </p>
            <p style={{ margin: '0 0 28px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Add manually or import from a spreadsheet.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-sans)', color: '#fff', backgroundColor: 'var(--color-accent)', border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', minHeight: '44px' }}
              >
                <Plus size={15} />
                Add property
              </button>
              <button
                onClick={() => setShowImporter(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', minHeight: '44px' }}
              >
                <Upload size={15} />
                Import CSV
              </button>
            </div>
          </div>
        ) : (
          /* Property grid */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                Your properties
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: '500', fontFamily: 'var(--font-sans)', color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-light)', border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', minHeight: '44px' }}
              >
                <Plus size={14} />
                Add property
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddPropertyModal onClose={() => setShowAddModal(false)} onSuccess={handlePropertyAdded} />
      )}
      {showImporter && (
        <CSVImporter onClose={() => setShowImporter(false)} onSuccess={() => { setShowImporter(false); refetch() }} />
      )}
    </AppShell>
  )
}
