
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../ThemeProvider'
import LogoAsset from '../assets/images/WtxtBbg.svg'

export default function Header(){
  const { theme, toggleTheme } = useTheme()
  const [navOpen, setNavOpen] = useState(false)

  function closeNav(){ setNavOpen(false) }

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link className="logo" to="/" onClick={closeNav}>
          <span
            aria-label="Rushyanth logo"
            className="logo-mark"
            role="img"
            style={{ '--logo-mask': `url(${LogoAsset})` } as React.CSSProperties}
          />
        </Link>

        <div className="header-right">
          <nav className={`nav${navOpen ? ' nav-open' : ''}`} id="site-nav">
            <ul>
              <li><Link to="/about" onClick={closeNav}>About</Link></li>
              <li><Link to="/resume" onClick={closeNav}>Resume</Link></li>
              <li><Link to="/writings/article-1" onClick={closeNav}>Writings</Link></li>
              <li><Link to="/stats" onClick={closeNav}>Stats</Link></li>
              <li><Link to="/contact" onClick={closeNav}>Contact</Link></li>
            </ul>
          </nav>

          {/* Theme toggle — always visible */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.79 1.8-1.78zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 1.04l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM17 11v2h3v-2h-3zM12 6a6 6 0 100 12 6 6 0 000-12zm-1 13.99h2v-3h-2v3zM4.24 19.16l1.8 1.79 1.79-1.79-1.79-1.79-1.8 1.79zM19.07 19.16l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M21.64 13a9 9 0 11-9.63-9.63 7 7 0 009.63 9.63z" />
              </svg>
            )}
          </button>

          {/* Hamburger — mobile only (CSS hides on desktop) */}
          <button
            className="nav-toggle"
            onClick={() => setNavOpen(o => !o)}
            aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={navOpen}
            aria-controls="site-nav"
          >
            {navOpen ? (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
