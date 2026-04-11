import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import Stats from './pages/Stats'

function Writings(){
  return (
    <div className="container content">
      <h1>Writings</h1>
      <p>Thoughts, notes, and technical write-ups will appear here.</p>
      <h2>Featured</h2>
      <ul>
        <li><strong>Coming soon:</strong> Building a modern portfolio with React and TypeScript.</li>
      </ul>
    </div>
  )
}

export default function App(){
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/writings" element={<Writings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
