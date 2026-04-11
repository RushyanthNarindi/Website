import React from 'react'

export default function Resume(){
  return (
    <div className="container content">
      <h1>Resume</h1>
      <h2>Personal Experience in IT</h2>
      <ul>
        <li><strong>Job Title 1</strong><br/>Company Name, Location — Dates of Employment<br/>- Description of responsibilities and achievements.</li>
        <li><strong>Job Title 2</strong><br/>Company Name, Location — Dates of Employment<br/>- Description of responsibilities and achievements.</li>
      </ul>

      <h2>Projects</h2>
      <div className="resume-projects">
        <article className="project-card">
          <h3>Personal Portfolio Website</h3>
          <p>Built a React + TypeScript personal site with routing, theme switching, and dynamic GitHub-backed stats.</p>
          <div className="project-skills" aria-label="Skills used in Personal Portfolio Website">
            <span className="skill-chip">React</span>
            <span className="skill-chip">TypeScript</span>
            <span className="skill-chip">Vite</span>
            <span className="skill-chip">CSS</span>
            <span className="skill-chip">GitHub API</span>
          </div>
        </article>

        <article className="project-card">
          <h3>Data and Automation Toolkit</h3>
          <p>Created automation scripts and data pipelines to process datasets, generate reports, and reduce repetitive manual tasks.</p>
          <div className="project-skills" aria-label="Skills used in Data and Automation Toolkit">
            <span className="skill-chip">Python</span>
            <span className="skill-chip">Pandas</span>
            <span className="skill-chip">SQL</span>
            <span className="skill-chip">Shell Scripting</span>
            <span className="skill-chip">Git</span>
          </div>
        </article>
      </div>

      <h2>Education</h2>
      <p><strong>Degree</strong><br/>University Name, Location — Graduation Year</p>

      <h2>Skills</h2>
      <ul>
        <li>Skill 1</li>
        <li>Skill 2</li>
        <li>Skill 3</li>
      </ul>

      <h2>Certifications</h2>
      <p>Certification Name, Issuing Organization, Year</p>

      <h2>References</h2>
      <p>Available upon request.</p>
    </div>
  )
}
