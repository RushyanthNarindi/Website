import React from 'react'

type AboutSectionsProps = {
  markdown: string
}

type AboutSection = {
  title: string
  body: string
  id: string
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function createUniqueHeadingIds(headings: string[]): string[] {
  const counts = new Map<string, number>()
  return headings.map((heading) => {
    const base = slugify(heading) || 'section'
    const seen = counts.get(base) ?? 0
    counts.set(base, seen + 1)
    return seen === 0 ? base : `${base}-${seen + 1}`
  })
}

function parseSections(markdown: string): AboutSection[] {
  const sections = markdown
    .split(/\n(?=# )/)
    .map((section) => section.trim())
    .filter((section) => section.length > 0)
    .map((section) => {
      const [heading, ...rest] = section.split('\n')
      return {
        title: heading.replace(/^#\s+/, '').trim(),
        body: rest.join('\n').trim(),
      }
    })

  const sectionIds = createUniqueHeadingIds(sections.map((section) => section.title))

  return sections.map((section, index) => ({
    ...section,
    id: sectionIds[index] ?? 'section',
  }))
}

function splitAboutMarkdown(markdown: string): { intro: string; sections: AboutSection[] } {
  const trimmed = markdown.trim()
  const introHeading = '# Intro'

  if (!trimmed.startsWith(introHeading)) {
    return {
      intro: '',
      sections: parseSections(trimmed),
    }
  }

  const withoutIntroHeading = trimmed.slice(introHeading.length).trimStart()
  const nextHeadingIndex = withoutIntroHeading.search(/\n# /)

  if (nextHeadingIndex === -1) {
    return {
      intro: withoutIntroHeading.trim(),
      sections: [],
    }
  }

  return {
    intro: withoutIntroHeading.slice(0, nextHeadingIndex).trim(),
    sections: parseSections(withoutIntroHeading.slice(nextHeadingIndex + 1).trim()),
  }
}

function renderMarkdownBlock(block: string, key: string): React.ReactNode {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return null
  }

  const isList = lines.every((line) => line.startsWith('- '))

  if (isList) {
    return (
      <ul key={key}>
        {lines.map((line, index) => (
          <li key={`${key}-item-${index}`}>{line.slice(2).trim()}</li>
        ))}
      </ul>
    )
  }

  return <p key={key}>{lines.join(' ')}</p>
}

function renderMarkdownContent(markdown: string): React.ReactNode {
  const blocks = markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  return blocks.map((block, index) => renderMarkdownBlock(block, `block-${index}`))
}

export default function AboutSections({ markdown }: AboutSectionsProps) {
  const { intro, sections } = splitAboutMarkdown(markdown)

  return (
    <article className="about-content">
      {intro ? <div className="about-intro">{renderMarkdownContent(intro)}</div> : null}

      {sections.length > 0 ? (
        <nav className="about-section-nav" aria-label="About sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="about-section-nav-link">
              {section.title}
            </a>
          ))}
        </nav>
      ) : null}

      {sections.map((section) => (
        <section key={section.id} className="about-section">
          <h2 id={section.id}>
            <a href={`#${section.id}`} className="about-section-heading-link">
              <span>{section.title}</span>
              <span className="about-section-heading-hash" aria-hidden="true">
                #
              </span>
            </a>
          </h2>
          {renderMarkdownContent(section.body)}
        </section>
      ))}
    </article>
  )
}
