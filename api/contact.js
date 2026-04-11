const RESEND_API_URL = 'https://api.resend.com/emails'

function badRequest(res, message) {
  return res.status(400).json({ error: message })
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  const configured = process.env.CONTACT_ALLOWED_ORIGINS
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

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
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

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.PORTFOLIO_FROM_EMAIL
  const to = process.env.PORTFOLIO_TO_EMAIL

  if (!apiKey || !from || !to) {
    return res.status(500).json({ error: 'Server email configuration is incomplete' })
  }

  const { name, email, message, website } = req.body || {}

  // Honeypot spam trap: bots filling hidden fields are rejected silently.
  if (website) {
    return res.status(200).json({ ok: true })
  }

  const safeName = String(name || '').trim()
  const safeEmail = String(email || '').trim()
  const safeMessage = String(message || '').trim()

  if (!safeName || safeName.length < 2) {
    return badRequest(res, 'Please enter a valid name')
  }
  if (safeName.length > 120) {
    return badRequest(res, 'Name is too long')
  }
  if (!safeEmail || !/^\S+@\S+\.\S+$/.test(safeEmail)) {
    return badRequest(res, 'Please enter a valid email address')
  }
  if (safeEmail.length > 200) {
    return badRequest(res, 'Email is too long')
  }
  if (!safeMessage || safeMessage.length < 10) {
    return badRequest(res, 'Message must be at least 10 characters')
  }
  if (safeMessage.length > 5000) {
    return badRequest(res, 'Message is too long')
  }

  const safeNameHtml = escapeHtml(safeName)
  const safeEmailHtml = escapeHtml(safeEmail)
  const safeMessageHtml = escapeHtml(safeMessage).replace(/\n/g, '<br/>')

  const emailPayload = {
    from,
    to: [to],
    reply_to: safeEmail,
    subject: `Portfolio contact from ${safeName}`,
    text: [
      `Name: ${safeName}`,
      `Email: ${safeEmail}`,
      '',
      'Message:',
      safeMessage
    ].join('\n'),
    html: `
      <h2>New portfolio contact</h2>
      <p><strong>Name:</strong> ${safeNameHtml}</p>
      <p><strong>Email:</strong> ${safeEmailHtml}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessageHtml}</p>
    `
  }

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    })

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text()
      return res.status(502).json({ error: `Email provider error: ${resendError}` })
    }

    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Unexpected server error while sending email' })
  }
}
