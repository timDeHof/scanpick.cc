import { motion } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'

export default function ThankYou() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <Navigation style="light" />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full text-center"
        >
          {/* Success checkmark */}
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Payment Successful!
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Thank you for purchasing ScanPick. Your license key will be sent to
            the email address you provided at checkout within a few minutes.
          </p>

          {/* What happens next */}
          <div className="mt-10 text-left bg-gray-50 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              What happens next
            </h2>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong className="text-gray-900">Check your email</strong> —
                  Your license key and download instructions are on their way to
                  the inbox you used during checkout.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong className="text-gray-900">Download &amp; run</strong> —
                  Download the ScanPick binary for your platform, place your
                  license file in the same directory, and start the server.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong className="text-gray-900">Connect your team</strong> —
                  Open the web dashboard on any browser, create worker PINs, and
                  have your team install the mobile app.
                </span>
              </li>
            </ol>
          </div>

          {/* Session ID (subtle) */}
          {sessionId && (
            <p className="mt-6 text-xs text-gray-400 font-mono">
              Session: {sessionId}
            </p>
          )}

          {/* Back link */}
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to ScanPick
          </Link>
        </motion.div>
      </main>

      <Footer style="light" />
    </div>
  )
}
