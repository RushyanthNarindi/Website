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
      <ul>
        <li><strong>Project Name 1</strong><br/>Brief description of the project, technologies used, and your role.</li>
        <li><strong>Project Name 2</strong><br/>Brief description of the project, technologies used, and your role.</li>
      </ul>

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
