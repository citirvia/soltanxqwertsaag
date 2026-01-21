import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function ProductList() {
  const { products, viewProduct } = useStore();
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <section id="products" className="py-32 px-4 md:px-12 bg-soltan-black min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-400 mb-4">NO PRODUCTS FOUND</h2>
          <p className="text-gray-500">The vault is currently empty.</p>
        </div>
      </section>
    );
  }

  const topSellers = products.filter(p => (p.collections || []).includes('Top Sellers'));
  const fullCollection = products;

  return (
    <section id="products" className="py-32 px-4 md:px-12 bg-soltan-black relative z-20">
        <div className="max-w-7xl mx-auto mb-16">
            <motion.h2 
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                THE ELITE
            </motion.h2>
            <div className="w-24 h-1 bg-soltan-cyan" />
        </div>

        {/* Top Sellers: horizontal scroll */}
        <div className="max-w-7xl mx-auto mb-24 overflow-x-auto flex gap-8 pb-4 custom-scrollbar">
            {topSellers.map((product, index) => (
              <div key={product.id} className="min-w-[280px] md:min-w-[360px]">
                <ProductCard 
                  product={product} 
                  index={index} 
                  onOpenModal={viewProduct}
                />
              </div>
            ))}
        </div>

        <div className="max-w-7xl mx-auto mb-16">
            <motion.h2 
                className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                THE DYNASTY
            </motion.h2>
            <div className="w-24 h-1 bg-soltan-cyan" />
        </div>

        {/* Full Collection grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16">
            {fullCollection.slice(0, 4).map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  onOpenModal={viewProduct}
                />
            ))}
        </div>

        <div className="flex justify-center pb-16">
            <button 
                onClick={() => navigate('/clothes')}
                className="group flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
                See More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </section>
  );
}
