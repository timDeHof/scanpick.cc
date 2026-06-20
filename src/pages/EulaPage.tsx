import LegalPage from '../components/LegalPage'

const sections = [
  {
    heading: '1. License Grant',
    content:
      'Subject to the terms of this EULA, Licensor grants Licensee a non-exclusive, non-transferable, non-sublicensable, revocable license to:\n\n- Install and run one instance of ScanPick on Licensee\'s own infrastructure\n- Allow Licensee\'s employees and contractors to access and use ScanPick through the web dashboard and mobile app\n- Make a reasonable number of backup copies for archival purposes\n\n**License Scope by Tier:**\n\n| Tier | Coverage |\n|------|----------|\n| Single Site | One warehouse facility |\n| Multi Site | Up to 5 warehouse facilities |\n| Enterprise | Unlimited facilities within one legal entity |',
  },
  {
    heading: '2. License Term',
    content:
      'This license is valid for one year from the date of purchase ("License Term"). Upon expiration, the license must be renewed to continue using ScanPick.\n\nAfter expiry, ScanPick will stop functioning. A grace period of 7 days past expiry is provided for operational continuity during renewal.',
  },
  {
    heading: '3. License Key',
    content:
      'Upon purchase, Licensee receives a unique license key. This key must be entered into ScanPick\'s License Settings to activate the software.\n\nLicensee is responsible for safeguarding their license key. Lost keys can be retrieved by logging into scanpick.cc/account.',
  },
  {
    heading: '4. Restrictions',
    content:
      'Licensee may not:\n\n- **Redistribute:** Copy, distribute, or make ScanPick available to any third party\n- **Resell:** Sell, rent, lease, or sublicense ScanPick or its license key\n- **Hosted service:** Use ScanPick to provide a managed or hosted service to others\n- **Modify:** Reverse engineer, decompile, disassemble, or create derivative works of ScanPick\n- **Remove:** Remove or alter any copyright, trademark, or license notices\n- **Circumvent:** Bypass, disable, or tamper with license validation mechanisms\n- **Unauthorized use:** Use ScanPick with an invalid, expired, or tampered license key',
  },
  {
    heading: '5. Ownership',
    content:
      'ScanPick is licensed, not sold. Licensor retains all right, title, and interest in and to ScanPick, including all intellectual property rights. This EULA does not transfer ownership of ScanPick to Licensee.',
  },
  {
    heading: '6. No Warranty',
    content:
      'SCANPICK IS PROVIDED "AS IS" AND "WITH ALL FAULTS." LICENSOR DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND FREEDOM FROM ERRORS OR INTERRUPTIONS.\n\nLICENSEE ASSUMES ALL RISK FOR THE QUALITY AND PERFORMANCE OF SCANPICK. LICENSEE IS RESPONSIBLE FOR TESTING SCANPICK IN THEIR OWN ENVIRONMENT BEFORE DEPLOYING TO PRODUCTION.',
  },
  {
    heading: '7. Limitation of Liability',
    content:
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, LICENSOR WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:\n\n- Lost profits or revenue\n- Lost data or business interruption\n- Warehouse operational disruption\n- Damage to reputation or goodwill\n- Cost of substitute goods or services\n\nLICENSOR\'S TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THIS EULA WILL NOT EXCEED THE LICENSE FEES PAID BY LICENSEE FOR THE THEN-CURRENT LICENSE TERM.',
  },
  {
    heading: '8. Termination',
    content:
      'This EULA terminates automatically upon the earlier of:\n\n- Expiration of the License Term (unless renewed)\n- Licensee\'s breach of any term of this EULA\n- Licensor\'s discontinuation of ScanPick (with pro-rata refund)\n\nUpon termination, Licensee must:\n- Stop using ScanPick\n- Delete all copies of ScanPick and any backup copies\n- Certify deletion in writing if requested',
  },
  {
    heading: '9. Export Compliance',
    content:
      'Licensee agrees to comply with all applicable export control laws and trade sanctions. Licensee represents that they are not located in or a resident of any country subject to US trade sanctions.',
  },
  {
    heading: '10. Governing Law',
    content:
      'This EULA is governed by the laws of the State of Oregon, USA, without regard to its conflict of laws principles. Any disputes shall be resolved in the courts of Multnomah County, Oregon.',
  },
  {
    heading: '11. Entire Agreement',
    content:
      'This EULA constitutes the entire agreement between the parties regarding ScanPick and supersedes all prior agreements, understandings, or representations.',
  },
  {
    heading: '12. Contact',
    content:
      'For questions about this EULA:\n\n- Email: support@scanpick.cc\n- GitHub: github.com/timDeHof/scanpick',
  },
]

export default function EulaPage() {
  return (
    <LegalPage
      title="End User License Agreement (EULA)"
      updated="June 19, 2026"
      sections={sections}
    />
  )
}
