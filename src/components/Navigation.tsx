import { motion } from 'framer-motion'
import { SITE } from '../content'

type Style = 'light' | 'dark' | 'minimal'

const styles: Record<Style, {
  bg: string
  text: string
  cta: string
  link: string
  logo: string
  border: string
}> = {
  light: {
    bg: 'bg-white/80 backdrop-blur-md border-gray-100',
    text: 'text-gray-900',
    cta: 'bg-blue-600 text-white hover:bg-blue-700',
    link: 'text-gray-600 hover:text-gray-900',
    logo: 'text-blue-600',
    border: 'border-b border-gray-100',
  },
  dark: {
    bg: 'bg-gray-900/80 backdrop-blur-md border-gray-800',
    text: 'text-white',
    cta: 'bg-indigo-500 text-white hover:bg-indigo-600',
    link: 'text-gray-400 hover:text-white',
    logo: 'text-indigo-400',
    border: 'border-b border-gray-800',
  },
  minimal: {
    bg: 'bg-transparent',
    text: 'text-gray-900',
    cta: 'bg-emerald-600 text-white hover:bg-emerald-700',
    link: 'text-gray-500 hover:text-gray-900',
    logo: 'text-emerald-600',
    border: '',
  },
}

export default function Navigation({ style = 'light' }: { style?: Style }) {
  const s = styles[style]
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 ${s.bg} ${s.border}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <svg className={`w-7 h-7 ${s.logo}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-xl font-bold ${s.text}`}>{SITE.name}</span>
          </div>
          {style !== 'minimal' && (
            <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${s.link}`}>
              <a href="#features" className="transition-colors">Features</a>
              <a href="#how-it-works" className="transition-colors">How It Works</a>
              <a href="#pricing" className="transition-colors">Pricing</a>
              <a href="#faq" className="transition-colors">FAQ</a>
            </div>
          )}
          <a
            href="#pricing"
            className={`inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${s.cta}`}
          >
            Buy Now
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
