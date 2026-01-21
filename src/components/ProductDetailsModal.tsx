import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import MagneticButton from './MagneticButton';

import { formatPrice } from '../utils/formatPrice';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { addToCart, openCheckout } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  if (!product) return null;

  const images = (product.images && product.images.length > 0) ? product.images : [product.image, ...(product.imageSecondary ? [product.imageSecondary] : [])].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setSelectedSize(undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    setSelectedSize(undefined);
    openCheckout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="bg-black border border-white/10 w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative pointer-events-auto">
              
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:text-white/80 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image Gallery Section */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative bg-black flex flex-col">
                <div className="flex-1 relative overflow-hidden group">
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
                
                {/* Thumbnails */}
                <div className="h-24 bg-black/80 p-4 flex gap-4 overflow-x-auto items-center justify-center backdrop-blur-sm">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto p-6 md:p-12 text-white flex flex-col custom-scrollbar">
                
                <div className="mb-2">
                  <span className="text-white/60 tracking-[0.2em] text-sm uppercase font-bold">{product.category}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 text-white">
                  {product.name}
                </h2>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-2xl md:text-3xl font-light font-mono text-chrome">
                    {formatPrice(product.price)}
                  </div>
                  {product.isNew && (
                    <span className="px-2 py-1 text-[10px] uppercase tracking-widest border border-soltan-purple text-soltan-purple bg-black/50 rounded-sm animate-pulse">
                      NEW
                    </span>
                  )}
                </div>

                <div className="space-y-8 flex-1">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-3 border-l-2 border-soltan-purple pl-3">Story of the Piece</h3>
                    <p className="text-gray-300 leading-relaxed font-light">
                      {product.story || product.description || "A masterpiece of modern engineering. Designed for those who demand excellence and refuse compromise. Every stitch, every seam, every material choice is a testament to the pursuit of perfection."}
                    </p>
                  </div>

                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-widest mb-3 border-l-2 border-soltan-cyan pl-3">Available Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, idx) => (
                          <span key={idx} className="px-4 py-2 border border-soltan-cyan text-soltan-cyan bg-black/50 rounded-lg text-sm font-bold hover:bg-soltan-cyan/10 transition-colors">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-3 border-l-2 border-white/50 pl-3">Technical Specs</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {(product.technicalSpecs && product.technicalSpecs.length > 0 
                        ? product.technicalSpecs 
                        : [product.specs.material, product.specs.weight, product.specs.resistance]
                      ).map((spec, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-lg">
                          <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Spec</span>
                          <span className="font-mono text-white">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-l-2 border-soltan-cyan pl-3">Select Size</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-2 font-bold uppercase tracking-widest transition-all border-2 rounded-lg ${
                            selectedSize === size
                              ? 'border-soltan-cyan bg-soltan-cyan/20 text-soltan-cyan'
                              : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/10">
                  <MagneticButton 
                    onClick={handleAddToCart}
                    className="bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 group"
                  >
                    <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Add to Cart</span>
                  </MagneticButton>

                  <MagneticButton 
                    onClick={handleBuyNow}
                    className="bg-white text-black font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-shadow flex items-center justify-center gap-2"
                  >
                    <Zap size={18} fill="currentColor" />
                    <span>Buy Now</span>
                  </MagneticButton>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
