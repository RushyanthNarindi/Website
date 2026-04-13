const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions'

function badRequest(res, message) {
  return res.status(400).json({ error: message })
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  const configured = process.env.AI_ALLOWED_ORIGINS || process.env.CONTACT_ALLOWED_ORIGINS
  if (!configured) return

  const allowedOrigins = configured
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
}

function sanitizeHistory(value) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
    .map((item) => ({
      role: item.role,
      content: String(item.content || '').trim()
    }))
    .filter((item) => item.content.length > 0 && item.content.length <= 2000)
    .slice(-12)
}

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const systemPrompt = process.env.OPENAI_SYSTEM_PROMPT || 'You are a helpful AI assistant on a personal portfolio website. Keep answers concise, practical, and friendly.'

  if (!apiKey) {
    return res.status(500).json({ error: 'Server AI configuration is incomplete' })
  }

  const message = String(req.body?.message || '').trim()
  const history = sanitizeHistory(req.body?.history)

  if (!message) {
    return badRequest(res, 'Message is required')
  }
  if (message.length > 2000) {
    return badRequest(res, 'Message is too long')
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ]

  try {
    const aiResponse = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 350
      })
    })

    if (!aiResponse.ok) {
      const providerError = await aiResponse.text()
      return res.status(502).json({ error: `AI provider error: ${providerError}` })
    }

    const payload = await aiResponse.json()
    const reply = String(payload?.choices?.[0]?.message?.content || '').trim()

    if (!reply) {
      return res.status(502).json({ error: 'AI returned an empty response' })
    }

    return res.status(200).json({ reply })
  } catch {
    return res.status(500).json({ error: 'Unexpected server error while generating reply' })
  }
}