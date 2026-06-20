import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VariantD from './variants/VariantD'
import ThankYou from './components/ThankYou'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AccountPage from './pages/AccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariantD />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  )
}
