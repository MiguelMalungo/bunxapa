import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ListenPage from './components/ListenPage'
import TourPage from './components/TourPage'
import ShopPage from './components/ShopPage'

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/listen" element={<ListenPage />} />
        <Route path="/tour" element={<TourPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </Router>
  )
}

export default App
