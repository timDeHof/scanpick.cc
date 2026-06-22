import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VariantD from './variants/VariantD'
import ThankYou from './components/ThankYou'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AccountPage from './pages/AccountPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import EulaPage from './pages/EulaPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariantD />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/eula" element={<EulaPage />} />
      </Routes>
    </BrowserRouter>
  )
}
