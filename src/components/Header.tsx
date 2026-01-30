import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../ThemeProvider'

export default function Header(){
  const { theme, toggleTheme } = useTheme()
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link className="logo" to="/">
          <span className="logo-text">Rushyanth</span>
        </Link>

        <nav className="nav" id="site-nav">
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/resume">Resume</Link></li>
            <li><Link to="/writings/article-1">Writings</Link></li>
            <li><Link to="/stats">Stats</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li>
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
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
