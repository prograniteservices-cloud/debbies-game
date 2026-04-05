import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NumberButton from '../NumberButton';
import MagicalEffects from '../MagicalEffects';
import SummaryScreen from '../SummaryScreen';
import { playSound } from '../../audio/soundEngine';
import { generateMissingProblem, generateDistractors } from '../../utils/mathEngine';

export default function NumberMagnet({ levelInfo, onLevelComplete, theme }) {
  const [problem, setProblem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const startRound = () => {
    const prob = generateMissingProblem(levelInfo.level);
    const distractors = generateDistractors(prob.missingValue, 2, levelInfo.level);
    const allChoices = [prob.missingValue, ...distractors].sort(() => Math.random() - 0.5);
    
    setProblem(prob);
    setChoices(allChoices);
    setWrongAnswers(new Set());
    setShowSuccess(false);
    setShowSummary(false);
  };

  useEffect(() => { startRound(); }, [levelInfo.level]);

  const handleChoice = (num) => {
    if (!problem || showSuccess) return;
    if (num === problem.missingValue) {
      playSound('sparkle');
      setShowSuccess(true);
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      const willLevelUp = (levelInfo.score + 1) % 5 === 0;
      setTimeout(() => {
        if (willLevelUp) setShowSummary(true);
        else { onLevelComplete(); startRound(); }
      }, 1200);
    } else {
      playSound('fail');
      setWrongAnswers(prev => new Set(prev).add(num));
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
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
            <div className="bg-blue-400 text-white text-4xl sm:text-6xl font-black px-12 py-8 rounded-full shadow-[0_0_100px_rgba(96,165,250,0.8)] border-8 border-white animate-bounce whitespace-nowrap">
              Magnetic! 🧲
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-y-auto">
        <motion.div
          key={problem.fullEquation}
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex flex-col items-center gap-3 p-8"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-xl">🧲</span> Fill in the blank!
          </p>
          <div className={`text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme?.titleGradient || 'from-blue-400 to-indigo-500'}`}>
            {showSuccess ? problem.fullEquation.replace('___', problem.missingValue) : problem.fullEquation}
          </div>
        </motion.div>
      </div>

      <div className="w-full shrink-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-t-8 border-white/80 dark:border-slate-700 flex justify-center items-center gap-6 sm:gap-12 py-12 px-4 rounded-t-[3rem]">
        {choices.map(num => (
          <NumberButton key={num} number={num} isWrong={wrongAnswers.has(num)} onClick={handleChoice} />
        ))}
      </div>
    </div>
  );
}
