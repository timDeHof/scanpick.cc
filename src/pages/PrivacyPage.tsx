import LegalPage from '../components/LegalPage'

const sections = [
  {
    heading: 'What This Covers',
    content:
      'This Privacy Policy explains what data we collect, why we collect it, and what we do with it when you visit scanpick.cc, create an account, or purchase ScanPick.\n\n**Important:** ScanPick is self-hosted software. Your warehouse data — including orders, products, workers, pick tasks, and barcode scans — stays on your own infrastructure. We never have access to it.',
  },
  {
    heading: 'What We Collect',
    content:
      '**Account Information**\n\nWhen you create an account, we collect:\n- Name (optional, as provided by you)\n- Email address\n- Clerk user ID (internal identifier)\n\nThis data is stored by Clerk (clerk.com), our authentication provider.\n\n**Payment Information**\n\nWhen you purchase a license, payment processing is handled entirely by Stripe (stripe.com). We never see or store your credit card details. Stripe shares with us:\n- Payment confirmation (success/failure)\n- Your email address (from the checkout form)\n- The amount paid and plan purchased\n\n**License Information**\n\nAfter purchase, a license record is created with Keygen (keygen.sh), our license management provider. This record includes:\n- Your email address\n- The plan purchased\n- Your Clerk user ID (to display the license in your account dashboard)\n- Stripe session ID (for reconciliation)\n\n**Email Communications**\n\nWe send transactional emails via Resend (resend.com):\n- License delivery (after purchase)\n- Renewal reminders (30, 14, and 7 days before expiry)\n- Important product or account notices',
  },
  {
    heading: 'What We Do NOT Collect',
    content:
      '- **Zero warehouse data.** Orders, products, workers, pick tasks, barcodes, and all other operational data stay on your servers.\n- **No usage telemetry.** ScanPick makes no outbound connections for analytics, tracking, or phone-home purposes.\n- **No cookies for marketing or advertising.**\n- **No IP tracking** beyond standard server logs (retained 7 days).',
  },
  {
    heading: 'Third-Party Services',
    content:
      '| Service | Purpose |\n|---------|---------|\n| Clerk | User authentication |\n| Stripe | Payment processing |\n| Keygen | License management |\n| Resend | Transactional email |\n| Cloudflare | DNS, CDN, hosting |\n| GitHub | Binary distribution |\n\nWe do not sell, rent, or share your personal data with third parties for their own marketing purposes.',
  },
  {
    heading: 'Data Retention',
    content:
      '| Data | Retention |\n|------|-----------|\n| Account information | Until account deletion |\n| License records | 7 years (tax compliance) |\n| Email logs | 90 days |\n| Server access logs | 7 days |',
  },
  {
    heading: 'Your Rights (GDPR)',
    content:
      'If you are in the European Union, you have the right to:\n\n- **Access** — request a copy of the personal data we hold about you\n- **Rectification** — correct inaccurate data\n- **Erasure** — request deletion of your personal data\n- **Portability** — export your data in a machine-readable format\n- **Objection** — object to processing of your data\n\nTo exercise any of these rights, contact us at support@scanpick.cc.',
  },
  {
    heading: 'Data Security',
    content:
      '- Payment data never touches our servers (handled by Stripe directly)\n- Account passwords are managed by Clerk (hashed, never stored by us)\n- API communications with Stripe, Keygen, Clerk, and Resend are encrypted via HTTPS\n- License keys are delivered via email and accessible in your secure account dashboard',
  },
  {
    heading: 'Children\'s Privacy',
    content:
      'ScanPick is not intended for individuals under 18. We do not knowingly collect data from children.',
  },
  {
    heading: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy. Material changes will be communicated via email to the address associated with your account.',
  },
  {
    heading: 'Contact',
    content:
      'Privacy questions or concerns? Contact us at support@scanpick.cc.',
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 19, 2026"
      sections={sections}
    />
  )
}
