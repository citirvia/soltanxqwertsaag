import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CrownLogo } from './CrownLogo';

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 4.5 seconds intro
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative w-32 h-32 md:w-48 md:h-48">
            <div className="absolute inset-0 bg-soltan-purple blur-[60px] opacity-20 animate-pulse"></div>
            <CrownLogo className="w-full h-full text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>
        
        <motion.h1
            className="mt-8 text-2xl md:text-4xl font-bold tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white font-mono uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
        >
            Soltan
        </motion.h1>

        <motion.div 
            className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-soltan-cyan to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 2.5, duration: 1.5, ease: "circOut" }}
        />
      </div>
      
      {/* Smoke/Fog Effect (Simulated with CSS gradients/blur) */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-soltan-black to-transparent opacity-80"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 3, ease: "easeOut" }}
      />
    </motion.div>
  );
}
