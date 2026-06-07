import { SITE } from '../content'

type Style = 'light' | 'dark' | 'minimal'

export default function Footer({ style = 'light' }: { style?: Style }) {
  const bg = style === 'dark' ? 'bg-gray-950 text-gray-400' : style === 'minimal' ? 'bg-gray-50 text-gray-500' : 'bg-gray-900 text-gray-400'
  const logo = style === 'dark' ? 'text-indigo-400' : style === 'minimal' ? 'text-emerald-600' : 'text-blue-400'
  return (
    <footer className={`${bg} py-12`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className={`w-5 h-5 ${logo}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-white">{SITE.name}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="mailto:hello@scanpick.com" className="hover:text-white transition-colors">Contact</a>
            <span className="text-gray-600">·</span>
            <span>&copy; 2026 ScanPick. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
