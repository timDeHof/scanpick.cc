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
                    {section.content.split('\n').map((p, j) => {
                      // Convert **bold** to <strong>
                      const html = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      if (!p.trim()) return null
                      return <p key={j} dangerouslySetInnerHTML={{ __html: html }} />
                    })}
                  </div>
                  {section.children && (
                    <div className="mt-4 ml-4 space-y-6">
                      {section.children.map((child, k) => (
                        <div key={k}>
                          <h3 className="text-sm font-semibold text-gray-800 mb-2">{child.heading}</h3>
                          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                            {child.content.split('\n').map((p, l) => {
                              const html = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              if (!p.trim()) return null
                              return <p key={l} dangerouslySetInnerHTML={{ __html: html }} />
                            })}
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
