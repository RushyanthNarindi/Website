import React, { useState } from 'react'

export default function Contact(){
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined

    if(!endpoint){
      setSubmitState('error')
      setSubmitMessage('Contact form is not configured yet. Add VITE_FORMSPREE_ENDPOINT in your environment.')
      return
    }

    setIsSubmitting(true)
    setSubmitState('idle')
    setSubmitMessage('')

    try{
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name || 'Website visitor'}`
        })
      })

      if(!response.ok){
        throw new Error(`Request failed with status ${response.status}`)
      }

      setSubmitState('success')
      setSubmitMessage('Message sent successfully. Thank you!')
      form.reset()
    }catch(error){
      setSubmitState('error')
      setSubmitMessage('Could not send message. Please try again in a few minutes.')
    }finally{
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact-screen">
      <div className="container contact-wrap">
        <h1>Get in Touch</h1>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{display:'none'}} />
          <div className="contact-row">
            <input
              className="contact-input"
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
            <input
              className="contact-input"
              type="email"
              name="email"
              placeholder="Your email"
              required
            />
          </div>
          <textarea
            className="contact-input contact-textarea"
            name="message"
            placeholder="Your message"
            rows={5}
            required
          />
          <button className="contact-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          {submitState !== 'idle' && (
            <p className={`contact-status ${submitState === 'success' ? 'is-success' : 'is-error'}`} role="status" aria-live="polite">
              {submitMessage}
            </p>
          )}
        </form>

        <p className="contact-note">Usually respond within 24 hours</p>

        <div className="contact-divider" aria-hidden>
          <span />
          <p>or find me on</p>
          <span />
        </div>

        <div className="contact-socials" aria-label="Social links">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M6.94 8.5H3.56v12h3.38v-12zM5.25 2a1.95 1.95 0 100 3.9 1.95 1.95 0 000-3.9zM20.44 13.74c0-3.23-1.72-4.74-4.02-4.74-1.85 0-2.67 1.02-3.13 1.74V8.5H9.9c.05 1.49 0 12 0 12h3.38v-6.7c0-.36.03-.72.13-.97.28-.72.92-1.47 2-1.47 1.41 0 1.97 1.08 1.97 2.66v6.48h3.38v-6.76z"/></svg>
          </a>
          <a href="https://github.com/RushyanthNarindi" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M12 .5A12 12 0 000 12.67a12.17 12.17 0 008.2 11.58c.6.11.82-.27.82-.58v-2.26c-3.34.74-4.04-1.66-4.04-1.66a3.22 3.22 0 00-1.34-1.8c-1.1-.76.08-.74.08-.74a2.56 2.56 0 011.86 1.3 2.52 2.52 0 003.44 1.01 2.6 2.6 0 01.75-1.6c-2.67-.32-5.47-1.38-5.47-6.1a4.87 4.87 0 011.23-3.33 4.6 4.6 0 01.12-3.28s1.01-.33 3.3 1.27a11.12 11.12 0 016 0c2.28-1.6 3.3-1.27 3.3-1.27a4.58 4.58 0 01.11 3.28 4.83 4.83 0 011.24 3.33c0 4.73-2.8 5.77-5.48 6.08a2.9 2.9 0 01.82 2.25v3.33c0 .32.21.7.83.58A12.18 12.18 0 0024 12.67 12 12 0 0012 .5z"/></svg>
          </a>
          <a href="mailto:rushyanthnarindi@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}
