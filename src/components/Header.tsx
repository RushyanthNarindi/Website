import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
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
          </ul>
        </nav>
      </div>
    </header>
  )
}
