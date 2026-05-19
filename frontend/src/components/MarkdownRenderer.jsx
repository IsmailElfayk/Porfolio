import { memo, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import mermaid from 'mermaid'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import { C, F } from '../styles/theme'

// Augment defaultSchema to allow KaTeX MathML/HTML output and hljs spans.
// Self-authored portfolio content — style/class attributes are intentional.
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // KaTeX generates spans with classes, inline styles, and aria attrs
    span: ['className', 'style', 'aria-hidden', 'aria-label', 'aria-describedby'],
    // MathML root
    math: ['xmlns', 'display'],
    annotation: ['encoding'],
    'annotation-xml': ['encoding'],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    // MathML elements emitted by KaTeX
    'math', 'mfrac', 'mi', 'mn', 'mo', 'mrow', 'msub', 'msup', 'msubsup',
    'msqrt', 'mtext', 'semantics', 'annotation', 'annotation-xml',
    'mover', 'munder', 'munderover', 'mtable', 'mtr', 'mtd', 'mpadded',
    'mphantom', 'mspace', 'merror', 'mglyph', 'mfenced', 'mstyle',
    'mlabeledtr', 'mmultiscripts', 'mroot', 'ms',
  ],
}

// Plugin arrays defined outside to avoid new reference on every render
const REMARK_PLUGINS = [remarkGfm, remarkMath]
const REHYPE_PLUGINS = [
  rehypeKatex,
  [rehypeHighlight, { ignoreMissing: true }],
  [rehypeSanitize, sanitizeSchema],
]

// ─── Mermaid ────────────────────────────────────────────────────────────────

let mermaidReady = false

function initMermaid() {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      background: C.panel,
      primaryColor: C.blue,
      primaryTextColor: C.text,
      primaryBorderColor: C.border,
      lineColor: C.muted,
      secondaryColor: C.panel2,
      tertiaryColor: C.panel2,
      edgeLabelBackground: C.panel2,
      clusterBkg: C.panel,
      clusterBorder: C.border,
      nodeTextColor: C.text,
      fontFamily: F.sans,
      fontSize: '14px',
    },
  })
  mermaidReady = true
}

function MermaidDiagram({ code }) {
  const ref = useRef(null)
  // Stable unique ID for the lifetime of this component instance
  const id = useRef(`mmd${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    initMermaid()
    let cancelled = false

    mermaid.render(id.current, code.trim()).then(({ svg }) => {
      if (!cancelled && ref.current) ref.current.innerHTML = svg
    }).catch((err) => {
      if (!cancelled && ref.current) {
        ref.current.innerHTML =
          `<pre style="color:#ef4444;font-size:12px;white-space:pre-wrap;">${String(err)}</pre>`
      }
    })

    return () => { cancelled = true }
  }, [code])

  return (
    <div
      ref={ref}
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 24,
        margin: '20px 0',
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 80,
      }}
    />
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Recursively extract plain text from a React node tree (used for mermaid code)
function nodeText(node) {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (node?.props?.children !== undefined) return nodeText(node.props.children)
  return ''
}

// ─── Component map ────────────────────────────────────────────────────────────

const COMPONENTS = {
  // pre: intercept fenced code blocks → handle mermaid or style the block
  pre({ children }) {
    const child = Array.isArray(children) ? children[0] : children
    const cls = child?.props?.className ?? ''
    const lang = /language-(\w+)/.exec(cls)?.[1] ?? ''

    if (lang === 'mermaid') {
      return <MermaidDiagram code={nodeText(child?.props?.children)} />
    }

    return (
      <div style={{ position: 'relative', margin: '20px 0' }}>
        {lang && (
          <span style={{
            position: 'absolute', top: 10, right: 14,
            fontSize: 10, fontFamily: F.mono, color: C.faint,
            letterSpacing: '0.08em', userSelect: 'none',
            textTransform: 'uppercase', pointerEvents: 'none',
          }}>
            {lang}
          </span>
        )}
        <pre style={{
          background: '#1a1f28',
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: '18px 20px',
          overflowX: 'auto',
          fontSize: 13,
          lineHeight: 1.7,
          fontFamily: F.mono,
          margin: 0,
        }}>
          {children}
        </pre>
      </div>
    )
  },

  // code: block code passes through; inline code gets custom style
  code({ className, children, ...props }) {
    if (/language-/.test(className ?? '')) {
      // Block code — let the pre wrapper handle styling; just pass through
      return <code className={className} {...props}>{children}</code>
    }
    // Inline code
    return (
      <code style={{
        fontFamily: F.mono,
        fontSize: '0.875em',
        background: C.panel2,
        color: '#7DD8C8',
        padding: '2px 7px',
        borderRadius: 4,
        border: `1px solid ${C.border}`,
      }}>
        {children}
      </code>
    )
  },

  h1: ({ children }) => (
    <h1 style={{
      fontSize: 28, fontWeight: 800, lineHeight: 1.25,
      margin: '40px 0 16px', color: C.text,
      paddingBottom: 10, borderBottom: `1px solid ${C.border}`,
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontSize: 22, fontWeight: 700, lineHeight: 1.3,
      margin: '32px 0 14px', color: C.text,
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontSize: 18, fontWeight: 700,
      margin: '26px 0 10px', color: C.text,
    }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{
      fontSize: 16, fontWeight: 700,
      margin: '22px 0 8px', color: C.text,
    }}>{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 style={{
      fontSize: 12, fontWeight: 700,
      margin: '18px 0 6px', color: C.muted,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 style={{
      fontSize: 12, fontWeight: 600,
      margin: '16px 0 6px', color: C.faint,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>{children}</h6>
  ),

  p: ({ children }) => (
    <p style={{ margin: '0 0 18px', color: C.muted, fontSize: 15, lineHeight: 1.8 }}>
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong style={{ color: C.text, fontWeight: 700 }}>{children}</strong>
  ),

  em: ({ children }) => (
    <em style={{ color: C.muted, fontStyle: 'italic' }}>{children}</em>
  ),

  del: ({ children }) => (
    <del style={{ color: C.faint, textDecorationColor: C.faint }}>{children}</del>
  ),

  ul: ({ children }) => (
    <ul style={{ paddingLeft: 22, margin: '0 0 18px', color: C.muted, listStyleType: 'disc' }}>
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol style={{ paddingLeft: 22, margin: '0 0 18px', color: C.muted }}>
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li style={{ marginBottom: 8, lineHeight: 1.7 }}>{children}</li>
  ),

  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: `4px solid ${C.blue}`,
      margin: '20px 0',
      padding: '12px 20px',
      background: C.panel2,
      borderRadius: '0 8px 8px 0',
      color: C.muted,
      fontStyle: 'italic',
    }}>
      {children}
    </blockquote>
  ),

  // GFM tables
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 14,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
      }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: C.panel2 }}>{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr style={{ borderBottom: `1px solid ${C.border}` }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th style={{
      padding: '10px 16px',
      textAlign: 'left',
      color: C.text,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{
      padding: '10px 16px',
      color: C.muted,
      verticalAlign: 'top',
      fontSize: 14,
    }}>
      {children}
    </td>
  ),

  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '32px 0' }} />
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      style={{
        color: C.blue,
        textDecoration: 'underline',
        textDecorationColor: `${C.blue}55`,
      }}
    >
      {children}
    </a>
  ),

  img: ({ src, alt }) => (
    <span style={{ display: 'block', margin: '20px 0' }}>
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        style={{ maxWidth: '100%', borderRadius: 8, border: `1px solid ${C.border}` }}
      />
      {alt && (
        <span style={{
          display: 'block',
          fontSize: 12,
          color: C.faint,
          fontStyle: 'italic',
          marginTop: 8,
          textAlign: 'center',
        }}>
          {alt}
        </span>
      )}
    </span>
  ),
}

// ─── Public API ───────────────────────────────────────────────────────────────

function MarkdownRenderer({ children }) {
  if (!children) return null
  return (
    <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text, fontFamily: F.sans }}>
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={COMPONENTS}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default memo(MarkdownRenderer)
