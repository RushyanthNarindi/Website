import React from 'react'

export default function Home(){
  return (
    <section className="hero">
      <div className="container hero-inner">
        <h1 className="reveal">Hi — I'm <span className="name">Rushaynth</span></h1>
        <p className="lead reveal">I build things on the web. This site is under construction — follow for updates.</p>
        <div className="hero-ctas reveal">
          <a className="btn" href="/about">About</a>
          <a className="btn ghost" href="/writings/article-1">Writings</a>
        </div>
      </div>
      <div className="hero-bg" id="hero-bg" aria-hidden="true"></div>
    </section>
  )
}
