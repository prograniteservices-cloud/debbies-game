import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Star, Heart, Moon, Sun } from 'lucide-react';
import ItemGrid from './ItemGrid';
import NumberButton from './NumberButton';
import MagicalEffects from './MagicalEffects';
import SummaryScreen from './SummaryScreen';

const ICON_SETS = [
  { icon: Apple, color: "text-red-500 fill-red-500" },
  { icon: Star, color: "text-yellow-400 fill-yellow-400" },
  { icon: Heart, color: "text-pink-500 fill-pink-500" },
  { icon: Moon, color: "text-indigo-400 fill-indigo-200" },
  { icon: Sun, color: "text-orange-400 fill-yellow-200" }
];

export default function CountingLevel({ levelInfo, onLevelComplete }) {
  const [targetCount, setTargetCount] = useState(0);
  const [addends, setAddends] = useState(null);
  const [choices, setChoices] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentIconSet, setCurrentIconSet] = useState(ICON_SETS[0]);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  // Max number depends on level (e.g. Level 1 -> 5, Level 2 -> 10, etc.)
  const maxNumber = Math.min(20, levelInfo.level * 5);

  const startNewRound = (forcedLevel) => {
    const activeLevel = forcedLevel || levelInfo.level;
    const isAddition = activeLevel > 10;
    
    let target = 0;
    let newAddends = null;
    let rangeMax = 0;

    if (isAddition) {
      const currentMax = Math.min(30, (activeLevel - 10) * 5 + 5);
      target = Math.floor(Math.random() * (currentMax - 2)) + 2;
      const a1 = Math.floor(Math.random() * (target - 1)) + 1;
      const a2 = target - a1;
      
      // Pick two different icon sets
      const set1 = ICON_SETS[Math.floor(Math.random() * ICON_SETS.length)];
      let set2 = ICON_SETS[Math.floor(Math.random() * ICON_SETS.length)];
      while (set2.icon === set1.icon) {
        set2 = ICON_SETS[Math.floor(Math.random() * ICON_SETS.length)];
      }

      newAddends = { a1, a2, set1, set2 };
      rangeMax = Math.max(10, currentMax + 5);
    } else {
      const currentMax = Math.min(20, activeLevel * 5);
      target = Math.floor(Math.random() * currentMax) + 1;
      rangeMax = Math.max(10, currentMax + 5);
    }
    
    setTargetCount(target);
    setAddends(newAddends);
    
    // Pick random icon set
    const nextIconSet = ICON_SETS[Math.floor(Math.random() * ICON_SETS.length)];
    setCurrentIconSet(nextIconSet);
    
    // Generate choices within range
    const opts = new Set();
    opts.add(target);
    
    let attempts = 0;
    while (opts.size < 3 && attempts < 50) {
      attempts++;
      let offset = Math.floor(Math.random() * 5) + 1;
      let wrong = Math.random() > 0.5 ? target + offset : target - offset;
      
      if (wrong > 0 && wrong <= rangeMax && wrong !== target) {
        opts.add(wrong);
      }
    }
    
    // Fallback if loop fails
    if (opts.size < 3) {
      for (let i = 1; i <= 3; i++) {
        if (!opts.has(i) && i !== target) opts.add(i);
        if (opts.size >= 3) break;
      }
    }
    
    const finalChoices = Array.from(opts).sort(() => Math.random() - 0.5);
    setChoices(finalChoices);
    setWrongAnswers(new Set());
    setShowSuccess(false);
    setShowSummary(false);
  };

  // Only start on mount. Subsequent rounds are triggered by handleChoice.
  useEffect(() => {
    startNewRound();
  }, []);

  const handleChoice = (num) => {
    console.log(`[CountingGame] User chose: ${num}. Target was: ${targetCount}`);
    if (num === targetCount) {
      setShowSuccess(true);
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      
      const nextScore = levelInfo.score + 1;
      const willLevelUp = Math.floor(nextScore / 5) > Math.floor(levelInfo.score / 5);

      setTimeout(() => {
        if (willLevelUp) {
          setShowSummary(true);
        } else {
          onLevelComplete();
          startNewRound();
        }
      }, 1500);
    } else {
      setWrongAnswers(prev => new Set(prev).add(num));
      setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleNextLevel = () => {
    setSessionStats({ correct: 0, incorrect: 0 });
    onLevelComplete();
    startNewRound();
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      <AnimatePresence>
        {showSummary && (
          <SummaryScreen 
            correct={sessionStats.correct} 
            incorrect={sessionStats.incorrect} 
            onNext={handleNextLevel}
          />
        )}
      </AnimatePresence>
      <MagicalEffects isCelebrating={showSuccess} />
      <div className="py-6 w-full flex shrink-0 justify-between px-8 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm z-20">
        <div className="text-2xl font-black text-slate-700 dark:text-slate-200 drop-shadow-sm">
          Level {levelInfo.level}
        </div>
        <div className="text-2xl font-black text-amber-500 drop-shadow-sm flex items-center gap-2">
          <Star className="w-8 h-8 fill-amber-500" /> {levelInfo.score}
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-50 flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-green-400 text-white text-4xl sm:text-6xl font-black px-12 py-8 rounded-full shadow-[0_0_100px_rgba(74,222,128,0.8)] border-8 border-white animate-bounce whitespace-nowrap">
              Great Job! ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full flex items-center justify-center -mt-8">
        {addends ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full p-2">
            <div className="flex flex-col items-center bg-white/30 dark:bg-slate-800/30 p-4 rounded-[2rem] shadow-sm transform transition-transform hover:scale-105">
              <ItemGrid count={addends.a1} itemIcon={addends.set1.icon} itemColor={addends.set1.color} />
              <span className="text-2xl sm:text-4xl font-black text-slate-700 dark:text-slate-200 mt-2">{addends.a1}</span>
            </div>
            
            <span className="text-4xl sm:text-6xl font-black text-purple-500 mx-1 sm:mx-2 drop-shadow-md">+</span>
            
            <div className="flex flex-col items-center bg-white/30 dark:bg-slate-800/30 p-4 rounded-[2rem] shadow-sm transform transition-transform hover:scale-105">
              <ItemGrid count={addends.a2} itemIcon={addends.set2.icon} itemColor={addends.set2.color} />
              <span className="text-2xl sm:text-4xl font-black text-slate-700 dark:text-slate-200 mt-2">{addends.a2}</span>
            </div>
            
            <span className="text-4xl sm:text-6xl font-black text-pink-500 mx-1 sm:mx-2 drop-shadow-md">=</span>
            
            <div className="hidden sm:flex flex-col items-center justify-center bg-black/10 dark:bg-white/10 p-4 rounded-[2rem] border-4 border-dashed border-slate-400 dark:border-slate-500 h-full min-h-[100px] min-w-[80px]">
              <span className="text-3xl text-slate-400 dark:text-slate-500 opacity-50 font-black">?</span>
            </div>
          </div>
        ) : (
          <div className="min-h-[50vh] flex items-center justify-center">
            <ItemGrid count={targetCount} itemIcon={currentIconSet.icon} itemColor={currentIconSet.color} />
          </div>
        )}
      </div>

      <div className="w-full shrink-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-t-8 border-white/80 dark:border-slate-700 flex justify-center items-center gap-6 sm:gap-12 py-12 px-4 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        {choices.map(num => (
          <NumberButton 
            key={num} 
            number={num} 
            isWrong={wrongAnswers.has(num)}
            onClick={handleChoice} 
          />
        ))}
      </div>
    </div>
  );
}
