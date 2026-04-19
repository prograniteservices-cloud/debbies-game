import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import MagicalEffects from './MagicalEffects';
import LevelCompleteOverlay from './LevelCompleteOverlay';
import { playSound } from '../audio/soundEngine';

const PATTERNS = [
  // Level 1: Simple ABAB
  {
    sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'],
    options: ['🍎', '🍌', '🍇'],
    answer: '🍌'
  },
  // Level 2: Simple AABB
  {
    sequence: ['🐶', '🐶', '🐱', '🐱', '🐶'],
    options: ['🐱', '🐶', '🐭'],
    answer: '🐶'
  },
  // Level 3: ABCABC
  {
    sequence: ['🚗', '🚕', '🚙', '🚗', '🚕'],
    options: ['🚗', '🚙', '🚕'],
    answer: '🚙'
  },
  // Level 4: Color pattern
  {
    sequence: ['🔴', '🔵', '🟡', '🔴', '🔵'],
    options: ['🟡', '🟢', '🔴'],
    answer: '🟡'
  },
  // Level 5: Harder sequence
  {
    sequence: ['⭐', '🌙', '⭐', '⭐', '🌙', '⭐'],
    options: ['⭐', '🌙', '☀️'],
    answer: '⭐'
  }
];

export default function PatternPath({ onBack, theme, onComplete }) {
  const [level, setLevel] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [wrongShake, setWrongShake] = useState(null);

  const currentPattern = PATTERNS[level];

  const handleGuess = (guess) => {
    if (showReward) return;

    if (guess === currentPattern.answer) {
      playSound('ding');
      playSound('sparkle');
      setShowReward(true);
    } else {
      playSound('fail');
      setWrongShake(guess);
      setTimeout(() => setWrongShake(null), 500);
    }
  };

  const handleNext = () => {
    setShowReward(false);
    if (level < PATTERNS.length - 1) {
      setLevel(l => l + 1);
    } else {
      if (onComplete) onComplete();
      else onBack();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full p-4 relative overflow-hidden bg-gradient-to-br ${theme?.spellingBg || 'from-indigo-300 to-purple-400 dark:from-indigo-900 dark:to-purple-900'}`}>
      <MagicalEffects isCelebrating={showReward} />

      <LevelCompleteOverlay
        show={showReward}
        title="PERFECT!"
        subtitle={`Pattern ${level + 1} solved!`}
        emoji="🧩"
        stars={5}
        score={level * 10 + 10}
        theme={theme}
        onNext={handleNext}
      />
      
      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-md p-4 rounded-3xl z-20 shadow-lg border border-white/20">
        <button
          onClick={onBack}
          className="p-3 bg-white/80 dark:bg-slate-800 rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-4">
          <img
            src={theme?.mascotImg || '/assets/unicorn_queen.png'}
            alt="Mascot"
            className="w-12 h-12 object-contain drop-shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-black text-white drop-shadow-md tracking-wide">Pattern Path</h2>
            <p className="text-sm text-white/80 font-bold uppercase tracking-widest">Level {level + 1}/{PATTERNS.length}</p>
          </div>
        </div>
        <div className="flex bg-yellow-400/30 px-4 py-2 rounded-2xl items-center gap-2 border border-yellow-300/50">
          <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          <span className="text-xl font-black text-white">{level * 10}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl z-10 gap-8 sm:gap-12">
        <motion.h3 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-black text-white text-center drop-shadow-lg"
        >
          What comes next?
        </motion.h3>

        {/* Pattern Display */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 bg-white/20 dark:bg-black/20 p-4 sm:p-8 rounded-[3rem] shadow-2xl backdrop-blur-sm border-2 border-white/30">
          {currentPattern.sequence.map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              className="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-5xl shadow-xl border-b-4 border-slate-200 dark:border-slate-900"
            >
              {item}
            </motion.div>
          ))}
          
          <motion.div
            animate={showReward ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-5xl shadow-inner border-4 border-dashed transition-all
              ${showReward ? 'bg-green-400 border-green-200 shadow-xl border-solid' : 'bg-white/10 border-white/50'}
            `}
          >
            {showReward ? currentPattern.answer : <span className="text-white/50 opacity-50">?</span>}
          </motion.div>
        </div>

        {/* Options */}
        <div className="flex gap-4 sm:gap-8">
          {currentPattern.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.95 }}
              animate={wrongShake === option ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : {}}
              onClick={() => handleGuess(option)}
              className={`w-20 h-20 sm:w-28 sm:h-28 rounded-[2.5rem] bg-gradient-to-tr ${theme?.btnGradient || 'from-pink-400 to-purple-500'} flex items-center justify-center text-4xl sm:text-5xl shadow-2xl border-b-8 border-black/20 hover:border-b-4 hover:translate-y-1 transition-all cursor-pointer ring-4 ring-white/20`}
            >
              <div className="bg-white/20 w-full h-full rounded-[2.2rem] flex items-center justify-center">
                {option}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
