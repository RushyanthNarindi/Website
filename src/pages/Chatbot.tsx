import React, { useMemo, useState } from 'react'

type Role = 'user' | 'assistant'

type ChatMessage = {
  role: Role
  content: string
}

const starterMessage: ChatMessage = {
  role: 'assistant',
  content: 'Hi, I am your portfolio AI assistant. Ask me anything.'
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat'

  const history = useMemo(
    () => messages.filter((item) => item !== starterMessage).slice(-12),
    [messages]
  )

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
    <section className="chatbot-screen">
      <div className="container chatbot-wrap">
        <h1>AI Chatbot</h1>
        <p className="chatbot-subtitle">Ask questions about my work, skills, and projects.</p>

        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((item, index) => (
            <article
              key={`${item.role}-${index}`}
              className={`chatbot-message ${item.role === 'assistant' ? 'is-assistant' : 'is-user'}`}
            >
              <p className="chatbot-message-role">{item.role === 'assistant' ? 'AI' : 'You'}</p>
              <p className="chatbot-message-text">{item.content}</p>
            </article>
          ))}
          {isSending && (
            <article className="chatbot-message is-assistant">
              <p className="chatbot-message-role">AI</p>
              <p className="chatbot-message-text">Thinking...</p>
            </article>
          )}
        </div>

        <form className="chatbot-form" onSubmit={handleSubmit}>
          <textarea
            className="chatbot-input"
            name="prompt"
            rows={3}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message"
            maxLength={2000}
            required
          />
          <button className="chatbot-submit" type="submit" disabled={isSending || !input.trim()}>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>

        {error && (
          <p className="chatbot-error" role="status">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
