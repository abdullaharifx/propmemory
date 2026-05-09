import { Menu, Building2 } from 'lucide-react'

export default function TopBar({ onMenuClick }) {
  return (
    <div style={{
      height: '56px',
      backgroundColor: 'var(--color-background-primary)',
      borderBottom: '1px solid var(--color-border-primary)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      <button
        onClick={onMenuClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: 'var(--border-radius-sm)',
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Menu size={20} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--border-radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Building2 size={15} color="#fff" />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          PropMemory
        </span>
      </div>
    </div>
  )
}
