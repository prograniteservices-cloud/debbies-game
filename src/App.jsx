import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CountingLevel from './components/CountingLevel';
import SpellingGame from './components/SpellingGame';
import CursorSparkles from './components/CursorSparkles';
import { THEMES } from './themes';

function App() {
  const [gameState, setGameState] = useState('LANDING'); // LANDING, COUNTING, SPELLING
  const [levelInfo, setLevelInfo] = useState({ level: 1, score: 0 });
  const [themeId, setThemeId] = useState('unicorn'); // 'unicorn' | 'werecat'

  const theme = THEMES[themeId];

  const handleStartGame = (game) => {
    setGameState(game);
  };

  const handleLevelComplete = () => {
    setLevelInfo(prev => {
      const newScore = prev.score + 1;
      const newLevel = Math.floor(newScore / 5) + 1;
      return { score: newScore, level: newLevel };
    });
  };

  const bgTheme = useMemo(() => {
    return theme.bgThemes[(levelInfo.level - 1) % theme.bgThemes.length];
  }, [levelInfo.level, themeId]);

  const isWerecat = themeId === 'werecat';

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
            <div className={`p-8 sm:p-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-[3rem] shadow-2xl border-4 ${theme.cardBorder} max-w-lg w-full`}>

              {/* Theme Toggle */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-full p-1 gap-1 shadow-inner">
                  <button
                    onClick={() => setThemeId('unicorn')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black transition-all cursor-pointer ${
                      themeId === 'unicorn'
                        ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md scale-105'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    🦄 Girl
                  </button>
                  <button
                    onClick={() => setThemeId('werecat')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black transition-all cursor-pointer ${
                      themeId === 'werecat'
                        ? 'bg-gradient-to-r from-orange-400 to-teal-500 text-white shadow-md scale-105'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    ⚡ Boy
                  </button>
                </div>
              </div>

              {/* Mascot */}
              <div className="flex justify-center mb-4">
                <motion.div
                  key={themeId}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <AnimatePresence mode="wait">
                    {isWerecat ? (
                      <motion.img
                        key="werecat"
                        src="/assets/werecat_king.png"
                        alt="Werecat King"
                        className="w-28 h-28 object-contain drop-shadow-2xl"
                        style={{ mixBlendMode: 'multiply' }}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }, scale: { type: 'spring' } }}
                      />
                    ) : (
                      <motion.div
                        key="sparkles"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      >
                        <Sparkles className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.h1
                key={`title-${themeId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient} mb-3 text-center leading-tight tracking-tight`}
              >
                {theme.name}
              </motion.h1>

              <motion.p
                key={`tag-${themeId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-bold text-center mb-8"
              >
                {theme.tagline}
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <button
                  onClick={() => handleStartGame('COUNTING')}
                  className={`px-6 py-4 bg-gradient-to-r ${theme.mathBtn} text-white rounded-full text-xl font-black shadow-xl border-b-8 active:border-b-0 active:translate-y-2 transition-all cursor-pointer w-full tracking-wide`}
                >
                  Numbers Base
                </button>
                <button
                  onClick={() => handleStartGame('SPELLING')}
                  className={`px-6 py-4 bg-gradient-to-r ${theme.spellBtn} text-white rounded-full text-xl font-black shadow-xl border-b-8 active:border-b-0 active:translate-y-2 transition-all cursor-pointer w-full tracking-wide`}
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
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full"
          >
            <CountingLevel
              levelInfo={levelInfo}
              onLevelComplete={handleLevelComplete}
              onBack={() => setGameState('LANDING')}
              theme={theme}
            />
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
            <SpellingGame onBack={() => setGameState('LANDING')} theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
