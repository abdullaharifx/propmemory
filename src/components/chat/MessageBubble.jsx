import DraftCard from './DraftCard'

export default function MessageBubble({ message, property }) {
  const isUser = message.role === 'user'
  const data = message.role === 'assistant' && message.metadata
    ? message.metadata
    : null

  const reply = data?.reply || message.content
  const draft = data?.draft
  const tone = data?.tone
  const contextUsed = data?.context_used || []
  const suggestedActions = data?.suggested_actions || []

  if (isUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '12px',
        paddingLeft: '48px',
      }}>
        <div style={{
          maxWidth: '75%',
          backgroundColor: 'var(--color-accent)',
          color: '#fff',
          borderRadius: '14px 14px 3px 14px',
          padding: '10px 14px',
          fontSize: '14px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '16px',
      paddingRight: '48px',
    }}>
      <div style={{ maxWidth: '85%', minWidth: '200px' }}>
        {/* Context pills */}
        {contextUsed.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '5px',
            flexWrap: 'wrap',
            marginBottom: '6px',
          }}>
            {contextUsed.map(ctx => (
              <span
                key={ctx}
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: '600',
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent)',
                  textTransform: 'lowercase',
                }}
              >
                {ctx.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Bubble */}
        <div style={{
          backgroundColor: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: '3px 14px 14px 14px',
          padding: '10px 14px',
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'var(--color-text-primary)',
            whiteSpace: 'pre-wrap',
          }}>
            {reply}
          </p>

          {draft && (
            <DraftCard
              draft={draft}
              tone={tone}
              property={property}
            />
          )}
        </div>

        {/* Suggested actions */}
        {suggestedActions.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginTop: '7px',
          }}>
            {suggestedActions.map((action, i) => (
              <span
                key={i}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: 'var(--color-background-secondary)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                → {action}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
