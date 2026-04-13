
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
              <li>
                <Link to="/about" onClick={closeNav} className="nav-pill">
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                  About
                </Link>
              </li>
              <li>
                <Link to="/resume" onClick={closeNav} className="nav-pill">
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                  Resume
                </Link>
              </li>
              <li>
                <Link to="/writings" onClick={closeNav} className="nav-pill">
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M4 5.5A2.5 2.5 0 016.5 3H20v14H6.5A2.5 2.5 0 004 19.5V5.5zm2.5-.5a1 1 0 000 2H18V5H6.5zM6 20c0-.55.45-1 1-1h13v2H7a1 1 0 01-1-1z"/></svg>
                  Writings
                </Link>
              </li>
              <li>
                <Link to="/stats" onClick={closeNav} className="nav-pill">
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>
                  Stats
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeNav} className="nav-pill">
                  <svg viewBox="0 0 24 24" aria-hidden><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  Contact
                </Link>
              </li>
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
