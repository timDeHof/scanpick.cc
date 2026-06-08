import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VariantD from './variants/VariantD'
import ThankYou from './components/ThankYou'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariantD />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  )
}
