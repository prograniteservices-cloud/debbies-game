import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export default function SummaryScreen({ correct, incorrect, onNext, onRetry }) {
  // Star rating calculation: 
  // 5 stars: 0 mistakes
  // 4 stars: 1 mistake
  // 3 stars: 2 mistakes
  // 2 stars: 3 mistakes
  // 1 star: 4+ mistakes
  const starCount = Math.max(1, 5 - incorrect);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
    >
      <div className="clay-card !bg-white/95 p-6 sm:p-8 w-full max-w-md flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-5" />
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="mb-6"
        >
          <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-lg" />
        </motion.div>

        <h2 className="text-4xl font-black text-slate-800 mb-2 font-heading tracking-tight">Well Done!</h2>
        <p className="text-xl text-slate-500 mb-8 font-bold">You completed the level!</p>

        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 + 0.5, type: "spring" }}
            >
              <Star 
                className={`w-8 h-8 sm:w-10 sm:h-10 ${i < starCount ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'} drop-shadow-sm`} 
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full mb-6 sm:mb-10">
          <div className="clay-card !rounded-2xl !p-3 sm:!p-4 !bg-emerald-50/50 border-emerald-100/50">
            <p className="text-emerald-500 font-black text-2xl sm:text-3xl font-heading">{correct}</p>
            <p className="text-emerald-800 font-bold text-xs sm:text-sm uppercase font-heading">Correct</p>
          </div>
          <div className="clay-card !rounded-2xl !p-3 sm:!p-4 !bg-rose-50/50 border-rose-100/50">
            <p className="text-rose-500 font-black text-2xl sm:text-3xl font-heading">{incorrect}</p>
            <p className="text-rose-800 font-bold text-xs sm:text-sm uppercase font-heading">Mistakes</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-auto">
          {onRetry && (
            <button 
              onClick={onRetry}
              className="clay-button flex-1 !bg-slate-100 !text-slate-600 !py-3 sm:!py-4 !text-lg sm:!text-xl !border-2"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> RETRY
            </button>
          )}
          <button 
            onClick={onNext}
            className="clay-button flex-[2] !bg-pink-400 !py-3 sm:!py-4 !text-lg sm:!text-xl !border-2 shadow-lg"
          >
            NEXT <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
