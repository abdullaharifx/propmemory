import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildSystemPrompt } from '../prompts/systemPrompt'
import { buildImportPrompt } from '../prompts/importPrompt'
import { buildInsightsPrompt } from '../prompts/insightsPrompt'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

function getModel(maxTokens = 1024) {
  if (!genAI) throw new Error('Missing VITE_GEMINI_API_KEY — add it to your Vercel environment variables and redeploy.')
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.3 }
  })
}

function parseJSON(raw) {
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    return { reply: raw, context_used: [] }
  }
}

export async function sendMessage(property, conversationHistory, userMessage) {
  const systemPrompt = buildSystemPrompt(property)
  const model = getModel(1024)

  const historyText = conversationHistory
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => `${m.role === 'user' ? 'Landlord' : 'PropMemory'}: ${m.content}`)
    .join('\n\n')

  const fullPrompt = `${systemPrompt}\n\n${historyText ? `CONVERSATION SO FAR:\n${historyText}\n\n` : ''}Landlord: ${userMessage}\nPropMemory:`

  const result = await model.generateContent(fullPrompt)
  return parseJSON(result.response.text())
}

export async function importCSV(csvText) {
  const result = await getModel(2048).generateContent(buildImportPrompt(csvText))
  const raw = result.response.text()
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    throw new Error('Failed to parse import response — try again')
  }
}

export async function getInsights(property) {
  try {
    const result = await getModel(512).generateContent(buildInsightsPrompt(property))
    const raw = result.response.text()
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    return { insights: [] }
  }
}
