import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../audio/soundEngine';

const UNICORN_ITEMS = ['🌟', '✨', '🎀', '🌸', '🍭', '🌈', '🦄', '💖', '🦋', '🎊'];
const WERECAT_ITEMS = ['⚡', '🐾', '🔥', '🦇', '🍖', '🦴', '💎', '🚀', '⭐', '🎈'];

export default function PoppingLevel({ theme, onComplete }) {
  const [items, setItems] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Generate 30 items
    const themeItems = theme?.id === 'werecat' ? WERECAT_ITEMS : UNICORN_ITEMS;
    const newItems = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      emoji: themeItems[Math.floor(Math.random() * themeItems.length)],
      popped: false,
      initialX: Math.random() * 80 + 10, // 10% to 90%
      initialY: Math.random() * 80 + 10,
      duration: Math.random() * 4 + 4, // 4 to 8s
      delay: Math.random() * 2, // 0 to 2s
      scale: Math.random() * 0.5 + 1.5, // 1.5 to 2.0 scale
    }));
    setItems(newItems);
  }, [theme]);

  useEffect(() => {
    if (timeLeft > 0 && !isDone) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isDone) {
      setIsDone(true);
    }
  }, [timeLeft, isDone]);

  const handlePop = (id) => {
    if (isDone) return;
    playSound('pop');
    setItems(prev => prev.map(item => item.id === id ? { ...item, popped: true } : item));
    setPoppedCount(prev => prev + 1);
    
    if (poppedCount + 1 >= 30) {
      setTimeout(() => playSound('sparkle'), 300);
      setIsDone(true);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      {/* Timer Header */}
      {!isDone && (
        <div className="absolute top-8 z-50 flex flex-col items-center">
          <div className="text-white text-5xl font-black drop-shadow-lg tracking-widest bg-black/30 px-8 py-4 rounded-full backdrop-blur-sm border-4 border-white/50">
            {timeLeft}s
          </div>
          <div className="text-white mt-4 text-2xl font-bold bg-white/20 px-6 py-2 rounded-full backdrop-blur-md">
            POP THE {theme?.id === 'werecat' ? 'CLAW TOYS' : 'SPARKLES'}!
          </div>
        </div>
      )}

      {/* Items Area */}
      <div className="absolute inset-0 z-10">
        {!isDone && items.map(item => (
          !item.popped && (
            <motion.div
              key={item.id}
              className="absolute text-5xl cursor-pointer select-none"
              style={{ left: `${item.initialX}%`, top: `${item.initialY}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: item.scale,
                opacity: 1,
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: "linear",
                delay: item.delay
              }}
              whileTap={{ scale: 0.8 }}
              onPointerDown={() => handlePop(item.id)}
            >
              {item.emoji}
            </motion.div>
          )
        ))}

        <AnimatePresence>
          {items.map(item => (
            item.popped && (
              <motion.div
                key={`burst-${item.id}`}
                className="absolute text-5xl pointer-events-none"
                style={{ left: `${item.initialX}%`, top: `${item.initialY}%` }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                ✨
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* End Screen */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border-8 border-current text-center max-w-md w-full mx-4 flex flex-col items-center"
            style={{ borderColor: theme?.id === 'werecat' ? '#F97316' : '#EC4899' }}
          >
            <h2 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
              TIME'S UP!
            </h2>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">
              You popped {poppedCount} / 30 items! 🎉
            </div>
            
            <div className="text-6xl mb-8">
              {poppedCount >= 20 ? '🌟' : '👍'}
            </div>

            <button
              onClick={onComplete}
              className="w-full py-4 text-2xl font-black text-white rounded-full bg-gradient-to-r from-green-400 to-emerald-600 shadow-lg hover:scale-105 active:scale-95 transition-all border-b-8 border-green-700 active:border-b-0 active:translate-y-2 cursor-pointer"
            >
              CONTINUE!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
