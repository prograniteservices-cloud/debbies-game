import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CountingLevel from './components/CountingLevel';
import SpellingGame from './components/SpellingGame';
import CursorSparkles from './components/CursorSparkles';

function App() {
  const [gameState, setGameState] = useState('LANDING'); // LANDING, COUNTING, SPELLING
  const [levelInfo, setLevelInfo] = useState({ level: 1, score: 0 });

  const handleStartGame = (game) => {
    setGameState(game);
  };

  const handleLevelComplete = () => {
    setLevelInfo(prev => {
      const newScore = prev.score + 1;
      const newLevel = Math.floor(newScore / 5) + 1; // Level up every 5 correct answers
      return { score: newScore, level: newLevel };
    });
  };

  const bgTheme = useMemo(() => {
    const themes = [
      'from-sky-200 via-pink-100 to-indigo-200 dark:from-slate-900 dark:via-purple-900/40 dark:to-indigo-950', // Level 1
      'from-fuchsia-200 via-rose-100 to-amber-100 dark:from-purple-900 dark:via-pink-900/40 dark:to-rose-950', // Level 2
      'from-teal-200 via-emerald-100 to-cyan-200 dark:from-teal-900 dark:via-emerald-900/40 dark:to-cyan-950', // Level 3
      'from-violet-300 via-fuchsia-200 to-pink-300 dark:from-indigo-900 dark:via-violet-900/40 dark:to-fuchsia-950', // Level 4
      'from-amber-200 via-yellow-100 to-orange-200 dark:from-amber-900 dark:via-orange-900/40 dark:to-red-950' // Level 5+
    ];
    return themes[(levelInfo.level - 1) % themes.length];
  }, [levelInfo.level]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${bgTheme} overflow-hidden relative font-sans text-slate-800 dark:text-slate-100 selection:bg-pink-300 transition-colors duration-[3000ms]`}>
      <CursorSparkles />
      <AnimatePresence mode="wait">
        {gameState === 'LANDING' && (
          <motion.div
            key="landing"
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center gap-6 z-10 w-full px-4"
          >
            <div className="p-8 sm:p-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-[3rem] shadow-2xl border-4 border-pink-300 dark:border-pink-500 max-w-lg w-full transform transition-all hover:scale-105">
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Sparkles className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
                </motion.div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4 text-center leading-tight tracking-tight">
                Unicorn Island
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-bold text-center mb-8">
                Magical Learning Awaits! ✨
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <button
                  onClick={() => handleStartGame('COUNTING')}
                  className="px-6 py-4 bg-gradient-to-r from-teal-400 to-emerald-500 text-white rounded-full text-xl font-black shadow-xl border-b-8 border-teal-600 active:border-b-0 active:translate-y-2 transition-all cursor-pointer w-full tracking-wide"
                >
                  Numbers Base
                </button>
                <button
                  onClick={() => handleStartGame('SPELLING')}
                  className="px-6 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full text-xl font-black shadow-xl border-b-8 border-pink-600 active:border-b-0 active:translate-y-2 transition-all cursor-pointer w-full tracking-wide"
                >
                  Spelling Quest
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'COUNTING' && (
          <motion.div
            key="counting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full bg-gradient-to-b from-sky-200 to-indigo-200 dark:from-slate-900 dark:to-indigo-950"
          >
             <CountingLevel levelInfo={levelInfo} onLevelComplete={handleLevelComplete} />
          </motion.div>
        )}

        {gameState === 'SPELLING' && (
          <motion.div
            key="spelling"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full"
          >
             <SpellingGame onBack={() => setGameState('LANDING')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
