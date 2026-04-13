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

function sanitizePortfolioContext(value) {
  if (!value || typeof value !== 'object') return null

  const name = String(value.name || '').trim()
  const headline = String(value.headline || '').trim()
  const status = String(value.status || '').trim()
  const about = String(value.about || '').trim()
  const currentCity = String(value.currentCity || '').trim()
  const age = Number.isFinite(Number(value.age)) ? Number(value.age) : null
  const countriesVisited = Array.isArray(value.countriesVisited)
    ? value.countriesVisited.map((item) => String(item).trim()).filter(Boolean).slice(0, 20)
    : []
  const skills = Array.isArray(value.skills)
    ? value.skills.map((item) => String(item).trim()).filter(Boolean).slice(0, 40)
    : []
  const projects = Array.isArray(value.projects)
    ? value.projects.map((item) => String(item).trim()).filter(Boolean).slice(0, 20)
    : []
  const writingFocus = Array.isArray(value.writingFocus)
    ? value.writingFocus.map((item) => String(item).trim()).filter(Boolean).slice(0, 20)
    : []

  const github = value.github && typeof value.github === 'object'
    ? {
        username: String(value.github.username || '').trim(),
        profile: String(value.github.profile || '').trim()
      }
    : null

  const contact = value.contact && typeof value.contact === 'object'
    ? {
        note: String(value.contact.note || '').trim(),
        channels: Array.isArray(value.contact.channels)
          ? value.contact.channels.map((item) => String(item).trim()).filter(Boolean).slice(0, 20)
          : []
      }
    : null

  return {
    name,
    headline,
    status,
    about,
    age,
    currentCity,
    countriesVisited,
    skills,
    projects,
    writingFocus,
    github,
    contact
  }
}

function sanitizeCapabilities(value) {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 30)
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
  const systemPrompt = process.env.OPENAI_SYSTEM_PROMPT || 'You are RN AI Chat Bot for Rushyanth Narindi\'s portfolio website. Your mission is to explain Rushyanth, his profile, skills, projects, writings, stats, and contact options with high-quality answers. Always prioritize provided portfolio context over any generic answer. If a user asks something outside Rushyanth\'s published scope, do not provide broad unrelated guidance; instead, politely suggest contacting Rushyanth via the Contact page. Keep responses clear, professional, and concise while still being informative.'

  if (!apiKey) {
    return res.status(500).json({ error: 'Server AI configuration is incomplete' })
  }

  const message = String(req.body?.message || '').trim()
  const history = sanitizeHistory(req.body?.history)
  const portfolioContext = sanitizePortfolioContext(req.body?.portfolioContext)
  const capabilities = sanitizeCapabilities(req.body?.assistantCapabilities)

  if (!message) {
    return badRequest(res, 'Message is required')
  }
  if (message.length > 2000) {
    return badRequest(res, 'Message is too long')
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    portfolioContext ? { role: 'system', content: `Portfolio context: ${JSON.stringify(portfolioContext)}` } : null,
    capabilities.length > 0 ? { role: 'system', content: `Assistant capabilities: ${capabilities.join('; ')}` } : null,
    ...history,
    { role: 'user', content: message }
  ].filter(Boolean)

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