import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

/**
 * Shared level-complete overlay used across ALL game modes.
 * 
 * Props:
 *  - show: boolean
 *  - title: string  (e.g. "Magical! ✨")
 *  - subtitle: string  (e.g. "Level Complete!")
 *  - emoji: string  (big celebratory emoji, e.g. "🌟")
 *  - stars: number  (1-5, default 3)
 *  - score: number | null
 *  - theme: theme object
 *  - onNext: () => void
 *  - onRetry: (() => void) | null
 *  - nextLabel: string  (default "NEXT")
 */
export default function LevelCompleteOverlay({
  show,
  title,
  subtitle = 'Level Complete!',
  emoji = '🌟',
  stars = 3,
  score = null,
  theme,
  onNext,
  onRetry = null,
  nextLabel = 'NEXT',
}) {
  const { width, height } = useWindowSize();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="level-complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
        >
          {/* Confetti! */}
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.25}
            colors={['#f9a8d4', '#c084fc', '#818cf8', '#fbbf24', '#34d399', '#fb7185']}
          />

          <motion.div
            initial={{ scale: 0.6, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -40, opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 180 }}
            className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border-8 border-yellow-400 p-8 sm:p-12 w-full max-w-sm flex flex-col items-center text-center"
          >
            {/* Emoji bounce */}
            <motion.div
              animate={{ y: [0, -16, 0], rotate: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-8xl mb-4 select-none"
            >
              {emoji}
            </motion.div>

            {/* Title */}
            <h2
              className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${
                theme?.titleGradient || 'from-pink-500 to-purple-600'
              } mb-1 leading-tight`}
            >
              {title}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-bold mb-6">{subtitle}</p>

            {/* Stars */}
            <div className="flex gap-2 mb-5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.12 + 0.3, type: 'spring' }}
                >
                  <Star
                    className={`w-9 h-9 drop-shadow-sm ${
                      i < stars
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Score (optional) */}
            {score !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-8 py-3 rounded-2xl mb-7 border border-purple-200 dark:border-purple-700"
              >
                <span className="text-3xl font-black text-purple-600 dark:text-purple-300">
                  +{score} pts
                </span>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 px-6 py-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-lg font-black flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" /> RETRY
                </button>
              )}
              <button
                onClick={onNext}
                className={`flex-[2] px-6 py-4 bg-gradient-to-r ${
                  theme?.mathBtn || 'from-pink-400 to-purple-500'
                } text-white rounded-2xl text-lg font-black flex items-center justify-center gap-2 shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all cursor-pointer`}
              >
                {nextLabel} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
