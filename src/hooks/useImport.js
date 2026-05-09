import { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '../lib/supabase'
import { importCSV } from '../lib/ai'

export function useImport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function parseCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          // Re-serialise through Papa to normalise encoding / line endings
          resolve(Papa.unparse(results.data))
        },
        error: (err) => reject(new Error(err.message)),
      })
    })
  }

  async function importProperties(csvText) {
    setLoading(true)
    setError(null)
    try {
      const result = await importCSV(csvText)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function saveImportedProperties(properties) {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const rows = properties.map(p => ({
        landlord_id:          user.id,
        address:              p.address,
        unit_identifier:      p.unit_identifier      ?? null,
        tenant_name:          p.tenant_name          ?? null,
        tenant_email:         p.tenant_email         ?? null,
        rent_amount:          p.rent_amount          != null ? Number(p.rent_amount)          : null,
        rent_currency:        p.rent_currency        || 'GBP',
        lease_start:          p.lease_start          ?? null,
        lease_end:            p.lease_end            ?? null,
        deposit:              p.deposit              != null ? Number(p.deposit)              : null,
        notice_period_months: p.notice_period_months != null ? Number(p.notice_period_months) : 1,
        pets_allowed:         p.pets_allowed         ?? 'No',
        parking:              p.parking              ?? 'No',
        landlord_notes:       p.landlord_notes       ?? null,
        status:               'active',
      }))

      const { data, error } = await supabase.from('properties').insert(rows).select()
      if (error) throw error
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { parseCSV, importProperties, saveImportedProperties, loading, error }
}
