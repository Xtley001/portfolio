import React from 'react'

interface MarkdownContentProps {
  content: string
}

function parseInline(text: string): React.ReactNode[] {
  // Regex for bold, link, code
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g)
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i} style={{ color: '#fff', fontWeight: 600 }}>{token.slice(2, -2)}</strong>
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            background: 'var(--surface-2, #1c1c1c)',
            padding: '2px 6px',
            borderRadius: '3px',
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '0.9em',
            color: 'var(--accent, #c8b89a)',
          }}
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent, #c8b89a)', textDecoration: 'underline' }}
        >
          {linkMatch[1]}
        </a>
      )
    }
    return token
  })
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: React.ReactNode[] = []
  let inCodeBlock = false
  let codeLines: string[] = []

  const flushList = (key: string | number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul
          key={`ul-${key}`}
          style={{
            margin: '12px 0 20px 20px',
            padding: 0,
            listStyleType: 'disc',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {listItems}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  const flushCode = (key: string | number) => {
    if (inCodeBlock) {
      elements.push(
        <pre
          key={`code-${key}`}
          style={{
            background: 'var(--surface-2, #161616)',
            border: '1px solid var(--border, #2a2a2a)',
            padding: '16px',
            borderRadius: '4px',
            overflowX: 'auto',
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '12px',
            color: 'var(--text-dim, #ccc)',
            margin: '16px 0',
          }}
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      codeLines = []
      inCodeBlock = false
    }
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx]
    const line = rawLine.trim()

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCode(idx)
      } else {
        flushList(idx)
        inCodeBlock = true
        codeLines = []
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(rawLine)
      continue
    }

    // List items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true
      listItems.push(
        <li
          key={`li-${idx}`}
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '13px',
            lineHeight: 1.7,
            color: 'var(--text-dim, #b3b3b3)',
          }}
        >
          {parseInline(line.slice(2))}
        </li>
      )
      continue
    } else {
      flushList(idx)
    }

    if (!line) {
      continue
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={idx}
          style={{
            fontFamily: 'var(--font-syne, sans-serif)',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 800,
            color: 'var(--text, #fff)',
            margin: '32px 0 16px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          {parseInline(line.slice(2))}
        </h1>
      )
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={idx}
          style={{
            fontFamily: 'var(--font-syne, sans-serif)',
            fontSize: 'clamp(18px, 3vw, 22px)',
            fontWeight: 700,
            color: 'var(--accent, #c8b89a)',
            margin: '28px 0 12px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--border, #2a2a2a)',
            paddingBottom: '6px',
          }}
        >
          {parseInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={idx}
          style={{
            fontFamily: 'var(--font-syne, sans-serif)',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text, #fff)',
            margin: '20px 0 8px',
          }}
        >
          {parseInline(line.slice(4))}
        </h3>
      )
    } else {
      // Paragraph
      elements.push(
        <p
          key={idx}
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'var(--text-dim, #b3b3b3)',
            margin: '12px 0',
          }}
        >
          {parseInline(line)}
        </p>
      )
    }
  }

  flushList('final')
  flushCode('final')

  return <div className="markdown-content">{elements}</div>
}
