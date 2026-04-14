import React from 'react'
import AboutSections from '../components/AboutSections'
import { aboutMarkdown } from '../assets/data/about'

export default function About(){
  return (
    <div className="container content about-page">
      <header className="about-header">
        <h1>About</h1>
      </header>
      <AboutSections markdown={aboutMarkdown} />
    </div>
  )
}
