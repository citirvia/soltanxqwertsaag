import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CrownLogo } from '../components/CrownLogo';
import { useStore } from '../context/StoreContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoadingAdmin, isAdmin } = useStore();

  useEffect(() => {
    // Check if already logged in via global store state
    if (!isLoadingAdmin && isAdmin) {
        navigate('/vault-x921-soltan-private-access/dashboard');
    }
  }, [isLoadingAdmin, isAdmin, navigate]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        console.log('Attempting login with:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error);
            setError(error.message);
        } else {
            console.log('Login successful:', data);
            navigate('/vault-x921-soltan-private-access/dashboard');
        }
    } catch (err) {
        console.error('Unexpected login error:', err);
        setError('An unexpected error occurred.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soltan-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-gradient-radial from-soltan-midnight to-soltan-black opacity-50" />
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" 
             style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
             }} 
        />

        <motion.div 
            className="relative z-10 w-full max-w-md bg-soltan-gray/50 backdrop-blur-xl border border-white/5 p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex justify-center mb-8">
                <CrownLogo className="w-16 h-16 text-white" />
            </div>
            
            <h2 className="text-center text-sm font-mono tracking-[0.3em] text-white/50 mb-12 uppercase">
                Restricted Access // Level 5
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ADMIN EMAIL"
                        className="w-full bg-black/40 border border-white/10 p-4 text-center text-white placeholder-white/30 tracking-[0.2em] font-mono focus:outline-none focus:border-soltan-purple transition-colors mb-4"
                        disabled={loading}
                    />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="ACCESS KEY"
                        className="w-full bg-black/40 border border-white/10 p-4 text-center text-white placeholder-white/30 tracking-[0.2em] font-mono focus:outline-none focus:border-soltan-purple transition-colors"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs text-center font-mono tracking-wider uppercase bg-red-500/10 p-2 border border-red-500/20"
                    >
                        {error}
                    </motion.div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold uppercase tracking-[0.2em] py-4 hover:bg-soltan-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
                    Unauthorized access attempts are logged and reported.
                </p>
            </div>
        </motion.div>
    </div>
  );
}
