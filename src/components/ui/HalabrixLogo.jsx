export default function HalabrixLogo({ size = 28, textSize = '15px', showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      {/* Logo mark — three connected nodes representing Halabrix */}
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8"  cy="20" r="5.5" fill="#8B5CF6" opacity="0.9"/>
        <circle cx="24" cy="20" r="5.5" fill="#8B5CF6" opacity="0.7"/>
        <circle cx="16" cy="10" r="5.5" fill="#8B5CF6"/>
        <line x1="11" y1="16" x2="13" y2="14" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5"/>
        <line x1="21" y1="16" x2="19" y2="14" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5"/>
        <line x1="11" y1="21" x2="21" y2="21" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.4"/>
      </svg>
      {showText && (
        <span style={{
          fontSize: textSize,
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.2px',
        }}>
          halabrix
        </span>
      )}
    </div>
  )
}
