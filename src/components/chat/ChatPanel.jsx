import { useState, useEffect, useRef } from 'react'
import { Send, AlertCircle, RefreshCw } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import MessageBubble from './MessageBubble'
import InsightsBar from './InsightsBar'
import QuickPrompts from './QuickPrompts'
import { MessageSkeleton } from '../ui/Skeleton'
import toast from 'react-hot-toast'

const STARTER_PROMPTS = [
  'Draft a rent reminder',
  'When does the lease end?',
  'Summarise this tenant\'s payment history',
]

export default function ChatPanel({ property }) {
  const { messages, loading, sending, sendMessage } = useChat(property)
  const [input, setInput] = useState('')
  const [aiError, setAiError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  function handlePromptSelect(prompt) {
    setInput(prompt)
    inputRef.current?.focus()
  }

  async function handleSend(text) {
    const msg = (text || input).trim()
    if (!msg || sending) return
    setInput('')
    setAiError(null)
    try {
      await sendMessage(msg)
    } catch (err) {
      const msg = err.message || 'AI unavailable'
      if (msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('401')) {
        setAiError('api_key')
      } else {
        setAiError('general')
        toast.error('AI unavailable — try again')
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const missingApiKey = !import.meta.env.VITE_GEMINI_API_KEY

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 160px)',
      minHeight: '480px',
      backgroundColor: 'var(--color-background-primary)',
      border: '1px solid var(--color-border-primary)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes pm-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* Setup required banner */}
      {missingApiKey && (
        <div style={{ padding: '10px 16px', backgroundColor: 'var(--color-warning-light)', borderBottom: '1px solid var(--color-warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={14} color="var(--color-warning)" />
          <span style={{ fontSize: '13px', color: 'var(--color-warning)', fontWeight: '500' }}>
            Setup required — add VITE_GEMINI_API_KEY to .env.local to enable AI.
          </span>
        </div>
      )}

      {/* AI error banner */}
      {aiError === 'api_key' && (
        <div style={{ padding: '10px 16px', backgroundColor: 'var(--color-danger-light)', borderBottom: '1px solid var(--color-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={14} color="var(--color-danger)" />
          <span style={{ fontSize: '13px', color: 'var(--color-danger)', fontWeight: '500' }}>
            Invalid API key — check VITE_GEMINI_API_KEY in .env.local
          </span>
        </div>
      )}

      <InsightsBar property={property} onPromptSelect={handlePromptSelect} />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {loading ? (
          <MessageSkeleton />
        ) : messages.length === 0 ? (
          /* Empty state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', textAlign: 'center', padding: '0 24px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-accent-light)', borderRadius: 'var(--border-radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Send size={20} color="var(--color-accent)" strokeWidth={1.5} />
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
              Ask me anything about {property.tenant_name || 'this property'}
            </p>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              I know the full history. Try one of these:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
              {STARTER_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  style={{
                    padding: '10px 16px', fontSize: '13px', fontWeight: '500',
                    fontFamily: 'var(--font-sans)', color: 'var(--color-accent)',
                    backgroundColor: 'var(--color-accent-light)', border: 'none',
                    borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
                    textAlign: 'left', minHeight: '44px',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => <MessageBubble key={msg.id} message={msg} property={property} />)
        )}

        {/* Typing indicator */}
        {sending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px', paddingRight: '48px' }}>
            <div style={{ backgroundColor: 'var(--color-background-primary)', border: '1px solid var(--color-border-primary)', borderRadius: '3px 14px 14px 14px', padding: '12px 16px', display: 'flex', gap: '5px', alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-text-secondary)', animation: 'pm-bounce 1.3s infinite ease-in-out', animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Retry after general error */}
        {aiError === 'general' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <button
              onClick={() => { setAiError(null); handleSend(input || 'Try again') }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-light)', border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer' }}
            >
              <RefreshCw size={13} /> AI unavailable — retry
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts + input */}
      <div style={{ borderTop: '1px solid var(--color-border-primary)' }}>
        <QuickPrompts onSelect={handlePromptSelect} />
        <div style={{ display: 'flex', gap: '8px', padding: '0 12px 12px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this property or tenant…"
            rows={1}
            style={{
              flex: 1, padding: '10px 12px', fontSize: '14px',
              fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border-secondary)',
              borderRadius: 'var(--border-radius-md)', outline: 'none',
              resize: 'none', lineHeight: '1.5', maxHeight: '120px',
              overflowY: 'auto', boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            style={{
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: !input.trim() || sending ? 'var(--color-border-secondary)' : 'var(--color-accent)',
              color: '#fff', border: 'none', borderRadius: 'var(--border-radius-md)',
              cursor: !input.trim() || sending ? 'not-allowed' : 'pointer',
              flexShrink: 0, transition: 'background-color 0.12s',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
