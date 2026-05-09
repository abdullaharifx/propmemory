import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import HalabrixLogo from '../components/ui/HalabrixLogo'

const DEMO_EMAIL = 'demo@halabrix.ai'
const DEMO_PASS  = 'demo1234'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { document.title = 'Halabrix Property Manager — Sign in' }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccessMsg('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDemo() {
    setError('')
    setDemoLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: DEMO_EMAIL, password: DEMO_PASS })
      if (error) throw new Error('Demo account not set up yet. See DEMO_SETUP.md.')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setDemoLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', fontSize: '14px',
    fontFamily: 'var(--font-sans)', color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-background-secondary)',
    border: '1px solid var(--color-border-secondary)',
    borderRadius: 'var(--border-radius-md)', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
          <HalabrixLogo size={40} textSize="24px" />
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Property Manager
          </p>
        </div>

        <div style={{ marginBottom: '24px' }} />

        {/* Demo button */}
        <button
          onClick={handleDemo}
          disabled={demoLoading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '11px', marginBottom: '16px',
            fontSize: '14px', fontWeight: '500', fontFamily: 'var(--font-sans)',
            color: 'var(--color-success)', backgroundColor: 'var(--color-success-light)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--border-radius-md)',
            cursor: demoLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <Zap size={15} />
          {demoLoading ? 'Loading demo…' : 'Try demo — no sign-up required'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-primary)' }} />
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>or sign in with your account</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border-primary)' }} />
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--color-background-secondary)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--border-radius-lg)', padding: '28px 32px',
        }}>
          <h1 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 22px' }}>
            {mode === 'signin' ? 'Manage your properties with AI.' : 'Get started — it only takes a minute.'}
          </p>

          {successMsg && (
            <div style={{ backgroundColor: 'var(--color-success-light)', border: '1px solid var(--color-success)', borderRadius: 'var(--border-radius-sm)', padding: '10px 12px', marginBottom: '16px', fontSize: '13px', color: 'var(--color-success)' }}>
              {successMsg}
            </div>
          )}
          {error && (
            <div style={{ backgroundColor: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', borderRadius: 'var(--border-radius-sm)', padding: '10px 12px', marginBottom: '16px', fontSize: '13px', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Email address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" placeholder="you@example.com" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--color-accent)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--color-border-secondary)' }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '10px', fontSize: '14px', fontWeight: '500',
              fontFamily: 'var(--font-sans)', color: '#fff',
              backgroundColor: loading ? 'var(--color-accent-hover)' : 'var(--color-accent)',
              border: 'none', borderRadius: 'var(--border-radius-md)',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
            }}>
              {loading
                ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                : (mode === 'signin' ? 'Sign in' : 'Create account')}
            </button>
          </form>

          <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setSuccessMsg('') }}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: '500' }}>
              {mode === 'signin' ? 'Create account' : 'Sign in'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Powered by <a href="https://halabrix.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>halabrix.ai</a>
        </p>
      </div>
    </div>
  )
}
