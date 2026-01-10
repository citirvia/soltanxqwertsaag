import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X, Search, Minus, Plus, MessageCircle, Instagram } from 'lucide-react';
import { CrownLogo } from './CrownLogo';
import MagneticButton from './MagneticButton';
import { useStore } from '../context/StoreContext';

import { formatPrice } from '../utils/formatPrice';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    createOrder,
    isCartOpen,
    setIsCartOpen,
    checkoutStep,
    setCheckoutStep,
    products,
    viewProduct
  } = useStore();
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [cartPulse, setCartPulse] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = searchQuery 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleProductClick = (product: any) => {
    viewProduct(product);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Trigger pulse when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  const menuItems = [
    { label: 'Collections', path: '/clothes' },
    { label: 'New Arrivals', target: 'products' }
  ];

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder(formData);
    setCheckoutStep('cart');
    setIsCartOpen(false);
    setFormData({ name: '', phone: '', address: '' });
  };

  const handleNavClick = (e: React.MouseEvent, item: { target?: string, path?: string }) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (item.path) {
        navigate(item.path);
        return;
    }

    if (item.target) {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: item.target } });
        } else {
            const element = document.getElementById(item.target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else if (item.target === 'hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }
  };

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6 mix-blend-difference text-white"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 4.5, duration: 0.8, ease: "easeOut" }}
      >
        {/* Left: Menu Trigger */}
        <MagneticButton 
          onClick={() => setIsMenuOpen(true)}
          className="group flex items-center gap-2 hover:text-soltan-cyan transition-colors"
        >
          <Menu className="w-6 h-6" />
          <span className="hidden md:block font-mono text-sm tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">MENU</span>
        </MagneticButton>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <CrownLogo className="w-10 h-10 text-white" />
        </div>

        {/* Right: Cart & Search */}
        <div className="flex items-center gap-6">
          <MagneticButton 
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-soltan-cyan transition-colors"
          >
            <Search className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton 
            onClick={() => setIsCartOpen(true)}
            className="group flex items-center gap-2 hover:text-soltan-purple transition-colors relative"
          >
            <motion.div
              animate={cartPulse ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.div>
            <span className="hidden md:block font-mono text-sm">CART ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
            
            {/* Cart Counter Badge (Pulse) */}
            {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-soltan-purple rounded-full flex items-center justify-center text-[10px] font-bold md:hidden animate-pulse">
                    {cart.reduce((a, c) => a + c.quantity, 0)}
                </span>
            )}

            <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-soltan-purple scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </MagneticButton>
        </div>
      </motion.nav>

      {/* Full Screen Mega Menu */}
      <AnimatePresence>
        {isSearchOpen && (
            <motion.div
                className="fixed inset-0 z-50 bg-soltan-black/95 backdrop-blur-xl flex flex-col items-center pt-32 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute top-8 right-8 text-white hover:text-soltan-cyan transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                <div className="w-full max-w-3xl space-y-8">
                    <input 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent border-b-2 border-white/20 py-4 text-3xl md:text-5xl font-black uppercase tracking-tighter text-white placeholder-white/20 focus:outline-none focus:border-soltan-cyan transition-colors text-center"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id}
                                onClick={() => handleProductClick(product)}
                                className="flex items-center gap-4 p-4 border border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                                <div>
                                    <h3 className="font-bold uppercase tracking-wider group-hover:text-soltan-cyan transition-colors">{product.name}</h3>
                                    <p className="text-sm text-white/50">{formatPrice(product.price)}</p>
                                </div>
                            </div>
                        ))}
                        {searchQuery && filteredProducts.length === 0 && (
                            <p className="text-center text-white/50 col-span-full">No products found matching "{searchQuery}"</p>
                        )}
                    </div>
                </div>
            </motion.div>
        )}

        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-soltan-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-soltan-cyan transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <ul className="flex flex-col items-center gap-8">
              {menuItems.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <a 
                    href="#" 
                    onClick={(e) => handleNavClick(e, item)}
                    className="text-4xl md:text-6xl font-bold uppercase tracking-tighter hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-soltan-cyan hover:to-soltan-purple transition-all duration-300 relative group"
                  >
                    {item.label}
                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-soltan-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Cart */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
                className="fixed inset-0 z-[51] bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
                className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-soltan-gray z-[52] border-l border-white/10 p-8 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-mono uppercase tracking-widest">
                      {checkoutStep === 'cart' ? 'Your Bag' : 'Secure Checkout'}
                    </h2>
                    <button onClick={() => setIsCartOpen(false)}>
                        <X className="w-6 h-6 hover:text-soltan-purple transition-colors" />
                    </button>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <>
                    {cart.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-white/30 font-mono text-sm">
                          YOUR BAG IS EMPTY
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        {cart.map(item => (
                          <div key={item.id} className="flex gap-4 bg-black/20 p-4 border border-white/5">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover grayscale" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold uppercase tracking-wide">{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-500 transition-colors">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-soltan-purple font-mono text-sm mb-4">${item.price}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center border border-white/10">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white/10 transition-colors"><Minus className="w-3 h-3" /></button>
                                  <span className="w-8 text-center text-xs font-mono">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white/10 transition-colors"><Plus className="w-3 h-3" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto border-t border-white/10 pt-8">
                        <div className="flex justify-between mb-4 font-mono text-sm">
                            <span>SUBTOTAL</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <button 
                          disabled={cart.length === 0}
                          onClick={() => setCheckoutStep('form')}
                          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-soltan-cyan transition-colors relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">Proceed to Checkout</span>
                            <div className="absolute inset-0 bg-soltan-purple transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                        </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleCheckout} className="flex-1 flex flex-col">
                    <button 
                      type="button" 
                      onClick={() => setCheckoutStep('cart')}
                      className="text-xs uppercase tracking-widest text-white/50 hover:text-white mb-8 flex items-center gap-2"
                    >
                      ← Back to Cart
                    </button>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50">Full Name</label>
                        <input 
                          required 
                          className="w-full bg-black/50 border border-white/10 p-4 focus:border-soltan-purple outline-none transition-colors"
                          placeholder="ENTER FULL NAME"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50">Contact Number</label>
                        <input 
                          required 
                          type="tel"
                          className="w-full bg-black/50 border border-white/10 p-4 focus:border-soltan-purple outline-none transition-colors"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50">Shipping Address</label>
                        <textarea 
                          required 
                          rows={4}
                          className="w-full bg-black/50 border border-white/10 p-4 focus:border-soltan-purple outline-none transition-colors resize-none"
                          placeholder="ENTER DELIVERY COORDINATES"
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/10">
                      <div className="flex justify-between mb-6 font-mono text-sm text-white/50">
                          <span>TOTAL TO PAY</span>
                          <span className="text-white">{formatPrice(cartTotal)}</span>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-4 bg-soltan-purple text-black font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_20px_rgba(176,38,255,0.3)]"
                      >
                          Confirm Order
                      </button>

                      <div className="flex gap-4 mt-4">
                        <a href="https://wa.me/21694120066" target="_blank" rel="noreferrer" className="flex-1 py-3 flex items-center justify-center gap-2 bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/50 hover:bg-[#25D366] hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                        <a href="https://instagram.com/soltan_store_1" target="_blank" rel="noreferrer" className="flex-1 py-3 flex items-center justify-center gap-2 bg-[#E1306C]/20 text-[#E1306C] border border-[#E1306C]/50 hover:bg-[#E1306C] hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                      </div>
                    </div>
                  </form>
                )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
