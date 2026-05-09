import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Property from './pages/Property'
import Onboarding from './pages/Onboarding'

function ProtectedRoute({ session, children }) {
  if (session === undefined) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text-secondary)',
        fontSize: '14px',
      }}>
        Loading…
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isLoading = session === undefined

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoading ? null : session
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute session={session}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id"
        element={
          <ProtectedRoute session={session}>
            <Property />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute session={session}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          isLoading ? null : session
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
