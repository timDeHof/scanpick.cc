import { useUser, useClerk } from '@clerk/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { LATEST_VERSION, DOWNLOADS } from '../content'

interface License {
  id: string
  key: string
  name: string
  expiry: string
  status: string
  planName: string
}

export default function AccountPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const [licenses, setLicenses] = useState<License[]>([])
  const [licensesLoading, setLicensesLoading] = useState(true)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!isSignedIn || !user?.id) return

    setLicensesLoading(true)
    fetch(`/api/licenses?userId=${encodeURIComponent(user.id)}`)
      .then(res => res.json())
      .then(data => {
        setLicenses(Array.isArray(data) ? data : [])
      })
      .catch(() => setLicenses([]))
      .finally(() => setLicensesLoading(false))
  }, [isSignedIn, user?.id])

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch { /* fallback: user can select manually */ }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return iso }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in required</h1>
          <p className="text-gray-500">Please sign in to view your account.</p>
        </div>
      </div>
    )
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress || 'No email'

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
            {/* Page header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Account</h1>
                <p className="text-sm text-gray-500 mt-1">{primaryEmail}</p>
              </div>
              <button
                onClick={() => signOut({ redirectUrl: '/' })}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Sign out
              </button>
            </div>

            <div className="space-y-8">
              {/* Profile section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Profile
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {user.firstName?.[0] || primaryEmail[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.fullName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{primaryEmail}</p>
                  </div>
                </div>
              </section>

              {/* Subscription section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Subscription
                </h2>
                {licensesLoading ? (
                  <div className="animate-pulse bg-gray-50 rounded-lg p-4">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                ) : licenses.length > 0 ? (
                  <div className="space-y-3">
                    {licenses.map((lic) => (
                      <div key={lic.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{lic.planName}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            lic.status === 'ACTIVE' || lic.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {lic.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Expires {formatDate(lic.expiry)}
                        </p>
                      </div>
                    ))}
                    <a
                      href="/#pricing"
                      className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Upgrade or renew &rarr;
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                    <p className="font-medium text-gray-900 mb-1">No active subscription</p>
                    <p>
                      Purchase a license to get started.
                    </p>
                    <a
                      href="/#pricing"
                      className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View plans &rarr;
                    </a>
                  </div>
                )}
              </section>

              {/* License keys section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  License Keys
                </h2>
                {licensesLoading ? (
                  <div className="animate-pulse bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                ) : licenses.length > 0 ? (
                  <div className="space-y-3">
                    {licenses.map((lic) => (
                      <div key={lic.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">{lic.planName}</p>
                          <p className="text-xs text-gray-400">Expires {formatDate(lic.expiry)}</p>
                        </div>
                        <div className="flex items-stretch gap-2">
                          <code className="min-w-0 flex-1 text-xs font-mono bg-white border border-gray-200 rounded px-2.5 py-1.5 text-gray-700 select-all break-all leading-relaxed">
                            {lic.key}
                          </code>
                          <button
                            onClick={() => copyToClipboard(lic.key)}
                            className="shrink-0 self-start px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          >
                            {copiedKey === lic.key ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400">
                      Each key activates one self-hosted instance. Paste it into your ScanPick dashboard License Settings.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                    <p>
                      Your license keys will appear here after purchase. Each key
                      activates one ScanPick instance.
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      No license keys yet.
                    </p>
                  </div>
                )}
              </section>

              {/* Downloads section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Downloads
                </h2>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Download the ScanPick server binary for your platform.
                    Requires an active license to run.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOWNLOADS.map((dl) => {
                      const url = `https://github.com/timDeHof/scanpick/releases/download/v${LATEST_VERSION}/scanpick-${LATEST_VERSION}-${dl.rid}.${dl.ext}`
                      return (
                        <a
                          key={dl.rid}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                        >
                          <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">{dl.platform}</p>
                            <p className="text-xs text-gray-400">scanpick-{LATEST_VERSION}-{dl.rid}.{dl.ext}</p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-400 pt-2">
                    Docker images also available — see the{' '}
                    <a href="https://docs.scanpick.cc" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">documentation</a>
                    {' '}for details.
                  </p>
                </div>
              </section>

              {/* Settings section */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Settings
                </h2>
                <div className="text-sm text-gray-500">
                  <p>
                    Manage your profile, security, and connected accounts in
                    Clerk's account portal.
                  </p>
                  <button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="mt-3 text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign out of all devices
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer style="light" />
    </div>
  )
}
