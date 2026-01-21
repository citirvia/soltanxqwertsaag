import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from './MagneticButton';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Gradient / Mesh */}
      <motion.div 
        className="absolute inset-0 bg-soltan-black"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.3),_rgba(0,0,0,1))]" />
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-black/20 to-soltan-black" />
        
        {/* Animated Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] animate-slow-spin opacity-40 mix-blend-screen">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-soltan-purple rounded-full blur-[120px]" />
             <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-soltan-cyan rounded-full blur-[100px]" />
        </div>
      </motion.div>

      {/* Glitch Overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.15] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
            <h2 className="text-sm md:text-xl font-mono tracking-[0.5em] text-chrome mb-4">EST. 2026 // RACING HERITAGE</h2>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase text-white mix-blend-difference relative">
                <span className="block overflow-hidden">
                    <motion.span 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 1, ease: [0.76, 0, 0.24, 1] }}
                        className="block"
                    >
                        Soltan
                    </motion.span>
                </span>
                <span className="block overflow-hidden text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                     <motion.span 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
                        className="block"
                    >
                        Store
                    </motion.span>
                </span>
            </h1>
        </motion.div>

        <motion.div 
            className="mt-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
        >
            <MagneticButton 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-12 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-[0.2em] overflow-hidden hover:border-soltan-purple/50 transition-colors shadow-[0_0_30px_rgba(176,38,255,0.3)] hover:shadow-[0_0_50px_rgba(176,38,255,0.6)]"
            >
                <span className="relative z-10 group-hover:text-white transition-colors">Enter Collection</span>
                <div className="absolute inset-0 bg-soltan-purple/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out" />
            </MagneticButton>
            
            <div className="mt-8 animate-bounce text-white/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
