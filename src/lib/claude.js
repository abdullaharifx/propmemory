import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildSystemPrompt } from '../prompts/systemPrompt'
import { buildImportPrompt } from '../prompts/importPrompt'
import { buildInsightsPrompt } from '../prompts/insightsPrompt'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

function parseJSON(raw) {
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim())
  } catch {
    return null
  }
}

export async function sendMessage(property, conversationHistory, userMessage) {
  const systemPrompt = buildSystemPrompt(property)

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  const history = conversationHistory.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: 1024 },
  })

  const result = await chat.sendMessage(userMessage)
  const raw = result.response.text()

  return parseJSON(raw) ?? { reply: raw, context_used: [] }
}

export async function importCSV(csvText) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { maxOutputTokens: 2048 },
  })

  const result = await model.generateContent(buildImportPrompt(csvText))
  const raw = result.response.text()

  const parsed = parseJSON(raw)
  if (!parsed) throw new Error('Failed to parse import response')
  return parsed
}

export async function getInsights(property) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: { maxOutputTokens: 512 },
  })

  const result = await model.generateContent(buildInsightsPrompt(property))
  const raw = result.response.text()

  return parseJSON(raw) ?? { insights: [] }
}
