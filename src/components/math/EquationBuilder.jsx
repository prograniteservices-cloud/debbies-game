import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberButton from '../NumberButton';
import MagicalEffects from '../MagicalEffects';
import SummaryScreen from '../SummaryScreen';
import { playSound } from '../../audio/soundEngine';
import { generateBuilderProblem } from '../../utils/mathEngine';

export default function EquationBuilder({ levelInfo, onLevelComplete, theme }) {
  const [problem, setProblem] = useState(null);
  const [slots, setSlots] = useState([null, null]);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const startRound = () => {
    const prob = generateBuilderProblem(levelInfo.level);
    
    setProblem(prob);
    setSlots([null, null]);
    setWrongAttempt(false);
    setShowSuccess(false);
    setShowSummary(false);
  };

  useEffect(() => { startRound(); }, [levelInfo.level]);

  const handleChoice = (num) => {
    if (!problem || showSuccess) return;
    
    const newSlots = [...slots];
    const emptyIndex = newSlots.findIndex(s => s === null);
    
    if (emptyIndex !== -1) {
      newSlots[emptyIndex] = num;
      setSlots(newSlots);
      playSound('pop');
      
      if (!newSlots.includes(null)) {
        checkAnswer(newSlots[0], newSlots[1]);
      }
    }
  };
  
  const handleRemoveSlot = (index) => {
    if (showSuccess) return;
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setWrongAttempt(false);
    playSound('pop');
  };

  const checkAnswer = (a, b) => {
    const isCorrect = problem.validPairs.some(pair => 
      (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a)
    );
    
    if (isCorrect) {
      playSound('sparkle');
      setShowSuccess(true);
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      const willLevelUp = (levelInfo.score + 1) % 5 === 0;
      setTimeout(() => {
        if (willLevelUp) setShowSummary(true);
        else { onLevelComplete(); startRound(); }
      }, 1500);
    } else {
      playSound('fail');
      setWrongAttempt(true);
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setTimeout(() => {
        setSlots([null, null]);
        setWrongAttempt(false);
      }, 1000);
    }
  };

  if (!problem) return null;

  return (
    <div className="flex flex-col items-center w-full h-full justify-between overflow-hidden">
      <AnimatePresence>
        {showSummary && (
          <SummaryScreen
            correct={sessionStats.correct}
            incorrect={sessionStats.incorrect}
            onNext={() => { setSessionStats({ correct: 0, incorrect: 0 }); onLevelComplete(); startRound(); }}
          />
        )}
      </AnimatePresence>
      <MagicalEffects isCelebrating={showSuccess} />
      
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-orange-400 text-white text-4xl sm:text-6xl font-black px-12 py-8 rounded-full shadow-[0_0_100px_rgba(251,146,60,0.8)] border-8 border-white animate-bounce whitespace-nowrap">
              Perfect Build! 🧱
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-y-auto">
        <motion.div
          key={problem.target}
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex flex-col items-center gap-6 p-8"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-xl">🧱</span> Build the Equation!
          </p>
          
          <div className="flex items-center gap-4 text-5xl sm:text-7xl font-extrabold text-slate-700 dark:text-slate-200">
            <Slot value={slots[0]} isWrong={wrongAttempt} onClick={() => handleRemoveSlot(0)} />
            <span className="text-amber-500">{problem.op}</span>
            <Slot value={slots[1]} isWrong={wrongAttempt} onClick={() => handleRemoveSlot(1)} />
            <span className="text-slate-400">=</span>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme?.titleGradient || 'from-amber-400 to-orange-500'}`}>
              {problem.target}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="w-full shrink-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-t-8 border-white/80 dark:border-slate-700 py-12 px-8 rounded-t-[3rem]">
        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-6">
          {problem.tilePool.map((num, i) => {
            const isUsed = slots.includes(num);
            return (
              <motion.button
                key={`${num}-${i}`}
                whileHover={!isUsed ? { scale: 1.1 } : {}}
                whileTap={!isUsed ? { scale: 0.9 } : {}}
                onClick={() => !isUsed && handleChoice(num)}
                disabled={isUsed}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl font-black transition-all ${
                  isUsed 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 shadow-inner' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-[0_8px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-2'
                }`}
              >
                {num}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

function Slot({ value, onClick, isWrong }) {
  return (
    <motion.div 
      onClick={value !== null ? onClick : undefined}
      animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[2rem] border-4 flex items-center justify-center text-4xl sm:text-5xl transition-all ${value !== null ? 'cursor-pointer' : ''} ${
        isWrong
          ? 'border-red-400 bg-red-100 dark:bg-red-900/30'
          : value !== null
            ? 'border-transparent bg-white dark:bg-slate-700 shadow-[0_8px_0_rgba(0,0,0,0.1)]'
            : 'border-dashed border-slate-300 dark:border-slate-600 bg-black/5 dark:bg-white/5'
      }`}
    >
      {value !== null && value}
    </motion.div>
  );
}
