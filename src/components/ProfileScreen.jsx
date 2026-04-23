import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Check } from 'lucide-react';
import { THEMES } from '../themes';
import { playTheme } from '../audio/soundEngine';

const ProfileCard = ({ theme, onClick, index }) => {
  const isDebbie = theme.id === 'unicorn';
  const isBubba = theme.id === 'werecat';
  const isMilo = theme.id === 'milo';
  const isLuna = theme.id === 'luna';

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: y * -20 });
  };

  const gradientClass = isDebbie ? 'from-pink-400 via-purple-500 to-indigo-500' :
                        isBubba ? 'from-teal-600 via-emerald-500 to-lime-500' :
                        isMilo ? 'from-blue-600 via-indigo-500 to-azure-500' :
                        'from-indigo-600 via-purple-500 to-pink-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      onClick={() => onClick(theme.id)}
      style={{
        rotateX: mousePos.y,
        rotateY: mousePos.x,
        transformStyle: "preserve-3d"
      }}
      className="relative group cursor-pointer w-full max-w-[280px] shrink-0 perspective-1000"
    >
      <div className="glass-card h-full min-h-[280px] sm:min-h-[360px] flex flex-col items-center p-6 relative overflow-hidden transition-all duration-300 shadow-2xl border border-white/40">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        
        <div 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full glass-card p-1 mb-4 sm:mb-6 flex items-center justify-center bg-white/50 shadow-xl border border-white/50"
          style={{ transform: 'translateZ(30px)' }}
        >
          <img
            src={theme.mascotImg}
            alt={theme.mascotAlt}
            className={`w-full h-full object-contain ${theme.glowClass} p-2 group-hover:scale-110 transition-transform duration-500`}
            onError={(e) => {
              e.target.src = '/assets/unicorn_queen.png';
              e.target.className = 'w-full h-full object-contain p-2';
            }}
          />
        </div>
        
        <div style={{ transform: 'translateZ(40px)' }} className="flex flex-col items-center w-full">
          <h2 className={`text-2xl sm:text-3xl font-black text-slate-800 mb-1 text-center font-heading drop-shadow-md`}>
            {theme.name}
          </h2>
          
          <p className="text-slate-600 font-bold tracking-wide uppercase text-[10px] sm:text-xs mb-4 sm:mb-6 text-center bg-white/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/30">
            {theme.tagline}
          </p>
        </div>
        
        <div className="mt-auto w-full" style={{ transform: 'translateZ(20px)' }}>
          <div className="clay-button !py-3 !text-sm !shadow-xl group-hover:!shadow-2xl transition-all" style={{ '--button-bg': `var(--color-${theme.id}-primary, #7a5fff)` }}>
            <Check className="w-5 h-5 mr-2" /> Play Now
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProfileScreen = ({ onSelectProfile, onOpenParentDashboard }) => {
  useEffect(() => {
    playTheme('landing');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center z-50 overflow-y-auto overflow-x-hidden"
    >
      <div className="aurora-bg">
        <div className="aurora-blob bg-pink-100 -top-20 -left-20 opacity-60" />
        <div className="aurora-blob bg-purple-100 top-1/2 -right-20 opacity-60" style={{ animationDelay: '-5s' }} />
        <div className="aurora-blob bg-blue-100 -bottom-20 left-1/2 opacity-60" style={{ animationDelay: '-10s' }} />
      </div>
      <button 
        onClick={onOpenParentDashboard}
        className="clay-button fixed top-4 right-4 sm:top-6 sm:right-6 !px-4 !py-2 !bg-slate-100 !text-slate-600 !border-2 z-[60]"
      >
        <BarChart2 className="w-4 h-4" />
        <span className="hidden sm:inline text-xs uppercase tracking-widest ml-2">Dashboard</span>
      </button>

      {/* Scrollable content wrapper */}
      <div className="flex flex-col items-center w-full min-h-full py-8 sm:py-12 px-4 sm:px-8">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 sm:mb-12 pt-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-2 font-heading tracking-tight">
            Who is Playing?
          </h1>
          <div className="h-2 w-32 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mx-auto rounded-full shadow-inner" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl justify-items-center pb-8">
          {Object.values(THEMES).map((theme, index) => (
            <ProfileCard 
              key={theme.id} 
              theme={theme} 
              onClick={onSelectProfile}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileScreen;
