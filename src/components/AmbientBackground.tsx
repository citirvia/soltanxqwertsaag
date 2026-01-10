export const AmbientBackground = () => {
  return (
    <>
      {/* Living Atmosphere: Deep Space Nebula */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#000000]">
        {/* Deep Violet Nebula Pulse */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-slow-spin opacity-40 blur-[100px]"
             style={{
               background: 'conic-gradient(from 0deg at 50% 50%, #000000 0deg, #1a0b2e 60deg, #2D004F 120deg, #000000 180deg, #1a0b2e 240deg, #2D004F 300deg, #000000 360deg)'
             }}
        />
        
        {/* Secondary Electric Purple Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(76,29,149,0.15),transparent_60%)] animate-pulse-slow" />
        
        {/* Subtle Mesh */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_80%,rgba(45,0,79,0.2),transparent_50%)]" />
      </div>

      {/* Film Grain Overlay - Noise Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[9999] mix-blend-overlay" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             animation: 'shift-noise 1s steps(10) infinite'
           }}>
      </div>
      <style>{`
        @keyframes shift-noise {
          0% { transform: translate(0,0); }
          10% { transform: translate(-5%,-5%); }
          20% { transform: translate(-10%,5%); }
          30% { transform: translate(5%,-10%); }
          40% { transform: translate(-5%,15%); }
          50% { transform: translate(-10%,5%); }
          60% { transform: translate(15%,0); }
          70% { transform: translate(0,10%); }
          80% { transform: translate(-15%,0); }
          90% { transform: translate(10%,5%); }
          100% { transform: translate(5%,0); }
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 30s linear infinite;
        }
      `}</style>
    </>
  );
};
