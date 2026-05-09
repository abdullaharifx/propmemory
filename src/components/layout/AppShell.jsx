import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Plus, Upload } from 'lucide-react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

function BottomNav({ onAddProperty, onImportCSV }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  const btn = (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    flex: 1,
    padding: '8px 4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '10px',
    fontWeight: active ? '600' : '400',
    minHeight: '56px',
  })

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 30,
      backgroundColor: 'var(--color-background-primary)',
      borderTop: '1px solid var(--color-border-primary)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <button onClick={() => navigate('/dashboard')} style={btn(isDashboard)}>
        <Home size={20} />
        Dashboard
      </button>
      <button
        onClick={onAddProperty}
        style={{
          ...btn(false),
          color: 'var(--color-accent)',
        }}
      >
        <div style={{
          width: '36px', height: '36px',
          backgroundColor: 'var(--color-accent)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1px',
        }}>
          <Plus size={18} color="#fff" />
        </div>
        Add
      </button>
      <button onClick={onImportCSV} style={btn(false)}>
        <Upload size={20} />
        Import
      </button>
    </div>
  )
}

export default function AppShell({ children, properties = [], onAddProperty, onImportCSV }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--color-background-secondary)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Desktop sidebar — always visible ≥768px */}
      <div className="hidden md:block" style={{ flexShrink: 0, width: '220px' }}>
        <Sidebar properties={properties} onAddProperty={onAddProperty} onImportCSV={onImportCSV} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={e => e.stopPropagation()}>
            <Sidebar
              properties={properties}
              onAddProperty={() => { setMobileOpen(false); onAddProperty?.() }}
              onImportCSV={() => { setMobileOpen(false); onImportCSV?.() }}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* TopBar — mobile only */}
        <div className="md:hidden">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
        </div>

        <main style={{ flex: 1, padding: '28px 32px' }}>
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <div className="md:hidden">
        <BottomNav
          onAddProperty={() => onAddProperty?.()}
          onImportCSV={() => onImportCSV?.()}
        />
      </div>
    </div>
  )
}
