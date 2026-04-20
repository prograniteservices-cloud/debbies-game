import { motion } from 'framer-motion';
import { BarChart2, Check } from 'lucide-react';
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
      whileHover={{ scale: 1.05, y: -10, rotateY: 10, rotateX: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(theme.id)}
      className="relative group cursor-pointer w-full max-w-[280px] shrink-0 perspective-1000"
    >
      <div className="clay-card h-full min-h-[280px] sm:min-h-[360px] flex flex-col items-center p-6 relative overflow-hidden group-hover:border-white transition-all">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-5 group-hover:opacity-10 transition-opacity`} />
        
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full clay-card p-1.5 mb-4 sm:mb-6 flex items-center justify-center bg-white shadow-lg`}>
          <img
            src={theme.mascotImg}
            alt={theme.mascotAlt}
            className={`w-full h-full object-contain ${theme.glowClass} p-2 group-hover:scale-110 transition-transform`}
            onError={(e) => {
              e.target.src = '/assets/unicorn_queen.png';
              e.target.className = 'w-full h-full object-contain p-2';
            }}
          />
        </div>
        
        <h2 className={`text-xl sm:text-2xl font-black text-slate-800 mb-1 text-center font-heading`}>
          {theme.name}
        </h2>
        
        <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px] mb-3 sm:mb-4 text-center">
          {theme.tagline}
        </p>
        
        <div className="mt-auto w-full">
          <div className="clay-button !py-2 !text-sm !shadow-md group-hover:!shadow-lg transition-all" style={{ '--button-bg': `var(--color-${theme.id}-primary, #7a5fff)` }}>
            <Check className="w-4 h-4 mr-2" /> Select
          </div>
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
