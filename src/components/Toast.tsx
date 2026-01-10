import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Info } from 'lucide-react';

export default function Toast() {
  const { toast } = useStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-8 left-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          {toast.type === 'success' ? (
            <div className="p-2 bg-soltan-cyan/20 rounded-full text-soltan-cyan">
                <ShieldCheck className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 bg-soltan-purple/20 rounded-full text-soltan-purple">
                <Info className="w-5 h-5" />
            </div>
          )}
          
          <div className="flex flex-col">
            <span className="font-mono text-xs text-white/50 uppercase tracking-widest">Notification</span>
            <span className="font-bold text-white uppercase tracking-wide">{toast.message}</span>
          </div>

          <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/50 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
