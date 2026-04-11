import React from 'react'

export default function Contact(){
  return (
    <section className="contact-screen">
      <div className="container contact-wrap">
        <h1>Get in Touch</h1>

        <a className="contact-email" href="mailto:your-email@example.com">
          <span>your-email@example.com</span>
        </a>

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
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M22 5.92c-.74.33-1.53.55-2.36.66a4.06 4.06 0 001.8-2.24 8.1 8.1 0 01-2.58.98 4.05 4.05 0 00-6.98 2.77c0 .32.03.63.1.92A11.5 11.5 0 013.3 4.9a4.05 4.05 0 001.25 5.4c-.66-.02-1.28-.2-1.82-.5v.05a4.05 4.05 0 003.24 3.97 4.1 4.1 0 01-1.82.07 4.05 4.05 0 003.79 2.8A8.14 8.14 0 012 18.3a11.47 11.47 0 006.2 1.82c7.44 0 11.5-6.16 11.5-11.5l-.01-.52A8.2 8.2 0 0022 5.92z"/></svg>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 1.8A3.7 3.7 0 003.8 7.5v9a3.7 3.7 0 003.7 3.7h9a3.7 3.7 0 003.7-3.7v-9a3.7 3.7 0 00-3.7-3.7h-9zm10.1 1.4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z"/></svg>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h3l1-3h-4V9c0-.55.45-1 1-1z"/></svg>
          </a>
          <a href="mailto:your-email@example.com" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}
