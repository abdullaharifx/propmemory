import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const PROPERTY_SELECT = `
  *,
  payment_history (id, month, year, status, amount_paid, date_paid, notes, created_at),
  maintenance_log (id, title, description, status, type, contractor, cost, logged_date, resolved_date, created_at),
  activity_log    (id, type, description, metadata, created_at)
`

const PROPERTY_FULL_SELECT = `
  *,
  payment_history (*),
  maintenance_log (*),
  activity_log    (*),
  chat_history    (*)
`

function sortRelated(property) {
  return {
    ...property,
    payment_history: (property.payment_history || [])
      .sort((a, b) => b.year - a.year || b.month - a.month)
      .slice(0, 5),
    maintenance_log: (property.maintenance_log || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10),
    activity_log: (property.activity_log || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5),
  }
}

export function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error: qErr } = await supabase
        .from('properties')
        .select(PROPERTY_SELECT)
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false })

      if (qErr) throw qErr
      setProperties((data || []).map(sortRelated))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { properties, loading, error, refetch: fetch }
}

export function useProperty(id) {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: qErr } = await supabase
        .from('properties')
        .select(PROPERTY_FULL_SELECT)
        .eq('id', id)
        .single()

      if (qErr) throw qErr

      setProperty({
        ...data,
        payment_history: (data.payment_history || [])
          .sort((a, b) => b.year - a.year || b.month - a.month),
        maintenance_log: (data.maintenance_log || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        activity_log: (data.activity_log || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        chat_history: (data.chat_history || [])
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { property, loading, error, refetch: fetch }
}

export function useCreateProperty() {
  const [loading, setLoading] = useState(false)

  async function createProperty(fields) {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('properties')
        .insert({ ...fields, landlord_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }

  return { createProperty, loading }
}

export function useUpdateProperty() {
  const [loading, setLoading] = useState(false)

  async function updateProperty(id, fields) {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(fields)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    } finally {
      setLoading(false)
    }
  }

  return { updateProperty, loading }
}
