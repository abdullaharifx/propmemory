import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildSystemPrompt } from '../prompts/systemPrompt'
import { buildImportPrompt } from '../prompts/importPrompt'
import { buildInsightsPrompt } from '../prompts/insightsPrompt'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  throw new Error('Missing VITE_GEMINI_API_KEY in .env.local')
}

const genAI = new GoogleGenerativeAI(apiKey)

function getModel(maxTokens = 1024) {
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3,
    }
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

  const fullPrompt = `${systemPrompt}

${historyText ? `CONVERSATION SO FAR:\n${historyText}\n\n` : ''}Landlord: ${userMessage}
PropMemory:`

  const result = await model.generateContent(fullPrompt)
  const raw = result.response.text()
  return parseJSON(raw)
}

export async function importCSV(csvText) {
  const model = getModel(2048)
  const prompt = buildImportPrompt(csvText)
  const result = await model.generateContent(prompt)
  const raw = result.response.text()
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    throw new Error('Failed to parse import response — try again')
  }
}

export async function getInsights(property) {
  const model = getModel(512)
  const prompt = buildInsightsPrompt(property)
  const result = await model.generateContent(prompt)
  const raw = result.response.text()
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    return { insights: [] }
  }
}
