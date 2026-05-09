import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, Database, ArrowLeft } from 'lucide-react'
import { useProperty, useProperties } from '../hooks/useProperties'
import AppShell from '../components/layout/AppShell'
import ChatPanel from '../components/chat/ChatPanel'
import MemoryPanel from '../components/memory/MemoryPanel'
import { Skeleton } from '../components/ui/Skeleton'

const TABS = [
  { id: 'chat',   label: 'Chat',            Icon: MessageSquare },
  { id: 'memory', label: 'Property Memory', Icon: Database },
]

function PropertySkeleton({ properties }) {
  return (
    <AppShell properties={properties}>
      <div style={{ marginBottom: '20px' }}>
        <Skeleton height="13px" width="80px" style={{ marginBottom: '12px' }} />
        <Skeleton height="22px" width="55%" style={{ marginBottom: '8px' }} />
        <Skeleton height="14px" width="35%" />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <Skeleton height="38px" width="90px" radius="var(--border-radius-sm)" />
        <Skeleton height="38px" width="130px" radius="var(--border-radius-sm)" />
      </div>
      <Skeleton height="500px" radius="var(--border-radius-lg)" />
    </AppShell>
  )
}

export default function Property() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chat')
  const { property, loading, error, refetch } = useProperty(id)
  const { properties } = useProperties()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    document.title = property
      ? `Halabrix — ${property.address}`
      : 'Halabrix Property Manager'
  }, [property])

  if (loading) return <PropertySkeleton properties={properties} />

  if (error || !property) {
    return (
      <AppShell properties={properties}>
        <div style={{ backgroundColor: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', borderRadius: 'var(--border-radius-md)', padding: '16px', color: 'var(--color-danger)', fontSize: '14px' }}>
          <strong>Property not found</strong> — {error || 'This property may have been deleted or you do not have access.'}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell properties={properties} onAddProperty={() => setShowAddModal(true)}>
      <div className="mobile-bottom-pad">
        {/* Page header */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-text-secondary)', padding: '0 0 8px', minHeight: '44px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <ArrowLeft size={13} />
            Dashboard
          </button>
          <h1 style={{ margin: '0 0 3px', fontSize: '20px', fontWeight: '600', color: 'var(--color-text-primary)', letterSpacing: '-0.2px' }}>
            {property.address}
            {property.unit_identifier && (
              <span style={{ fontWeight: '400', color: 'var(--color-text-secondary)' }}>{', '}{property.unit_identifier}</span>
            )}
          </h1>
          {property.tenant_name && (
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              {property.tenant_name}
              {property.tenant_email && <span style={{ marginLeft: '8px' }}>· {property.tenant_email}</span>}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px', borderBottom: '2px solid var(--color-border-primary)', marginBottom: '20px' }}>
          {TABS.map(({ id: tabId, label, Icon }) => {
            const active = activeTab === tabId
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '9px 16px', minHeight: '44px',
                  fontSize: '14px', fontWeight: active ? '600' : '400',
                  fontFamily: 'var(--font-sans)',
                  color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  backgroundColor: 'transparent', border: 'none',
                  borderBottom: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                  marginBottom: '-2px', cursor: 'pointer',
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            )
          })}
        </div>

        {activeTab === 'chat'
          ? <ChatPanel property={property} />
          : <MemoryPanel property={property} onUpdate={refetch} />
        }
      </div>
    </AppShell>
  )
}
