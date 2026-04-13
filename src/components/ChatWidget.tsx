import React, { useEffect, useMemo, useRef, useState } from 'react'

type Role = 'user' | 'assistant'

type ChatMessage = {
  role: Role
  content: string
}

const starterMessage: ChatMessage = {
  role: 'assistant',
  content: 'Hi, I am your portfolio AI assistant. Ask me anything.'
}

function buildLocalFallbackReply(prompt: string): string {
  const text = prompt.toLowerCase()

  if (text.includes('age') || text.includes('old')) {
    return 'Rushyanth is 26 years old.'
  }

  if (text.includes('city') || text.includes('live') || text.includes('location')) {
    return 'Rushyanth is currently based in Dallas, TX.'
  }

  if (text.includes('country') || text.includes('travel') || text.includes('visited')) {
    return 'Countries visited include USA, India, and Abu Dhabi.'
  }

  if (text.includes('contact') || text.includes('email')) {
    return 'You can use the Contact page on this website to reach Rushyanth.'
  }

  if (text.includes('resume') || text.includes('experience') || text.includes('skills')) {
    return 'Please check the Resume and About pages for experience, projects, and skills.'
  }

  return 'I am running in local assistant mode right now. Ask me about profile basics like location, age, countries visited, projects, and contact info.'
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
          history
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const status = response.status
        const usingRelativeEndpoint = endpoint.startsWith('/')

        if (usingRelativeEndpoint && (status === 404 || status === 405)) {
          setMessages((current) => [
            ...current,
            { role: 'assistant', content: buildLocalFallbackReply(value) }
          ])
          setNotice('Live AI backend is not connected on this host. Showing local assistant replies.')
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
        setMessages((current) => [
          ...current,
          { role: 'assistant', content: buildLocalFallbackReply(value) }
        ])
        setNotice('Live AI backend is unreachable. Showing local assistant replies.')
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
        <section id="chat-widget-panel" className="chat-widget-panel" aria-label="AI chat assistant">
          <header className="chat-widget-header chat-widget-drag-handle" onPointerDown={startDrag}>
            <h2>
              <span className="chat-widget-avatar" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M9 3h6v2h2a3 3 0 013 3v6a3 3 0 01-3 3h-2v2h-6v-2H7a3 3 0 01-3-3V8a3 3 0 013-3h2V3zm-2 4a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H7zm2 3a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </span>
              AI Chat
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
        {isOpen ? 'Close Chat' : 'AI Chat'}
      </button>
    </div>
  )
}