import { motion } from 'framer-motion'
import Navigation from './Navigation'
import Footer from './Footer'
import { Link } from 'react-router-dom'

interface Section {
  heading: string
  content: string
  children?: { heading: string; content: string }[]
}

interface LegalPageProps {
  title: string
  updated: string
  sections: Section[]
}

/** Bold-markdown and inline-code converter */
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
}

/** Parse markdown pipe-table lines into header + data rows. Skips separator rows. */
function parseTableLines(lines: string[]): { headers: string[]; rows: string[][] } {
  const parsed = lines
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((row) => !row.every((cell) => /^-{2,}$/.test(cell)))

  const [headers, ...rows] = parsed
  return { headers: headers ?? [], rows: rows ?? [] }
}

/** Render a table block */
function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                dangerouslySetInnerHTML={{ __html: inlineFormat(h) }}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2.5 text-gray-600 border-r border-gray-200 last:border-r-0 border-t border-gray-200 whitespace-nowrap"
                  dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Split raw content into text-paragraph blocks and table blocks */
function renderContentBlocks(content: string) {
  const lines = content.split('\n')
  const blocks: JSX.Element[] = []
  let i = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()

    // Skip pure-empty lines at block boundaries
    if (!trimmed) {
      i++
      continue
    }

    // --- Table block ---
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const { headers, rows } = parseTableLines(tableLines)
      if (headers.length > 0) {
        blocks.push(<TableBlock key={`t-${blocks.length}`} headers={headers} rows={rows} />)
      }
      continue
    }

    // --- Paragraph block (gather consecutive non-table, non-empty lines) ---
    const paraLines: string[] = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (!t) break
      if (t.startsWith('|')) break
      paraLines.push(lines[i])
      i++
    }

    for (const line of paraLines) {
      const html = inlineFormat(line)
      if (!line.trim()) continue
      blocks.push(
        <p key={`p-${blocks.length}`} dangerouslySetInnerHTML={{ __html: html }} />,
      )
    }
  }

  return blocks
}

export default function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <div className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <Navigation style="light" />

      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-block">
              &larr; Back to ScanPick
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-sm text-gray-400 mb-10">Last updated: {updated}</p>

            <div className="space-y-8">
              {sections.map((section, i) => (
                <section key={i}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.heading}</h2>
                  <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                    {renderContentBlocks(section.content)}
                  </div>
                  {section.children && (
                    <div className="mt-4 ml-4 space-y-6">
                      {section.children.map((child, k) => (
                        <div key={k}>
                          <h3 className="text-sm font-semibold text-gray-800 mb-2">{child.heading}</h3>
                          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                            {renderContentBlocks(child.content)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer style="light" />
    </div>
  )
}
