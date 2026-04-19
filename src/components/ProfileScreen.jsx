import React from 'react';
import { motion } from 'framer-motion';
import { THEMES } from '../themes';

const ProfileCard = ({ theme, onClick, index }) => {
  const isDebbie = theme.id === 'unicorn';
  const isBubba = theme.id === 'werecat';
  const isMilo = theme.id === 'milo';
  const isLuna = theme.id === 'luna';

  const gradientClass = isDebbie ? 'from-pink-400 via-purple-500 to-indigo-500' :
                        isBubba ? 'from-teal-600 via-emerald-500 to-lime-500' :
                        isMilo ? 'from-blue-600 via-indigo-500 to-azure-500' :
                        'from-indigo-600 via-purple-500 to-pink-500';

  const avatarGradient = isDebbie ? 'from-pink-500 to-purple-500' :
                         isBubba ? 'from-teal-500 to-emerald-500' :
                         isMilo ? 'from-blue-500 to-indigo-500' :
                         'from-indigo-500 to-purple-500';

  const ringColor = isDebbie ? 'ring-pink-500/30' :
                    isBubba ? 'ring-teal-500/30' :
                    isMilo ? 'ring-blue-500/30' :
                    'ring-indigo-500/30';

  const nameGradient = isDebbie ? 'from-pink-300 to-purple-300' :
                       isBubba ? 'from-teal-300 to-emerald-300' :
                       isMilo ? 'from-blue-300 to-indigo-300' :
                       'from-indigo-300 to-purple-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(theme.id)}
      className={`relative group cursor-pointer w-full max-w-[280px] rounded-[3rem] p-1 bg-gradient-to-br ${gradientClass} shadow-2xl overflow-hidden shrink-0`}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[3rem]" />
      <div className="bg-slate-900 rounded-[2.9rem] flex flex-col items-center p-6 h-full min-h-[280px] sm:min-h-[360px]">
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr ${avatarGradient} p-1.5 mb-4 sm:mb-6 shadow-inner ring-4 ${ringColor}`}>
          <img
            src={theme.mascotImg}
            alt={theme.mascotAlt}
            className={`w-full h-full object-contain ${theme.glowClass} p-2`}
            onError={(e) => {
              e.target.src = '/assets/unicorn_queen.png';
              e.target.className = 'w-full h-full object-contain p-2';
            }}
          />
        </div>
        <h2 className={`text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${nameGradient} mb-1 text-center group-hover:brightness-125 transition-all duration-300`}>
          {theme.name}
        </h2>
        <p className="text-white/40 font-bold tracking-wide uppercase text-[10px] mb-3 sm:mb-4 text-center">
          {theme.tagline}
        </p>
        <div className="mt-auto px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 font-bold group-hover:bg-white group-hover:text-slate-900 transition-colors">
          Select
        </div>
      </div>
    </motion.div>
  );
};

const ProfileScreen = ({ onSelectProfile, onOpenParentDashboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-50 overflow-y-auto overflow-x-hidden"
    >
      <button 
        onClick={onOpenParentDashboard}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 border border-white/10 z-[60]"
      >
        <span className="text-xl">📊</span>
        <span className="hidden sm:inline text-xs uppercase tracking-widest">Dashboard</span>
      </button>

      {/* Scrollable content wrapper */}
      <div className="flex flex-col items-center w-full min-h-full py-8 sm:py-12 px-4 sm:px-8">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 sm:mb-12 pt-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2">
            Who is Playing?
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mx-auto rounded-full" />
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
