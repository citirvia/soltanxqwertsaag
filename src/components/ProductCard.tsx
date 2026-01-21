import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  index: number;
  onOpenModal: (product: Product) => void;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, index, onOpenModal, layout = 'list' }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className={`relative group ${layout === 'list' && index % 2 !== 0 ? 'md:mt-24' : ''}`}
    >
      <div
        className="relative bg-black border border-white/10 p-6 overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer"
        onClick={() => onOpenModal(product)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-black/50 mb-6">
            <motion.img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out"
                whileHover={{ scale: 1.1 }}
            />
            {/* NEW Tag */}
            {product.isNew && (
            <div className="absolute top-3 left-3 z-30 px-2 py-1 text-[10px] uppercase tracking-widest border border-soltan-purple text-soltan-purple bg-black/50 backdrop-blur-sm rounded-sm animate-pulse">
                NEW
            </div>
            )}
            {/* Top Seller Badge */}
            {product.collections?.includes('Top Sellers') && (
            <div className="absolute top-3 right-3 z-30 px-2 py-1 text-[10px] uppercase tracking-widest text-white bg-gradient-to-r from-gray-300 to-white/80 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Best Choice
            </div>
            )}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Specs Overlay (Racing Dashboard Look) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 font-mono text-xs text-white border-t border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <span className="block text-chrome text-[10px]">MAT</span>
                        {product.specs.material}
                    </div>
                    <div>
                        <span className="block text-chrome text-[10px]">WGT</span>
                        {product.specs.weight}
                    </div>
                    <div>
                        <span className="block text-chrome text-[10px]">RES</span>
                        {product.specs.resistance}
                    </div>
                </div>
            </div>
        </div>

        {/* Info */}
        <div className="relative z-10 flex justify-between items-end transform translate-z-20">
            <div>
                <h3 className="text-soltan-purple font-mono text-xs uppercase tracking-widest mb-1">{product.category}</h3>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-white group-hover:text-chrome transition-colors">{product.name}</h2>
            </div>
            <div className="text-right">
                <span className="block text-white font-mono font-bold">{formatPrice(product.price)}</span>
            </div>
        </div>

        {/* View Details Overlay (Reveals on Hover) */}
        <div 
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 group-hover:delay-0 pointer-events-none bg-black/60"
        >
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(product);
                }}
                className="pointer-events-auto z-50 px-10 py-5 bg-white text-black font-bold font-mono text-sm tracking-[0.2em] uppercase hover:bg-soltan-cyan transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] transform hover:scale-105 duration-300"
            >
                View Details
            </button>
        </div>
      </div>
    </motion.div>
  );
}
