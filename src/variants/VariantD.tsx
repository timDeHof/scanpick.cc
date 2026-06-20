import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import { SITE, FEATURES, STEPS, PLANS, FAQS } from '../content'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CheckoutButton({ plan }: { plan: typeof PLANS[number] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { isSignedIn, userId } = useAuth()
  const navigate = useNavigate()

  const handleClick = async () => {
    if (!isSignedIn || !userId) {
      navigate('/sign-in?redirect=/#pricing')
      return
    }

    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, planName: plan.name, userId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const buttonText = loading
    ? 'Redirecting…'
    : error
      ? 'Error — try again'
      : isSignedIn
        ? plan.cta
        : 'Sign in to purchase'

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`mt-8 block w-full px-6 py-3 text-sm font-semibold rounded-lg text-center transition-colors cursor-pointer ${
        loading
          ? 'bg-blue-400 text-white cursor-not-allowed'
          : plan.featured
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {buttonText}
    </button>
  )
}

function DashboardMockup() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-xl relative">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-gray-500 font-mono bg-white px-2.5 py-1 rounded-md border border-gray-100 flex-1 max-w-[220px] text-center">
          scanpick.local:8080/waves
        </span>
      </div>

      {/* ── Actual TopBar ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-gray-900">ScanPick</span>
          <nav className="flex items-center gap-3 text-xs">
            <span className="text-blue-600 font-semibold">Waves</span>
            <span className="text-gray-500">Create</span>
            <span className="text-gray-500">Warehouse</span>
          </nav>
        </div>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search waves or orders...
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>John</span>
          <span className="text-gray-400">Logout</span>
        </div>
      </div>

      {/* ── Main content: Waves page ── */}
      <div className="bg-gray-50 p-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Waves</h1>
          <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">+ Create Wave</span>
        </div>

        {/* KPI cards — actual fields from KpiCards.tsx */}
        <div className="grid grid-cols-4 gap-4" id="kpi-target">
          {[
            { label: 'Active Waves', value: '3', icon: 'grid' },
            { label: 'Total Orders', value: '12', icon: 'cart' },
            { label: 'Avg Picking Time', value: '4 min', icon: 'clock' },
            { label: 'Efficiency Rate', value: '97%', icon: 'check' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-xs text-gray-500 font-medium">{kpi.label}</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-gray-900">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 text-xs">
          {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map((tab) => (
            <span key={tab} className={`px-3 py-1.5 rounded-lg font-medium ${
              tab === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>{tab}</span>
          ))}
        </div>

        {/* Waves table — actual columns from WavesPage.tsx */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" id="wave-table-target">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                {['Name', 'Status', 'Picker', 'Progress', 'Created', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Morning Pick', status: 'In Progress' as const, picker: 'Maria', progress: '6/10', created: '2h ago' },
                { name: 'Aisle 4 Replenish', status: 'In Progress' as const, picker: 'Jake', progress: '3/8', created: '1h ago' },
                { name: 'Express Orders', status: 'Pending' as const, picker: '—', progress: '0/12', created: '30m ago' },
                { name: 'Weekend Batch', status: 'Completed' as const, picker: 'Maria', progress: '8/8', created: '1d ago' },
              ].map((w) => (
                <tr key={w.name} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-gray-800 text-sm">{w.name}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      w.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                      w.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>{w.status}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">{w.picker}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[72px]">
                        <div className={`h-full rounded-full ${
                          w.status === 'Completed' ? 'w-full bg-emerald-400' :
                          w.name === 'Morning Pick' ? 'w-[60%] bg-blue-500' :
                          w.name === 'Aisle 4 Replenish' ? 'w-[37.5%] bg-blue-500' :
                          'w-0 bg-blue-500'
                        }`} />
                      </div>
                      <span className="text-xs text-gray-400">{w.progress}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-gray-400">{w.created}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-medium ${
                      w.status === 'Pending' ? 'text-blue-600' : 'text-gray-400'
                    }`}>{w.status === 'Pending' ? 'Start' : 'View'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leaderboard — from Leaderboard.tsx */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Leaderboard</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 font-medium">
                {['#', 'Worker', 'Picks', 'Active', 'Rate'].map(h => (
                  <th key={h} className="pb-1.5 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                { rank: '1', name: 'Maria', picks: '142', active: '2h 5m', rate: '68/hr' },
                { rank: '2', name: 'Jake', picks: '89', active: '1h 12m', rate: '74/hr' },
                { rank: '3', name: 'Alex', picks: '53', active: '42m', rate: '75/hr' },
              ].map(r => (
                <tr key={r.name} className="border-t border-gray-50">
                  <td className="py-1.5 pr-3 text-gray-400">{r.rank}</td>
                  <td className="py-1.5 pr-3 font-medium text-gray-700">{r.name}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums text-gray-600">{r.picks}</td>
                  <td className="py-1.5 pr-3 text-gray-400">{r.active}</td>
                  <td className="py-1.5 tabular-nums text-gray-600">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MobileScanMockup() {
  return (
    <div className="relative mx-auto max-w-[270px]">
      {/* Phone body — dark theme (#0f0f1a bg) as in theme.ts, 19.5:9 screen ratio */}
      <div className="relative rounded-[2.5rem] border-[2px] border-[#334155] bg-[#0f0f1a] shadow-2xl shadow-black/40 overflow-hidden aspect-[9/19.5] flex flex-col">
        {/* Glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-10 rounded-[inherit]" />

        {/* Status bar with Dynamic Island */}
        <div className="relative flex items-center justify-between px-5 pt-4 pb-1 z-20">
          <span className="text-[11px] font-semibold text-[#f8fafc] tracking-tight">9:41</span>
          {/* Dynamic Island pill */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[76px] h-[18px] bg-black rounded-full" />
          {/* Right: signal bars + battery */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-[1px] h-[10px]">
              <div className="w-[2.5px] h-[4px] rounded-[1px] bg-[#64748b]" />
              <div className="w-[2.5px] h-[6px] rounded-[1px] bg-[#64748b]" />
              <div className="w-[2.5px] h-[8px] rounded-[1px] bg-[#64748b]" />
              <div className="w-[2.5px] h-[10px] rounded-[1px] bg-[#f8fafc]" />
            </div>
            <div className="relative w-[20px] h-[10px] rounded-[2px] border border-[#64748b]">
              <div className="absolute inset-[1.5px] right-[3px] bg-[#f8fafc] rounded-[1px]" />
              <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] rounded-r-[1px] border border-[#64748b]" />
            </div>
          </div>
        </div>

        {/* ConnectionBar strip */}
        <div className="mx-4 mb-1 flex items-center gap-2 px-2 py-1 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span className="text-[10px] text-[#94a3b8]">Connected</span>
        </div>

        {/* Screen content — scrollable within fixed aspect ratio */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-2.5 [&::-webkit-scrollbar]:w-0">
          {/* Wave header */}
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Wave</span>
            <div className="flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-[#1e293b] rounded text-[9px] text-[#94a3b8]">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Optimized Path
            </div>
          </div>

          {/* Wave name + progress */}
          <div>
            <div className="text-sm font-mono font-bold text-[#f8fafc]">Morning Pick</div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-[#94a3b8]">Pick Progress</span>
              <span className="text-[11px] text-[#94a3b8] font-medium">3 / 10 items (30%)</span>
            </div>
            <div className="mt-1.5 h-[6px] bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full w-[30%] bg-[#10b981] rounded-full" />
            </div>
          </div>

          {/* Chips row: Picked / Remaining */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1a2e1a]/50 rounded text-[9px] text-[#10b981]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              3 Picked
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1e293b] rounded text-[9px] text-[#94a3b8]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              7 Remaining
            </div>
          </div>

          {/* PickTaskRow items — timeline/stepper style */}
          <div className="space-y-0">
            {/* Task 01 — Picked */}
            <div className="flex gap-2.5">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-px flex-1 bg-[#1e293b]" />
              </div>
              <div className="flex-1 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#64748b] line-through">M8 Bolt 50mm</span>
                </div>
                <div className="text-[9px] text-[#475569]">SKU: M8-050 · A-12-B-03 · Qty: 2</div>
              </div>
            </div>

            {/* Task 02 — Picked */}
            <div className="flex gap-2.5">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-px flex-1 bg-[#1e293b]" />
              </div>
              <div className="flex-1 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#64748b] line-through">Pallet Wrap 18"</span>
                </div>
                <div className="text-[9px] text-[#475569]">SKU: PLT-044 · B-04-R-12 · Qty: 1</div>
              </div>
            </div>

            {/* Task 03 — Picked */}
            <div className="flex gap-2.5">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-px flex-1 bg-[#f59e0b]" />
              </div>
              <div className="flex-1 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#64748b] line-through">Corrugated Box 12x12</span>
                </div>
                <div className="text-[9px] text-[#475569]">SKU: CB-122 · C-02-A-05 · Qty: 4</div>
              </div>
            </div>

            {/* Task 04 — Current (amber accent, "NEXT PICK") */}
            <div className="flex gap-2.5">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#f59e0b]/20 border-2 border-[#f59e0b] flex items-center justify-center shadow-[0_0_8px_#f59e0b]/40">
                  <span className="text-[9px] font-bold text-[#f59e0b]">04</span>
                </div>
                <div className="w-px h-4 bg-[#1e293b]" />
              </div>
              <div className="flex-1 pb-2.5">
                <div className="flex items-center gap-1 mb-1">
                  <div className="h-px flex-1 bg-[#f59e0b]/30" />
                  <span className="text-[8px] font-bold tracking-wider text-[#f59e0b]">NEXT PICK</span>
                  <div className="h-px flex-1 bg-[#f59e0b]/30" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#f59e0b]">M8 Bolt 50mm</span>
                </div>
                <div className="text-[9px] text-[#94a3b8]">SKU: M8-050 · A-12-B-03 · Qty: 2</div>
                <div className="text-[9px] text-[#64748b] mt-0.5">Expected: 4901234567890</div>
              </div>
            </div>
          </div>

          {/* SCAN ITEM button */}
          <div className="pt-0.5">
            <div className="flex items-center justify-center gap-2 bg-[#f59e0b] rounded-lg py-3">
              <svg className="w-4 h-4 text-[#0f0f1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-bold text-[#0f0f1a] tracking-wider">SCAN ITEM</span>
            </div>
          </div>

          {/* Report Discrepancy */}
          <div className="flex items-center justify-center gap-1.5 py-0.5">
            <svg className="w-3 h-3 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[9px] text-[#64748b]">REPORT DISCREPANCY</span>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2.5">
          <div className="w-20 h-1 rounded-full bg-[#1e293b]" />
        </div>
      </div>
    </div>
  )
}

/* ── Feature card SVG mockups ── */

function WaveMgmtSvg() {
  return (
    <svg viewBox="0 0 260 140" className="w-full h-auto rounded-lg border border-gray-200" fill="none">
      <rect width="260" height="140" rx="8" fill="#fff" />
      {/* Tab bar */}
      <rect x="12" y="8" width="46" height="22" rx="4" fill="#eff6ff" />
      <text x="18" y="22" fontSize="10" fontWeight="600" fill="#2563eb" fontFamily="system-ui">Waves</text>
      {/* Table header */}
      <text x="14" y="46" fontSize="8" fill="#9ca3af" fontFamily="system-ui" letterSpacing="1">WAVE</text>
      <text x="90" y="46" fontSize="8" fill="#9ca3af" fontFamily="system-ui" letterSpacing="1">STATUS</text>
      <text x="172" y="46" fontSize="8" fill="#9ca3af" fontFamily="system-ui" letterSpacing="1">PROGRESS</text>
      <line x1="12" y1="50" x2="248" y2="50" stroke="#f3f4f6" strokeWidth="1" />
      {/* Row 1 — Active */}
      <text x="14" y="70" fontSize="10" fontWeight="600" fill="#374151" fontFamily="system-ui">W-042</text>
      <rect x="90" y="62" width="44" height="14" rx="7" fill="#d1fae5" />
      <text x="96" y="72" fontSize="8" fontWeight="600" fill="#059669" fontFamily="system-ui">Active</text>
      <rect x="170" y="65" width="64" height="8" rx="4" fill="#f3f4f6" />
      <rect x="170" y="65" width="38" height="8" rx="4" fill="#3b82f6" />
      <text x="240" y="72" fontSize="9" fill="#6b7280" fontFamily="system-ui">6/10</text>
      {/* Row 2 — Pending */}
      <line x1="14" y1="84" x2="246" y2="84" stroke="#f9fafb" strokeWidth="1" />
      <text x="14" y="98" fontSize="10" fontWeight="600" fill="#374151" fontFamily="system-ui">W-043</text>
      <rect x="90" y="90" width="48" height="14" rx="7" fill="#eff6ff" />
      <text x="96" y="100" fontSize="8" fontWeight="600" fill="#3b82f6" fontFamily="system-ui">Pending</text>
      <rect x="170" y="93" width="64" height="8" rx="4" fill="#f3f4f6" />
      <text x="240" y="100" fontSize="9" fill="#9ca3af" fontFamily="system-ui">0/12</text>
      {/* Row 3 — Done */}
      <line x1="14" y1="112" x2="246" y2="112" stroke="#f9fafb" strokeWidth="1" />
      <text x="14" y="126" fontSize="10" fontWeight="600" fill="#374151" fontFamily="system-ui">W-041</text>
      <rect x="90" y="118" width="38" height="14" rx="7" fill="#f3f4f6" />
      <text x="96" y="128" fontSize="8" fontWeight="600" fill="#6b7280" fontFamily="system-ui">Done</text>
      <rect x="170" y="121" width="64" height="8" rx="4" fill="#f3f4f6" />
      <rect x="170" y="121" width="64" height="8" rx="4" fill="#9ca3af" />
      <text x="240" y="128" fontSize="9" fill="#6b7280" fontFamily="system-ui">8/8</text>
    </svg>
  )
}

function BarcodeScanSvg() {
  return (
    <svg viewBox="0 0 260 140" className="w-full h-auto" fill="none">
      {/* Barcode stripes — dense EAN-13-like pattern with guard bars */}
      <rect x="44" y="26" width="2" height="88" fill="#111827" />
      <rect x="48" y="26" width="1" height="88" fill="#111827" />
      <rect x="51" y="26" width="3" height="88" fill="#111827" />
      <rect x="56" y="26" width="1" height="88" fill="#111827" />
      <rect x="59" y="30" width="2" height="80" fill="#111827" />
      <rect x="63" y="30" width="1" height="80" fill="#111827" />
      <rect x="66" y="30" width="4" height="80" fill="#111827" />
      <rect x="72" y="30" width="1" height="80" fill="#111827" />
      <rect x="75" y="26" width="2" height="88" fill="#111827" />
      <rect x="79" y="30" width="1" height="80" fill="#111827" />
      <rect x="82" y="30" width="3" height="80" fill="#111827" />
      <rect x="87" y="30" width="1" height="80" fill="#111827" />
      <rect x="90" y="26" width="2" height="88" fill="#111827" />
      <rect x="94" y="26" width="1" height="88" fill="#111827" />
      <rect x="97" y="30" width="4" height="80" fill="#111827" />
      <rect x="103" y="26" width="2" height="88" fill="#111827" />
      <rect x="107" y="30" width="1" height="80" fill="#111827" />
      <rect x="110" y="30" width="3" height="80" fill="#111827" />
      <rect x="115" y="30" width="1" height="80" fill="#111827" />
      <rect x="118" y="26" width="2" height="88" fill="#111827" />
      <rect x="122" y="26" width="1" height="88" fill="#111827" />
      <rect x="125" y="30" width="3" height="80" fill="#111827" />
      <rect x="130" y="30" width="1" height="80" fill="#111827" />
      <rect x="133" y="30" width="2" height="80" fill="#111827" />
      <rect x="137" y="30" width="1" height="80" fill="#111827" />
      <rect x="140" y="30" width="4" height="80" fill="#111827" />
      <rect x="146" y="30" width="1" height="80" fill="#111827" />
      <rect x="149" y="30" width="2" height="80" fill="#111827" />
      {/* Center guard — tall */}
      <rect x="153" y="26" width="1" height="88" fill="#111827" />
      <rect x="156" y="26" width="3" height="88" fill="#111827" />
      <rect x="161" y="26" width="1" height="88" fill="#111827" />
      <rect x="164" y="30" width="2" height="80" fill="#111827" />
      <rect x="168" y="30" width="1" height="80" fill="#111827" />
      <rect x="171" y="30" width="3" height="80" fill="#111827" />
      <rect x="176" y="30" width="1" height="80" fill="#111827" />
      <rect x="179" y="30" width="2" height="80" fill="#111827" />
      <rect x="183" y="30" width="1" height="80" fill="#111827" />
      <rect x="186" y="30" width="4" height="80" fill="#111827" />
      <rect x="192" y="26" width="1" height="88" fill="#111827" />
      <rect x="195" y="30" width="2" height="80" fill="#111827" />
      <rect x="199" y="30" width="1" height="80" fill="#111827" />
      <rect x="202" y="30" width="3" height="80" fill="#111827" />
      <rect x="207" y="26" width="1" height="88" fill="#111827" />
      <rect x="210" y="26" width="2" height="88" fill="#111827" />
      {/* End guard — tall */}
      <rect x="214" y="26" width="1" height="88" fill="#111827" />
      <rect x="217" y="26" width="2" height="88" fill="#111827" />

      {/* Blue viewfinder corner brackets */}
      <path d="M42 24 L38 24 L38 28" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M222 24 L226 24 L226 28" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 116 L38 120 L42 120" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M226 116 L226 120 L222 120" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Blue scan line */}
      <rect x="38" y="72" width="188" height="2" rx="1" fill="#3b82f6" />
    </svg>
  )
}

function DashboardSvg() {
  return (
    <svg viewBox="0 0 260 140" className="w-full h-auto rounded-lg border border-gray-200" fill="none">
      <rect width="260" height="140" rx="8" fill="#fff" />
      {/* KPI row — 4 cards matching real KpiCards */}
      <rect x="10" y="10" width="56" height="36" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="14" y="14" width="8" height="8" rx="2" fill="#9ca3af" />
      <line x1="14" y1="18" x2="22" y2="18" stroke="#fff" strokeWidth="1" />
      <line x1="18" y1="14" x2="18" y2="22" stroke="#fff" strokeWidth="1" />
      <text x="26" y="21" fontSize="7" fill="#6b7280" fontFamily="system-ui">Active</text>
      <text x="26" y="21" fontSize="7" fill="#6b7280" fontFamily="system-ui">Active</text>
      <text x="14" y="37" fontSize="14" fontWeight="700" fill="#111827" fontFamily="system-ui">6</text>

      <rect x="70" y="10" width="56" height="36" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <circle cx="80" cy="18" r="3" fill="#9ca3af" />
      <path d="M76 21h8M76 24h8" stroke="#fff" strokeWidth="1.5" />
      <text x="86" y="21" fontSize="7" fill="#6b7280" fontFamily="system-ui">Orders</text>
      <text x="74" y="37" fontSize="14" fontWeight="700" fill="#111827" fontFamily="system-ui">24</text>

      <rect x="130" y="10" width="56" height="36" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <circle cx="140" cy="18" r="3" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
      <line x1="140" y1="18" x2="143" y2="21" stroke="#9ca3af" strokeWidth="1.5" />
      <text x="146" y="21" fontSize="7" fill="#6b7280" fontFamily="system-ui">Pick Time</text>
      <text x="134" y="37" fontSize="14" fontWeight="700" fill="#111827" fontFamily="system-ui">12m</text>

      <rect x="190" y="10" width="60" height="36" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <path d="M196 15 200 21 204 17" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="206" y="21" fontSize="7" fill="#6b7280" fontFamily="system-ui">Efficiency</text>
      <text x="194" y="37" fontSize="14" fontWeight="700" fill="#111827" fontFamily="system-ui">97%</text>

      {/* Filter tabs row */}
      <rect x="10" y="54" width="24" height="14" rx="4" fill="#3b82f6" />
      <text x="14" y="63" fontSize="7" fontWeight="600" fill="#fff" fontFamily="system-ui">All</text>
      <rect x="38" y="54" width="34" height="14" rx="4" fill="#f3f4f6" />
      <text x="43" y="63" fontSize="7" fill="#6b7280" fontFamily="system-ui">Pending</text>
      <rect x="76" y="54" width="46" height="14" rx="4" fill="#f3f4f6" />
      <text x="81" y="63" fontSize="7" fill="#6b7280" fontFamily="system-ui">In Progress</text>
      <rect x="126" y="54" width="48" height="14" rx="4" fill="#f3f4f6" />
      <text x="131" y="63" fontSize="7" fill="#6b7280" fontFamily="system-ui">Completed</text>

      {/* Table header */}
      <line x1="10" y1="74" x2="250" y2="74" stroke="#f3f4f6" strokeWidth="1" />
      <text x="12" y="84" fontSize="7" fill="#9ca3af" fontFamily="system-ui">WAVE</text>
      <text x="62" y="84" fontSize="7" fill="#9ca3af" fontFamily="system-ui">STATUS</text>
      <text x="116" y="84" fontSize="7" fill="#9ca3af" fontFamily="system-ui">PROGRESS</text>
      <text x="190" y="84" fontSize="7" fill="#9ca3af" fontFamily="system-ui">PICKER</text>

      {/* Row 1 */}
      <text x="12" y="98" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">Wave-024</text>
      <rect x="62" y="92" width="40" height="12" rx="6" fill="#dbeafe" />
      <text x="66" y="100" fontSize="7" fontWeight="600" fill="#2563eb" fontFamily="system-ui">In Progress</text>
      <rect x="116" y="94" width="50" height="6" rx="3" fill="#e5e7eb" />
      <rect x="116" y="94" width="30" height="6" rx="3" fill="#3b82f6" />
      <text x="172" y="98" fontSize="8" fill="#6b7280" fontFamily="system-ui">62%</text>
      <text x="200" y="98" fontSize="8" fill="#374151" fontFamily="system-ui">Ana</text>

      {/* Row 2 */}
      <line x1="10" y1="104" x2="250" y2="104" stroke="#f9fafb" strokeWidth="1" />
      <text x="12" y="118" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">Wave-025</text>
      <rect x="62" y="112" width="34" height="12" rx="6" fill="#fef3c7" />
      <text x="67" y="120" fontSize="7" fontWeight="600" fill="#d97706" fontFamily="system-ui">Pending</text>
      <rect x="116" y="114" width="50" height="6" rx="3" fill="#e5e7eb" />
      <text x="172" y="118" fontSize="8" fill="#9ca3af" fontFamily="system-ui">—</text>
      <text x="200" y="118" fontSize="8" fill="#9ca3af" fontFamily="system-ui">—</text>

      {/* Row 3 */}
      <line x1="10" y1="120" x2="250" y2="120" stroke="#f9fafb" strokeWidth="1" />
      <rect x="12" y="126" width="30" height="10" rx="3" fill="#3b82f6" />
      <text x="15" y="133" fontSize="6" fontWeight="600" fill="#fff" fontFamily="system-ui">+ New</text>
    </svg>
  )
}

function OfflineSvg() {
  return (
    <svg viewBox="0 0 260 160" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
      {/* Full-screen offline queue view — no phone frame, fills the card */}
      <rect width="260" height="160" fill="#fff" />

      {/* Status bar */}
      <rect width="260" height="20" fill="#f9fafb" />
      <rect x="10" y="7" width="12" height="6" rx="1.5" fill="#1f2937" />
      <rect x="30" y="8" width="20" height="4" rx="1" fill="#9ca3af" />
      <rect x="235" y="7" width="18" height="6" rx="1.5" fill="#1f2937" />

      {/* Offline banner */}
      <rect x="10" y="26" width="240" height="28" rx="6" fill="#fef3c7" />
      <path d="M20 38 24 34M26 36l2-2" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="22" cy="42" r="2" fill="#d97706" />
      <text x="32" y="36" fontSize="9" fontWeight="700" fill="#d97706" fontFamily="system-ui">Offline</text>
      <text x="32" y="47" fontSize="7" fill="#d97706" opacity="0.8" fontFamily="system-ui">Scans will queue and sync when reconnected</text>

      {/* Heading */}
      <text x="12" y="72" fontSize="7" fontWeight="600" fill="#9ca3af" fontFamily="system-ui" letterSpacing="1">QUEUED SCANS</text>

      {/* Queue items */}
      <rect x="10" y="80" width="240" height="22" rx="5" fill="#f9fafb" />
      <circle cx="24" cy="91" r="6" fill="none" stroke="#d97706" strokeWidth="1.5" />
      <path d="M24 87v4l3 2" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
      <text x="38" y="94" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">AC-100 × 3</text>
      <rect x="210" y="86" width="32" height="12" rx="6" fill="#fef3c7" />
      <text x="215" y="94" fontSize="6" fontWeight="600" fill="#d97706" fontFamily="system-ui">Queued</text>

      <rect x="10" y="106" width="240" height="22" rx="5" fill="#f9fafb" />
      <circle cx="24" cy="117" r="6" fill="none" stroke="#d97706" strokeWidth="1.5" />
      <path d="M24 113v4l3 2" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
      <text x="38" y="120" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">M8 Bolt 50mm × 1</text>
      <rect x="210" y="112" width="32" height="12" rx="6" fill="#fef3c7" />
      <text x="215" y="120" fontSize="6" fontWeight="600" fill="#d97706" fontFamily="system-ui">Queued</text>

      <rect x="10" y="132" width="240" height="22" rx="5" fill="#f0fdf4" />
      <circle cx="24" cy="143" r="6" fill="#22c55e" />
      <path d="M21 143l2 2 4-4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="38" y="146" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">PLT-044 — drained</text>
      <rect x="210" y="138" width="32" height="12" rx="6" fill="#dcfce7" />
      <text x="215" y="146" fontSize="6" fontWeight="600" fill="#16a34a" fontFamily="system-ui">Synced</text>
    </svg>
  )
}

function DiscrepancySvg() {
  return (
    <svg viewBox="0 0 260 160" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
      {/* Dark overlay (matching rgba(0,0,0,0.6)) */}
      <rect width="260" height="160" fill="rgba(0,0,0,0.55)" />

      {/* Modal card */}
      <rect x="20" y="12" width="220" height="136" rx="10" fill="#fff" />
      <rect x="20" y="12" width="220" height="136" rx="10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />

      {/* Title */}
      <text x="50%" y="32" fontSize="11" fontWeight="700" fill="#111827" fontFamily="system-ui" textAnchor="middle">Report Discrepancy</text>
      <text x="50%" y="43" fontSize="7" fill="#6b7280" fontFamily="system-ui" textAnchor="middle">Select the issue with this item</text>

      {/* Option 1 — Damage */}
      <rect x="30" y="52" width="200" height="22" rx="5" fill="#fef2f2" />
      <rect x="36" y="55" width="18" height="16" rx="4" fill="#fee2e2" />
      <rect x="40" y="59" width="10" height="2" rx="1" fill="#e11d48" />
      <rect x="40" y="63" width="10" height="2" rx="1" fill="#e11d48" />
      <rect x="40" y="67" width="10" height="2" rx="1" fill="#e11d48" />
      <text x="60" y="62" fontSize="8" fontWeight="600" fill="#e11d48" fontFamily="system-ui">Damage</text>
      <text x="60" y="70" fontSize="6" fill="#e11d48" opacity="0.7" fontFamily="system-ui">Product is damaged or defective</text>

      {/* Option 2 — Location Blocked */}
      <rect x="30" y="78" width="200" height="22" rx="5" fill="#fff" />
      <rect x="36" y="81" width="18" height="16" rx="4" fill="#f3f4f6" />
      <path d="M45 86 Q45 82 48 82 Q51 82 51 86 Q51 89 45 93 Q39 89 39 86 Q39 82 42 82 Q45 82 45 86" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
      <line x1="48" y1="94" x2="42" y2="88" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
      <text x="60" y="89" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">Location Blocked</text>
      <text x="60" y="97" fontSize="6" fill="#9ca3af" fontFamily="system-ui">Aisle or bin is inaccessible</text>

      {/* Option 3 — Wrong Product */}
      <rect x="30" y="104" width="200" height="22" rx="5" fill="#fff" />
      <rect x="36" y="107" width="18" height="16" rx="4" fill="#f3f4f6" />
      <rect x="41" y="110" width="1.5" height="10" rx="0.5" fill="#9ca3af" />
      <rect x="44" y="111" width="3" height="8" rx="0.5" fill="#9ca3af" />
      <rect x="49" y="110" width="1.5" height="10" rx="0.5" fill="#9ca3af" />
      <line x1="39" y1="121" x2="55" y2="109" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
      <text x="60" y="115" fontSize="8" fontWeight="600" fill="#374151" fontFamily="system-ui">Wrong Product</text>
      <text x="60" y="123" fontSize="6" fill="#9ca3af" fontFamily="system-ui">Barcode doesn't match expected product</text>

      {/* Cancel */}
      <text x="50%" y="142" fontSize="8" fontWeight="600" fill="#6b7280" fontFamily="system-ui" textAnchor="middle">Cancel</text>
    </svg>
  )
}

function PinAuthMockup() {
  const keyBtn = 'w-9 h-[22px] flex items-center justify-center bg-[#1e293b] border border-[#334155] rounded text-[10px] font-medium text-[#f1f5f9]';
  return (
    <div className="w-full h-full bg-[#0f172a] flex flex-col items-center justify-center p-3 gap-1.5">
      {/* Branding header */}
      <div className="flex flex-col items-center mb-0.5">
        <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <rect x="7" y="7" width="4" height="4" rx="1" strokeWidth={1} />
            <rect x="14" y="9" width="3" height="3" rx="0.5" strokeWidth={1} opacity="0.5" />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-[#f1f5f9] mt-1">ScanPick</span>
      </div>

      {/* Worker ID input */}
      <div className="w-[200px] flex items-center gap-1.5 bg-[#1e293b] border border-[#334155] rounded px-2.5 py-1.5">
        <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span className="text-[11px] text-[#e2e8f0] font-medium">W-042</span>
      </div>

      {/* PIN dots — 2 filled */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <div className="w-3 h-3 rounded-full border border-[#475569]" />
        <div className="w-3 h-3 rounded-full border border-[#475569]" />
      </div>

      {/* Error banner */}
      <div className="flex items-center gap-1 bg-[#450a0a] rounded px-3 py-1">
        <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4m0 4h.01" />
        </svg>
        <span className="text-[9px] text-red-400 font-medium">Invalid worker ID or PIN</span>
      </div>

      {/* Keypad grid */}
      <div className="grid grid-cols-3 gap-1">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
          <div key={key} className={keyBtn}>{key}</div>
        ))}
        <div className="w-9 h-[22px] flex items-center justify-center text-[7px] font-medium text-[#64748b]">
          Clear
        </div>
        <div className={keyBtn}>0</div>
        <div className={keyBtn}>
          <svg className="w-3 h-3 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M21 4H7l-5 8 5 8h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
            <path d="M18 9l-6 6M12 9l6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FeatureSvg({ title }: { title: string }) {
  switch (title) {
    case 'Wave Management': return <WaveMgmtSvg />;
    case 'Barcode Scanning': return <BarcodeScanSvg />;
    case 'Real-time Dashboard': return <DashboardSvg />;
    case 'Offline Tolerant': return <OfflineSvg />;
    case 'Discrepancy Handling': return <DiscrepancySvg />;
    case 'PIN-based Auth': return <PinAuthMockup />;
    default: return null;
  }
}

export default function VariantD() {
  return (
    <div className="bg-white text-gray-900 antialiased">
      <Navigation style="light" />

      {/* ── Hero: text + dashboard mockup ── */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {SITE.tagline}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight text-balance">
                Wave Picking for{' '}
                <span className="text-blue-600">Small Warehouses</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">{SITE.subhead}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <a href="#pricing" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors text-center">
                  {SITE.cta}
                </a>
                <a href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:text-gray-900 transition-colors text-center">
                  {SITE.ctaSecondary}
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="my-6 overflow-visible">
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features: simple 3-column grid ── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What you get</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Six screens. Each one solves a specific warehouse problem.</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors overflow-hidden flex flex-col"
              >
                <div className="flex-1 min-h-0"><FeatureSvg title={f.title} /></div>
                <div className="px-5 py-4 border-t border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Mobile App Showcase ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Pick from your handheld
              </h2>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                The mobile app guides pickers through each task — scan barcodes, confirm picks, and flag discrepancies without ever touching the web dashboard.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Optimized path ordering — tasks sorted by location, not input order',
                  'Timeline-style task list with picked / next-pick / pending states',
                  'Barcode scanning with instant mismatch detection',
                  'Offline queuing — scans store locally when Wi-Fi drops',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="flex justify-center">
              <MobileScanMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Download, connect, pick.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.step} className="text-center" {...fadeUp} transition={{ duration: 0.5, delay: i * 0.15 }}>
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">{s.step}</div>
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Pricing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Annual license. Includes updates and email support. We send a reminder before expiry — no auto-billing.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-white rounded-2xl border p-8 transition-all duration-200 ${
                  p.featured ? 'border-blue-500 border-2 shadow-xl scale-[1.02] relative' : 'border-gray-200 hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{p.subtitle}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-gray-900">${p.price.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">/year</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <CheckoutButton plan={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <motion.details
                key={faq.q}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group border border-gray-200 rounded-xl p-5 open:border-blue-200 open:bg-blue-50/30 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-900 list-none">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <Footer style="light" />
    </div>
  )
}
