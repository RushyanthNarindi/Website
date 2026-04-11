import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Project from './pages/Project'
import Contact from './pages/Contact'
import Stats from './pages/Stats'

export default function App(){
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  )
}
