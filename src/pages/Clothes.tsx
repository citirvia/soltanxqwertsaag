import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

export default function Clothes() {
  const { products, viewProduct } = useStore();

  return (
    <div className="min-h-screen bg-soltan-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto mb-16 text-center">
            <motion.h1 
                className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                The Collection
            </motion.h1>
            <div className="w-24 h-1 bg-soltan-cyan mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  onOpenModal={viewProduct}
                  layout="grid"
                />
            ))}
        </div>
      </main>
    </div>
  );
}
