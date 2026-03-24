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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
    >
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border-8 border-yellow-400 p-8 sm:p-12 w-full max-w-md flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="mb-6"
        >
          <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-lg" />
        </motion.div>

        <h2 className="text-4xl font-black text-indigo-900 dark:text-indigo-100 mb-2">Well Done!</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 font-bold">You completed the level!</p>

        <div className="flex gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 + 0.5, type: "spring" }}
            >
              <Star 
                className={`w-10 h-10 ${i < starCount ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'} drop-shadow-sm`} 
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 w-full mb-10">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-3xl border-b-4 border-green-300 dark:border-green-800">
            <p className="text-green-600 dark:text-green-400 font-black text-3xl">{correct}</p>
            <p className="text-green-800 dark:text-green-200 font-bold text-sm uppercase">Correct</p>
          </div>
          <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-3xl border-b-4 border-rose-300 dark:border-rose-800">
            <p className="text-rose-600 dark:text-rose-400 font-black text-3xl">{incorrect}</p>
            <p className="text-rose-800 dark:text-rose-200 font-bold text-sm uppercase">Mistakes</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {onRetry && (
            <button 
              onClick={onRetry}
              className="flex-1 px-6 py-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xl font-black flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors shadow-sm"
            >
              <RotateCcw className="w-6 h-6" /> RETRY
            </button>
          )}
          <button 
            onClick={onNext}
            className="flex-[2] px-6 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl text-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-200 dark:shadow-none border-b-4 border-pink-600 active:border-b-0 active:translate-y-1 transition-all"
          >
            NEXT <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
