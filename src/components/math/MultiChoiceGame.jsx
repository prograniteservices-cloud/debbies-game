import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItemGrid from '../ItemGrid';
import NumberButton from '../NumberButton';
import MagicalEffects from '../MagicalEffects';
import SummaryScreen from '../SummaryScreen';
import { playSound } from '../../audio/soundEngine';
import { generateProblem, generateDistractors } from '../../utils/mathEngine';

export default function MultiChoiceGame({ levelInfo, onLevelComplete, theme }) {
  const [problem, setProblem] = useState(null);
  const [choices, setChoices] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [iconSet, setIconSet] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const startRound = () => {
    const prob = generateProblem(levelInfo.level);
    const distractors = generateDistractors(prob.answer, 2, levelInfo.level);
    const allChoices = [prob.answer, ...distractors].sort(() => Math.random() - 0.5);
    const sets = theme?.iconSets || [];
    if (sets.length > 0) setIconSet(sets[Math.floor(Math.random() * sets.length)]);
    setProblem(prob);
    setChoices(allChoices);
    setWrongAnswers(new Set());
    setShowSuccess(false);
    setShowSummary(false);
  };

  useEffect(() => { startRound(); }, [levelInfo.level]);

  const handleChoice = (num) => {
    if (!problem || showSuccess) return;
    if (num === problem.answer) {
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
    <div className="flex flex-col items-center w-full h-full justify-between overflow-hidden relative">
      <AnimatePresence>
        {showSummary && (
          <SummaryScreen
            correct={sessionStats.correct}
            incorrect={sessionStats.incorrect}
            onNext={() => { 
              setSessionStats({ correct: 0, incorrect: 0 }); 
              onLevelComplete(); 
              startRound(); 
            }}
          />
        )}
      </AnimatePresence>
      
      <MagicalEffects isCelebrating={showSuccess} />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 10 }}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="clay-button !bg-green-500 !text-4xl sm:!text-6xl !px-12 !py-8 !rounded-[4rem] !border-8 border-white shadow-2xl animate-bounce">
              {theme?.id === 'werecat' ? 'WARRIOR! ⚡' : 'Magical! ✨'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Problem Area */}
      <div className="flex-1 w-full flex items-center justify-center overflow-y-auto px-4 py-2 min-h-0">
        {problem.type === 'counting' ? (
          <div className="clay-card p-6 sm:p-10 flex flex-col items-center justify-center gap-4 bg-white/90 max-h-full overflow-y-auto">
            <p className="text-xl sm:text-2xl font-black text-slate-400 font-heading uppercase tracking-widest">How many?</p>
            {iconSet && <ItemGrid count={problem.answer} itemIcon={iconSet.icon} itemColor={iconSet.color} />}
          </div>
        ) : (
          <motion.div
            key={problem.question}
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="clay-card p-8 sm:p-10 flex flex-col items-center gap-4 bg-white/90 min-w-[280px]"
          >
            <p className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest font-heading">Find the answer!</p>
            <div className={`text-5xl sm:text-7xl font-black text-slate-800 font-heading`}>
              {problem.question} = <span className="text-indigo-500">?</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Answer Bar */}
      <div className="w-full shrink-0 bg-white/60 backdrop-blur-md border-t border-white/30 flex justify-center items-center gap-4 sm:gap-10 py-4 sm:py-8 px-4 rounded-t-[2rem] shadow-2xl z-20">
        {choices.map(num => (
          <NumberButton key={num} number={num} isWrong={wrongAnswers.has(num)} onClick={handleChoice} />
        ))}
      </div>
    </div>
  );
}
