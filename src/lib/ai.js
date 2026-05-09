import Groq from 'groq-sdk'
import { buildSystemPrompt } from '../prompts/systemPrompt'
import { buildImportPrompt } from '../prompts/importPrompt'
import { buildInsightsPrompt } from '../prompts/insightsPrompt'

const apiKey = import.meta.env.VITE_GROQ_API_KEY || ''

const client = apiKey
  ? new Groq({ apiKey, dangerouslyAllowBrowser: true })
  : null

const MODEL = 'llama-3.3-70b-versatile'

function getClient() {
  if (!client) throw new Error('Missing VITE_GROQ_API_KEY — add it to your .env.local and redeploy.')
  return client
}

// Robustly extract JSON even if the model prefixes it with text
function parseJSON(raw) {
  const cleaned = raw.replace(/```json|```/g, '').trim()

  // Try direct parse first
  try { return JSON.parse(cleaned) } catch {}

  // Extract the first {...} block from mixed text
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch {}
  }

  // Last resort — wrap the raw text as a plain reply
  return { reply: cleaned, context_used: [] }
}

export async function sendMessage(property, conversationHistory, userMessage) {
  const messages = [
    { role: 'system', content: buildSystemPrompt(property) },
    ...conversationHistory.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.role === 'assistant' ? (m.metadata?.reply || m.content) : m.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 1024,
    temperature: 0.3,
    response_format: { type: 'json_object' }, // forces pure JSON output
  })

  return parseJSON(completion.choices[0].message.content)
}

export async function importCSV(csvText) {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: buildImportPrompt(csvText) }],
    max_tokens: 2048,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })
  const raw = completion.choices[0].message.content
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    throw new Error('Failed to parse import response — try again')
  }
}

export async function getInsights(property) {
  try {
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: buildInsightsPrompt(property) }],
      max_tokens: 512,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    })
    return parseJSON(completion.choices[0].message.content)
  } catch {
    return { insights: [] }
  }
}
