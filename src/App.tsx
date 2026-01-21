import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { AmbientBackground } from './components/AmbientBackground'
import Toast from './components/Toast'
import ProductDetailsModal from './components/ProductDetailsModal'
import { useStore } from './context/StoreContext'
import Home from './pages/Home'
import Clothes from './pages/Clothes'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const location = useLocation();
  const { selectedProduct, viewProduct } = useStore();

  return (
    <div className="min-h-screen bg-soltan-black text-soltan-white selection:bg-soltan-purple selection:text-white relative overflow-hidden">
      <AmbientBackground />
      <Toast />
      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => viewProduct(null)} 
      />

      {/* Main Content */}
      <div className="relative z-10">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/vault-x921-soltan-private-access" element={<AdminLogin />} />
          <Route path="/vault-x921-soltan-private-access/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      
      {/* Almost invisible admin access button */}
      <Link 
        to="/vault-x921-soltan-private-access"
        className="fixed bottom-1 left-1/2 -translate-x-1/2 z-50 w-6 h-2 opacity-10 hover:opacity-40 bg-white/5 border border-white/10 rounded-sm"
        aria-label="access"
      />
    </div>
  )
}

export default App
