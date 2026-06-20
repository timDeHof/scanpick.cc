import LegalPage from '../components/LegalPage'

const sections = [
  {
    heading: '1. Introduction',
    content:
      'These Terms of Service ("Terms") govern your purchase and use of ScanPick, a warehouse wave-picking software product operated by Timothy DeHof ("we," "our," or "us"). By purchasing, downloading, or using ScanPick, you agree to these Terms.\n\nScanPick is self-hosted software. You download the binary, run it on your own infrastructure, and your warehouse data never leaves your control.',
  },
  {
    heading: '2. License Grant',
    content:
      'When you purchase a license, we grant you a non-exclusive, non-transferable, non-sublicensable license to:\n\n- Install and run one instance of ScanPick on your infrastructure\n- Allow workers at your warehouse to access the web dashboard and mobile app\n\n**The license is per-site.** One license covers one warehouse facility. Multi-site operations require a Multi Site or Enterprise license.\n\nYour license key is delivered via email after purchase and is also available in your account dashboard at scanpick.cc/account.',
  },
  {
    heading: '3. License Restrictions',
    content:
      'You may not:\n\n- Redistribute, resell, or sublicense ScanPick to third parties\n- Use ScanPick to provide a hosted or managed service to others\n- Modify, reverse engineer, or create derivative works of the software\n- Remove or alter any license notices or attribution\n- Use an invalid, expired, or tampered license key',
  },
  {
    heading: '4. Payment & Renewals',
    content:
      '**Payment**\n\nAll purchases are processed via Stripe. We accept major credit cards. Prices are listed at scanpick.cc/#pricing.\n\nPayment is due in full at the time of purchase. All prices are in USD.\n\n**Renewals**\n\nLicenses are annual and expire one year from the purchase date. We send renewal reminder emails at 30, 14, and 7 days before expiry.\n\nTo renew, visit the pricing page and complete a new purchase. After renewal, you\'ll receive a new license key with an updated expiry date.\n\nWe do not auto-charge or auto-renew. Renewals are manual.\n\n**Refunds**\n\nWe offer a **30-day money-back guarantee**. If you\'re not satisfied with ScanPick within 30 days of purchase, contact us at support@scanpick.cc for a full refund.\n\nAfter 30 days, all sales are final.',
  },
  {
    heading: '5. Delivery',
    content:
      'After purchase:\n\n1. Your license key is sent via email within one minute\n2. The license key also appears in your account dashboard at scanpick.cc/account\n3. Download links for the ScanPick binary are available in your account dashboard\n4. The binary is also available via GitHub Releases\n\nInstallation instructions are at docs.scanpick.cc.',
  },
  {
    heading: '6. Support',
    content:
      'We provide email support at support@scanpick.cc. We respond within 1-2 business days.\n\n**Support includes:**\n- Installation and configuration questions\n- Bug reports and troubleshooting\n- License key issues\n\n**Support does not include:**\n- Custom development or feature requests\n- Integration with third-party systems (beyond documented APIs)\n- On-site deployment assistance',
  },
  {
    heading: '7. No Warranty',
    content:
      'SCANPICK IS PROVIDED "AS IS" AND "AS AVAILABLE." WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.\n\nWe do not guarantee that ScanPick will operate uninterrupted or error-free. You run it on your own infrastructure, and we are not responsible for issues caused by your environment.',
  },
  {
    heading: '8. Limitation of Liability',
    content:
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF SCANPICK, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST DATA, BUSINESS INTERRUPTION, OR WAREHOUSE OPERATIONAL DISRUPTION.\n\nOUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF SCANPICK WILL NOT EXCEED THE AMOUNT YOU PAID FOR THE LICENSE IN THE 12 MONTHS PRECEDING THE CLAIM.',
  },
  {
    heading: '9. Termination',
    content:
      'We may terminate or suspend your license if you violate these Terms. Upon termination:\n\n- You must stop using ScanPick and delete all copies\n- No refund will be issued for termination due to violation\n\nWe may also discontinue ScanPick or any of its features at any time. In such a case, we will provide a pro-rata refund for the unused portion of your license.',
  },
  {
    heading: '10. Changes to These Terms',
    content:
      'We may update these Terms from time to time. Material changes will be communicated via email to the address associated with your account.\n\nContinued use of ScanPick after changes take effect constitutes acceptance of the updated Terms.',
  },
  {
    heading: '11. Governing Law',
    content:
      'These Terms are governed by the laws of the State of Oregon, USA, without regard to its conflict of laws principles.',
  },
  {
    heading: '12. Contact',
    content:
      'Questions or concerns? Contact us at:\n\n- Email: support@scanpick.cc\n- GitHub: github.com/timDeHof/scanpick',
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 19, 2026"
      sections={sections}
    />
  )
}
