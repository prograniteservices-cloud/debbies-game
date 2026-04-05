import React from 'react';
import { motion } from 'framer-motion';

const ProfileScreen = ({ onSelectProfile, onOpenParentDashboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-50 p-6"
    >
      <button 
        onClick={onOpenParentDashboard}
        className="absolute top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 border border-white/20 z-50"
      >
        <span className="text-xl">📊</span>
        <span className="hidden sm:inline">Parent Dashboard</span>
      </button>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-12 text-center drop-shadow-sm"
      >
        Who is Playing?
      </motion.h1>

      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-4xl justify-center items-center">
        {/* Debbie's Card */}
        <motion.div
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectProfile('debbie')}
          className="relative group cursor-pointer w-full sm:w-1/2 max-w-sm rounded-[3rem] p-1 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[3rem]" />
          <div className="bg-slate-900 rounded-[2.9rem] flex flex-col items-center p-8 h-full">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 p-2 mb-6 shadow-inner ring-4 ring-pink-500/30">
              <img
                src="/avatars/debbie_unicorn_avatar_1775357686614.png"
                alt="Debbie Avatar"
                className="w-full h-full object-cover rounded-full mix-blend-screen bg-black"
                onError={(e) => {
                  e.target.src = '/assets/unicorn_queen.png';
                  e.target.className = 'w-full h-full object-contain p-2';
                }}
              />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-2 group-hover:from-pink-200 group-hover:to-purple-200 transition-all duration-300">
              Debbie
            </h2>
            <p className="text-pink-200/80 font-bold tracking-wide uppercase text-sm mb-4">
              Unicorn Island
            </p>
            <div className="mt-auto px-6 py-2 rounded-full bg-pink-500/20 border border-pink-500/50 text-pink-300 font-bold group-hover:bg-pink-500 group-hover:text-white transition-colors">
              Play!
            </div>
          </div>
        </motion.div>

        {/* Bubba's Card */}
        <motion.div
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectProfile('bubba')}
          className="relative group cursor-pointer w-full sm:w-1/2 max-w-sm rounded-[3rem] p-1 bg-gradient-to-br from-orange-400 via-amber-500 to-teal-500 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[3rem]" />
          <div className="bg-slate-900 rounded-[2.9rem] flex flex-col items-center p-8 h-full">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-orange-500 to-teal-500 p-2 mb-6 shadow-inner ring-4 ring-orange-500/30">
              <img
                src="/avatars/bubba_werecat_avatar_1775357700932.png"
                alt="Bubba Avatar"
                className="w-full h-full object-cover rounded-full mix-blend-screen bg-black"
                onError={(e) => {
                  e.target.src = '/assets/werecat_king.png';
                  e.target.className = 'w-full h-full object-contain p-2';
                }}
              />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-teal-300 mb-2 group-hover:from-orange-200 group-hover:to-teal-200 transition-all duration-300">
              Bubba
            </h2>
            <p className="text-orange-200/80 font-bold tracking-wide uppercase text-sm mb-4">
              Werecat Kingdom
            </p>
            <div className="mt-auto px-6 py-2 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
              Play!
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileScreen;
