import { Menu } from 'lucide-react'
import HalabrixLogo from '../ui/HalabrixLogo'

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
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px', borderRadius: 'var(--border-radius-sm)',
          color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center',
        }}
      >
        <Menu size={20} />
      </button>
      <HalabrixLogo size={24} textSize="15px" />
    </div>
  )
}
