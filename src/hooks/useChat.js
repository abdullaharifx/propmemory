import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { sendMessage as aiSendMessage } from '../lib/ai'

export function useChat(property) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const propertyId = property?.id

  const loadHistory = useCallback(async () => {
    if (!propertyId) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: true })
      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Failed to load chat history:', err.message)
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => { loadHistory() }, [loadHistory])

  async function sendMessage(userText) {
    if (!userText.trim() || sending) return null
    setSending(true)

    const tempId = `temp-${Date.now()}`
    const optimistic = {
      id: tempId,
      property_id: propertyId,
      role: 'user',
      content: userText,
      metadata: null,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    try {
      const { data: savedUser, error: userErr } = await supabase
        .from('chat_history')
        .insert({ property_id: propertyId, role: 'user', content: userText })
        .select()
        .single()
      if (userErr) throw userErr

      setMessages(prev => prev.map(m => m.id === tempId ? savedUser : m))

      // Build history for AI from persisted messages (excludes the message just sent)
      const historyForAI = messages.map(m => ({
        role: m.role,
        content: m.role === 'assistant' ? (m.metadata?.reply || m.content) : m.content,
      }))

      const aiResponse = await aiSendMessage(property, historyForAI, userText)

      const { data: savedAI, error: aiErr } = await supabase
        .from('chat_history')
        .insert({
          property_id: propertyId,
          role: 'assistant',
          content: aiResponse.reply || '',
          metadata: aiResponse,
        })
        .select()
        .single()
      if (aiErr) throw aiErr

      setMessages(prev => [...prev, savedAI])

      if (aiResponse.log) {
        await supabase.from('activity_log').insert({
          property_id: propertyId,
          type: 'system',
          description: aiResponse.log,
        })
      }

      return aiResponse
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tempId))
      throw err
    } finally {
      setSending(false)
    }
  }

  async function logDraftSent(draft, tone) {
    if (!propertyId) return
    await supabase.from('activity_log').insert({
      property_id: propertyId,
      type: 'message_sent',
      description: `Draft approved: "${draft.substring(0, 80)}${draft.length > 80 ? '…' : ''}"`,
      metadata: { draft, tone },
    })
  }

  return { messages, loading, sending, sendMessage, logDraftSent }
}
