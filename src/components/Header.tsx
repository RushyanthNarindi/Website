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
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
