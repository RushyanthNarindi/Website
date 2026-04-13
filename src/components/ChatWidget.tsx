import React, { useEffect, useMemo, useRef, useState } from 'react'

type Role = 'user' | 'assistant'

type ChatMessage = {
  role: Role
  content: string
}

const assistantCapabilities = [
  'Portfolio Q&A across all pages (scope-first)',
  'Detailed personal/professional profile answers about Rushyanth',
  'Out-of-scope guidance with Contact page suggestion',
  'Quick math with prompts like: calculate 25 * (14 + 6)',
  'Short summarization with prompts like: summarize: <text>',
  'Text rewriting with prompts like: rewrite professionally: <text>'
]

const portfolioContext = {
  name: 'Rushyanth Narindi',
  headline: 'I build things on the web.',
  status: 'Portfolio website under construction with ongoing updates.',
  about:
    'Technology-focused professional with a passion for IT, practical problem solving, and building useful web and automation solutions.',
  currentCity: 'Dallas, TX',
  age: 26,
  countriesVisited: ['USA', 'India', 'Abu Dhabi'],
  skills: ['React', 'TypeScript', 'Vite', 'Python', 'SQL', 'Pandas', 'Git', 'Shell Scripting'],
  projects: ['Personal Portfolio Website', 'Data and Automation Toolkit'],
  writingFocus: ['Technical write-ups', 'Case studies', 'Computing trends'],
  github: {
    username: 'RushyanthNarindi',
    profile: 'https://github.com/RushyanthNarindi'
  },
  contact: {
    note: 'Usually responds within 24 hours.',
    channels: ['Contact page form', 'GitHub profile', 'Email']
  }
}

const scopeKnowledge: Array<{ tags: string[]; answer: string }> = [
  {
    tags: ['name', 'who are you', 'who is rushyanth'],
    answer: `${portfolioContext.name} is the owner of this portfolio website.`
  },
  {
    tags: ['what do you do', 'work', 'scope', 'services', 'offer'],
    answer:
      'Rushyanth focuses on web development, portfolio/product UI work, and data/automation workflows using tools like React, TypeScript, Python, SQL, and scripting.'
  },
  {
    tags: ['about', 'background', 'experience', 'it'],
    answer: portfolioContext.about
  },
  {
    tags: ['age', 'old'],
    answer: `Rushyanth is ${portfolioContext.age} years old.`
  },
  {
    tags: ['city', 'location', 'live', 'based'],
    answer: `${portfolioContext.name} is currently based in ${portfolioContext.currentCity}.`
  },
  {
    tags: ['country', 'travel', 'visited'],
    answer: `Countries visited include ${portfolioContext.countriesVisited.join(', ')}.`
  },
  {
    tags: ['skill', 'tech stack', 'technology', 'tools'],
    answer: `Core skills include ${portfolioContext.skills.join(', ')}.`
  },
  {
    tags: ['project', 'built', 'portfolio website', 'automation toolkit'],
    answer: `Highlighted projects include ${portfolioContext.projects.join(' and ')}.`
  },
  {
    tags: ['writing', 'blog', 'article'],
    answer: `Writings focus includes ${portfolioContext.writingFocus.join(', ')}.`
  },
  {
    tags: ['github', 'repo', 'repository'],
    answer: `GitHub username is ${portfolioContext.github.username}. Profile: ${portfolioContext.github.profile}`
  },
  {
    tags: ['contact', 'email', 'reach out', 'hire', 'message'],
    answer: 'Use the Contact page form to reach Rushyanth directly. Response time is usually within 24 hours.'
  }
]

const starterMessage: ChatMessage = {
  role: 'assistant',
  content: 'Hi, I am RN AI Chat Bot. I am here to answer questions about Rushyanth. Ask What can you do? to see my capabilities.'
}

function buildCapabilitiesReply(): string {
  return `I can help with:\n- ${assistantCapabilities.join('\n- ')}\n\nI focus on Rushyanth-specific questions. For anything outside that scope, please reach out through the Contact page.`
}

function tryGreeting(prompt: string): string | null {
  const text = prompt.toLowerCase().trim()
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
  const thanks = ['thanks', 'thank you', 'thx']

  if (greetings.includes(text)) {
    return 'Hello. I am RN AI Chat Bot. I can explain Rushyanth\'s profile, projects, skills, and contact options. You can also ask What can you do?'
  }

  if (thanks.includes(text)) {
    return 'You are welcome. If you want, ask about Rushyanth\'s projects, skills, writings, stats, or contact info.'
  }

  return null
}

function tryDirectArithmetic(prompt: string): string | null {
  const expression = prompt.trim()
  if (!expression) return null

  if (!/^[0-9+\-*/().%\s]+$/.test(expression)) return null
  if (!/[+\-*/%]/.test(expression)) return null
  if (expression.length > 80) return 'Please keep arithmetic expressions short.'

  try {
    const result = Function(`"use strict"; return (${expression});`)()
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return 'I could not compute that expression safely.'
    }
    return `Result: ${result}`
  } catch {
    return 'That arithmetic expression looks invalid. Please try again.'
  }
}

function tryCalculate(prompt: string): string | null {
  const lower = prompt.toLowerCase()
  if (!lower.startsWith('calculate ')) return null

  const expression = prompt.slice(10).trim()
  if (!expression) return 'Please provide an expression, for example: calculate 12 * (4 + 3).'
  if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
    return 'I can only calculate basic arithmetic expressions using numbers and + - * / % ( ).'
  }

  try {
    const result = Function(`"use strict"; return (${expression});`)()
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return 'I could not compute that expression safely.'
    }
    return `Result: ${result}`
  } catch {
    return 'That expression looks invalid. Please try a valid arithmetic expression.'
  }
}

function trySummarize(prompt: string): string | null {
  const lower = prompt.toLowerCase()
  const marker = lower.startsWith('summarize:') || lower.startsWith('summarise:')
  if (!marker) return null

  const text = prompt.split(':').slice(1).join(':').trim()
  if (!text) return 'Please provide text after summarize: so I can create a short summary.'

  const compact = text.replace(/\s+/g, ' ').trim()
  if (compact.length <= 180) return `Summary: ${compact}`
  return `Summary: ${compact.slice(0, 180).trimEnd()}...`
}

function tryRewrite(prompt: string): string | null {
  const lower = prompt.toLowerCase()
  const marker = lower.startsWith('rewrite professionally:')
  if (!marker) return null

  const text = prompt.split(':').slice(1).join(':').trim()
  if (!text) return 'Please provide text after rewrite professionally: so I can rewrite it.'

  return `Professional rewrite:\n${text.charAt(0).toUpperCase()}${text.slice(1).replace(/\s+/g, ' ').trim()}`
}

function tryLocalCapabilityReply(prompt: string): string | null {
  const text = prompt.toLowerCase().trim()

  if (
    text.includes('what can you do') ||
    text.includes('capabilities') ||
    text === 'help' ||
    text === 'ai help'
  ) {
    return buildCapabilitiesReply()
  }

  return (
    tryGreeting(prompt) ||
    tryDirectArithmetic(prompt) ||
    tryCalculate(prompt) ||
    trySummarize(prompt) ||
    tryRewrite(prompt)
  )
}

function buildLocalFallbackReply(prompt: string): string {
  const text = prompt.toLowerCase()

  const matched = scopeKnowledge.find((item) =>
    item.tags.some((tag) => text.includes(tag))
  )

  if (matched) return matched.answer

  return 'I focus on Rushyanth-specific questions only. Please ask about profile, projects, skills, writings, stats, GitHub, or contact details.'
}

function buildScopeFirstReply(prompt: string): string | null {
  const reply = buildLocalFallbackReply(prompt)
  if (reply.includes('Rushyanth-specific questions only')) return null
  return reply
}

function buildReachOutSuggestion(): string {
  return 'That request appears outside Rushyanth\'s published scope. Please use the Contact page to discuss it directly with Rushyanth.'
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 16, y: 16 })
  const [dragState, setDragState] = useState<{
    pointerId: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const draggedRef = useRef(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat'

  const history = useMemo(
    () => messages.filter((item) => item !== starterMessage).slice(-12),
    [messages]
  )

  useEffect(() => {
    if (!messagesRef.current) return
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages, isSending])

  useEffect(() => {
    const widget = widgetRef.current
    if (!widget) return

    const margin = 16
    const nextX = Math.max(margin, window.innerWidth - widget.offsetWidth - margin)
    const nextY = Math.max(margin, window.innerHeight - widget.offsetHeight - margin)
    setPosition({ x: nextX, y: nextY })
  }, [])

  useEffect(() => {
    const widget = widgetRef.current
    if (!widget) return

    const margin = 10
    const maxX = Math.max(margin, window.innerWidth - widget.offsetWidth - margin)
    const maxY = Math.max(margin, window.innerHeight - widget.offsetHeight - margin)

    setPosition((current) => ({
      x: Math.min(Math.max(current.x, margin), maxX),
      y: Math.min(Math.max(current.y, margin), maxY)
    }))
  }, [isOpen])

  useEffect(() => {
    if (!dragState) return
    const activeDrag = dragState

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerId !== activeDrag.pointerId || !widgetRef.current) return

      const margin = 10
      const nextX = event.clientX - activeDrag.offsetX
      const nextY = event.clientY - activeDrag.offsetY
      const maxX = Math.max(margin, window.innerWidth - widgetRef.current.offsetWidth - margin)
      const maxY = Math.max(margin, window.innerHeight - widgetRef.current.offsetHeight - margin)

      draggedRef.current = true
      setPosition({
        x: Math.min(Math.max(nextX, margin), maxX),
        y: Math.min(Math.max(nextY, margin), maxY)
      })
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId !== activeDrag.pointerId) return
      setDragState(null)
      window.setTimeout(() => {
        draggedRef.current = false
      }, 0)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragState])

  function startDrag(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (!widgetRef.current) return

    const rect = widgetRef.current.getBoundingClientRect()
    setDragState({
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top
    })
  }

  function toggleWidget() {
    if (draggedRef.current) return
    setIsOpen((current) => !current)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = input.trim()
    if (!value || isSending) return

    const userMessage: ChatMessage = { role: 'user', content: value }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
    setNotice('')

    const localCapabilityReply = tryLocalCapabilityReply(value)
    if (localCapabilityReply) {
      setMessages((current) => [...current, { role: 'assistant', content: localCapabilityReply }])
      setNotice('Handled with built-in assistant capabilities.')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          message: value,
          history,
          portfolioContext,
          assistantCapabilities
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const status = response.status
        const usingRelativeEndpoint = endpoint.startsWith('/')

        if (usingRelativeEndpoint && (status === 404 || status === 405)) {
          const scopeReply = buildScopeFirstReply(value)
          const finalReply = scopeReply || buildReachOutSuggestion()

          setMessages((current) => [
            ...current,
            {
              role: 'assistant',
              content: finalReply
            }
          ])
          setNotice('Live AI backend is not connected on this host. RN AI Chat Bot is running in profile-only fallback mode.')
          return
        }

        const apiMessage = data?.error || `Request failed with status ${status}`
        throw new Error(apiMessage)
      }

      const data = await response.json()
      const reply = String(data?.reply || '').trim()

      if (!reply) {
        throw new Error('Empty reply from AI')
      }

      setMessages((current) => [...current, { role: 'assistant', content: reply }])
    } catch (sendError) {
      if (endpoint.startsWith('/')) {
        const scopeReply = buildScopeFirstReply(value)
        const finalReply = scopeReply || buildReachOutSuggestion()

        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            content: finalReply
          }
        ])
        setNotice('Live AI backend is unreachable. RN AI Chat Bot is running in profile-only fallback mode.')
        return
      }

      const reason = sendError instanceof Error ? sendError.message : 'Unknown error'
      setError(`Could not get a response. ${reason}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      ref={widgetRef}
      className="chat-widget-shell"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {isOpen && (
        <section id="chat-widget-panel" className="chat-widget-panel" aria-label="RN AI Chat Bot assistant">
          <header className="chat-widget-header chat-widget-drag-handle" onPointerDown={startDrag}>
            <h2>
              <span className="chat-widget-avatar" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M9 3h6v2h2a3 3 0 013 3v6a3 3 0 01-3 3h-2v2h-6v-2H7a3 3 0 01-3-3V8a3 3 0 013-3h2V3zm-2 4a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H7zm2 3a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </span>
              RN AI Chat Bot
            </h2>
            <button
              type="button"
              className="chat-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chat-widget-messages" role="log" aria-live="polite" ref={messagesRef}>
            {messages.map((item, index) => (
              <article
                key={`${item.role}-${index}`}
                className={`chat-widget-message ${item.role === 'assistant' ? 'is-assistant' : 'is-user'}`}
              >
                <p className="chat-widget-message-role">{item.role === 'assistant' ? 'AI' : 'You'}</p>
                <p className="chat-widget-message-text">{item.content}</p>
              </article>
            ))}
            {isSending && (
              <article className="chat-widget-message is-assistant">
                <p className="chat-widget-message-role">AI</p>
                <p className="chat-widget-message-text">Thinking...</p>
              </article>
            )}
          </div>

          <form className="chat-widget-form" onSubmit={handleSubmit}>
            <textarea
              className="chat-widget-input"
              name="prompt"
              rows={2}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask me about Rushyanth..."
              maxLength={2000}
              required
            />
            <button className="chat-widget-submit" type="submit" disabled={isSending || !input.trim()}>
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>

          {error && (
            <p className="chat-widget-error" role="status">
              {error}
            </p>
          )}

          {notice && !error && (
            <p className="chat-widget-note" role="status">
              {notice}
            </p>
          )}
        </section>
      )}

      <button
        type="button"
        className="chat-widget-trigger chat-widget-drag-handle"
        onPointerDown={startDrag}
        onClick={toggleWidget}
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
      >
        <span className="chat-widget-avatar" aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M9 3h6v2h2a3 3 0 013 3v6a3 3 0 01-3 3h-2v2h-6v-2H7a3 3 0 01-3-3V8a3 3 0 013-3h2V3zm-2 4a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H7zm2 3a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </span>
        {isOpen ? 'Close Chat' : 'RN AI Chat Bot'}
      </button>
    </div>
  )
}