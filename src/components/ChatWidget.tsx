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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = input.trim()
    if (!value || isSending) return

    const userMessage: ChatMessage = { role: 'user', content: value }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setError('')
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
        const apiMessage = data?.error || `Request failed with status ${response.status}`
        throw new Error(apiMessage)
      }

      const data = await response.json()
      const reply = String(data?.reply || '').trim()

      if (!reply) {
        throw new Error('Empty reply from AI')
      }

      setMessages((current) => [...current, { role: 'assistant', content: reply }])
    } catch (sendError) {
      const reason = sendError instanceof Error ? sendError.message : 'Unknown error'
      setError(`Could not get a response. ${reason}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="chat-widget-shell">
      {isOpen && (
        <section id="chat-widget-panel" className="chat-widget-panel" aria-label="AI chat assistant">
          <header className="chat-widget-header">
            <h2>AI Chat</h2>
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
        </section>
      )}

      <button
        type="button"
        className="chat-widget-trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
      >
        {isOpen ? 'Close Chat' : 'AI Chat'}
      </button>
    </div>
  )
}