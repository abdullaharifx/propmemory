import { useNavigate, useLocation } from 'react-router-dom'
import { Building2, Plus, LogOut, Home, X, Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PROPERTY_STATUS } from '../../constants'
import toast from 'react-hot-toast'

const statusDot = {
  active:   'var(--color-success)',
  vacant:   'var(--color-warning)',
  archived: 'var(--color-text-secondary)',
}

export default function Sidebar({ properties = [], onAddProperty, onImportCSV, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    navigate('/login')
  }

  const activeId = location.pathname.startsWith('/property/')
    ? location.pathname.split('/property/')[1]
    : null

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      backgroundColor: 'var(--color-background-primary)',
      borderRight: '1px solid var(--color-border-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 30,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--color-border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--border-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Building2 size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
            PropMemory
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: '4px' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dashboard link */}
      <div style={{ padding: '8px', flexShrink: 0 }}>
        <button
          onClick={() => { navigate('/dashboard'); onClose?.() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--border-radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            backgroundColor: location.pathname === '/dashboard' ? 'var(--color-accent-light)' : 'transparent',
            color: location.pathname === '/dashboard' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            textAlign: 'left',
          }}
        >
          <Home size={15} />
          Dashboard
        </button>
      </div>

      {/* Properties list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {properties.length > 0 && (
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            padding: '8px 10px 4px',
          }}>
            Properties
          </div>
        )}
        {properties.map(p => {
          const isActive = p.id === activeId
          return (
            <button
              key={p.id}
              onClick={() => { navigate(`/property/${p.id}`); onClose?.() }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--border-radius-md)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
                textAlign: 'left',
                marginBottom: '2px',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: statusDot[p.status] || statusDot.active,
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {p.address}
                </div>
                {p.tenant_name && (
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.tenant_name}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div style={{
        padding: '8px',
        borderTop: '1px solid var(--color-border-primary)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <button
          onClick={() => { onAddProperty?.(); onClose?.() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--border-radius-md)',
            border: '1px dashed var(--color-border-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'transparent',
            color: 'var(--color-accent)',
            textAlign: 'left',
          }}
        >
          <Plus size={14} />
          Add property
        </button>
        <button
          onClick={() => { onImportCSV?.(); onClose?.() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--border-radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Upload size={14} />
          Import CSV
        </button>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px 10px',
            borderRadius: 'var(--border-radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  )
}
