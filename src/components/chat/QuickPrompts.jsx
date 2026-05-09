import { QUICK_PROMPTS } from '../../constants'

export default function QuickPrompts({ onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '7px',
      flexWrap: 'wrap',
      padding: '0 16px 12px',
    }}>
      {QUICK_PROMPTS.map(prompt => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          style={{
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-accent)',
            backgroundColor: 'var(--color-accent-light)',
            border: '1px solid transparent',
            borderRadius: '999px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background-color 0.12s, border-color 0.12s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
