import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicalEffects from '../MagicalEffects';
import SummaryScreen from '../SummaryScreen';
import { playSound } from '../../audio/soundEngine';
import { generateProblem, generateDistractors } from '../../utils/mathEngine';

export default function TargetBlast({ levelInfo, onLevelComplete, theme }) {
  const [problem, setProblem] = useState(null);
  const [targets, setTargets] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  const startRound = () => {
    const prob = generateProblem(levelInfo.level);
    const distractors = generateDistractors(prob.answer, 4, levelInfo.level);
    const allChoices = [prob.answer, ...distractors].sort(() => Math.random() - 0.5);
    
    // Assign random initial positions for floating targets
    const targetsWithPos = allChoices.map(value => ({
      id: Math.random().toString(),
      value,
      initialX: Math.random() * 80 + 10, // 10% to 90%
      initialY: Math.random() * 40 + 10, // 10% to 50%
      duration: Math.random() * 4 + 4,   // 4s to 8s floating
    }));

    setProblem(prob);
    setTargets(targetsWithPos);
    setWrongAnswers(new Set());
    setShowSuccess(false);
    setShowSummary(false);
  };

  useEffect(() => { startRound(); }, [levelInfo.level]);

  const handleTargetClick = (target) => {
    if (!problem || showSuccess) return;
    
    if (target.value === problem.answer) {
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
      setWrongAnswers(prev => new Set(prev).add(target.id));
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
            <div className="bg-fuchsia-500 text-white text-4xl sm:text-6xl font-black px-12 py-8 rounded-full shadow-[0_0_100px_rgba(217,70,239,0.8)] border-8 border-white animate-bounce whitespace-nowrap">
              Bullseye! 🎯
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full relative overflow-hidden">
        {/* Floating Targets */}
        {targets.map((target) => {
          const isWrong = wrongAnswers.has(target.id);
          if (isWrong) return null; // Explode/disappear if wrong

          return (
            <motion.button
              key={target.id}
              initial={{ scale: 0, x: `${target.initialX}vw`, y: `${target.initialY}vh` }}
              animate={{
                scale: 1,
                y: [`${target.initialY}vh`, `${target.initialY - 10}vh`, `${target.initialY}vh`],
                x: [`${target.initialX}vw`, `${target.initialX + (Math.random() * 10 - 5)}vw`, `${target.initialX}vw`]
              }}
              transition={{ 
                scale: { duration: 0.5 },
                y: { duration: target.duration, repeat: Infinity, ease: "easeInOut" },
                x: { duration: target.duration * 1.2, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTargetClick(target)}
              className={`absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-black transition-colors ${
                showSuccess && target.value === problem.answer
                  ? 'bg-green-400 text-white shadow-[0_0_40px_rgba(74,222,128,0.8)] z-40'
                  : 'bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-xl z-30 hover:bg-white dark:hover:bg-slate-600'
              } border-4 border-white/50`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent rounded-full" />
              <span className="relative z-10 drop-shadow-sm">{target.value}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Target Base (Equation) */}
      <div className="w-full shrink-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-t-8 border-white/80 dark:border-slate-700 flex flex-col items-center py-8 px-4 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-50">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="text-xl">🎯</span> Blast the right answer!
        </p>
        <div className={`text-6xl sm:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme?.titleGradient || 'from-fuchsia-400 to-purple-500'}`}>
          {problem.question} = <span className="text-slate-300 dark:text-slate-600">?</span>
        </div>
      </div>
    </div>
  );
}
