// Shared content for all variants
export const SITE = {
  name: 'ScanPick',
  tagline: 'Runs on your hardware',
  headline: 'Wave Picking for Small Warehouses',
  subhead:
    'Download the server binary, open the dashboard on any tablet in the warehouse, install the mobile app on your workers\' phones. Everything stays on your network.',
  cta: 'Buy — From $500/yr',
  ctaSecondary: 'See Features',
} as const

export const FEATURES = [
  {
    title: 'Wave Management',
    description:
      'Group orders into picking waves, assign workers, and monitor progress in real-time. Pause, cancel, or complete waves as needed.',
  },
  {
    title: 'Barcode Scanning',
    description:
      'Point the phone camera at the barcode. If it matches the expected product, the pick registers. If not, it shows what you should have picked.',
  },
  {
    title: 'Real-time Dashboard',
    description:
      'Opens in any browser. Shows picks per hour, wave progress, open discrepancies. Refresh for latest — no WebSocket magic needed.',
  },
  {
    title: 'Offline Tolerant',
    description:
      'Wi-Fi drops mid-pick? Scans queue on the phone and sync when the network comes back. Nothing is lost, nothing needs to be re-entered.',
  },
  {
    title: 'Discrepancy Handling',
    description:
      'Worker hits a flag button, picks a reason (damaged, wrong product, blocked aisle). The dashboard logs it. Manager reviews and resolves.',
  },
  {
    title: 'PIN-based Auth',
    description:
      'Each worker gets a 4-digit PIN. No email, no password, no IT involvement. Managers authenticate through the web dashboard.',
  },
] as const

export const STEPS = [
  {
    step: 1,
    title: 'Download & Run',
    description:
      'Download the binary (Windows or Linux), double-click to run. It starts with an embedded database and demo data loaded — warehouse layout, products, workers, picking waves.',
  },
  {
    step: 2,
    title: 'Connect Your Team',
    description:
      'Give workers their PIN. They install the mobile app, enter the server address and PIN, and start scanning. Managers open the web dashboard from any browser.',
  },
  {
    step: 3,
    title: 'Start Picking',
    description:
      'Create a wave, assign workers, and they pick. The dashboard updates as scans come in. If they\'ve used a scanner before, they already know how to use this one.',
  },
] as const

export const PLANS = [
  {
    name: 'Single Site',
    subtitle: 'One warehouse',
    price: 500,
    featured: false,
    priceId: 'price_1TfuJrA9STL8XQ42tn7u9ZCL',
    features: [
      'Up to 10 workers',
      'Web dashboard + mobile app',
      'Offline scan queuing',
      'Email support',
    ],
    cta: 'Buy — $500',
    href: '#',
  },
  {
    name: 'Multi Site',
    subtitle: 'Up to 3 warehouses',
    price: 1500,
    featured: true,
    priceId: 'price_1TfuLDA9STL8XQ42aYRtBmgP',
    features: [
      'Up to 50 workers',
      '3 warehouse licenses',
      'Web dashboard + mobile app',
      'Offline scan queuing',
      'Priority email support',
    ],
    cta: 'Buy — $1,500',
    href: '#',
  },
  {
    name: 'Enterprise',
    subtitle: 'Unlimited warehouses',
    price: 5000,
    featured: false,
    priceId: 'price_1TfuMaA9STL8XQ42paZF1hwZ',
    features: [
      'Unlimited workers',
      'Unlimited warehouse licenses',
      'Self-hosted PostgreSQL (BYO)',
      'VIP support (email + Slack)',
    ],
    cta: 'Contact Us',
    href: 'mailto:sales@scanpick.com',
  },
] as const

export const FAQS = [
  {
    q: 'Do I need a cloud subscription?',
    a: 'No. ScanPick is self-hosted software. You download the binary, run it on any Windows or Linux machine in your warehouse, and everything stays on your network. The mobile app connects directly to your server. No data ever leaves your building.',
  },
  {
    q: 'What if our Wi-Fi goes down?',
    a: 'Workers keep scanning. The mobile app queues scans locally on the device and syncs them automatically when connectivity returns. Your picks are never lost.',
  },
  {
    q: 'What hardware do I need?',
    a: 'Any Windows or Linux machine to run the server (even a $200 mini PC works). Android or iOS phones for workers. A tablet or PC for the supervisor dashboard. No special barcode scanners needed — the mobile app uses the phone\'s camera.',
  },
  {
    q: 'Can I try it before buying?',
    a: 'Yes. Download the binary — it starts with demo data pre-loaded (sample warehouse layout, products, workers, and picking waves). You can explore the full dashboard and mobile app immediately. No time limit, no feature restrictions.',
  },
  {
    q: 'What about updates?',
    a: 'Your annual license includes all updates during the term. When your license expires, the software continues to work — you just won\'t receive new updates until you renew. We send reminders 30, 14, and 7 days before expiry.',
  },
  {
    q: 'Do you offer support?',
    a: 'Yes. Single Site and Multi Site include email support. Enterprise includes email + Slack. We aim for same-day responses during business hours.',
  },
] as const
