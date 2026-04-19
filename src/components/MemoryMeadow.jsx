import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import MagicalEffects from './MagicalEffects';
import LevelCompleteOverlay from './LevelCompleteOverlay';
import { playSound } from '../audio/soundEngine';

const ITEMS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍'];

const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const MemoryCard = ({ item, isFlipped, isMatched, onClick, index }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 perspective-1000 cursor-pointer group"
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500 ease-out"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
      >
        {/* Card Back */}
        <div className={`absolute w-full h-full backface-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl border-4 border-indigo-300 flex items-center justify-center group-hover:shadow-indigo-500/50 group-hover:-translate-y-1 transition-all`}>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-300/50" />
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rounded-xl sm:rounded-2xl bg-white shadow-xl border-4 border-slate-200 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl" style={{ transform: 'rotateY(180deg)' }}>
          <span className={isMatched ? 'opacity-50 grayscale transition-all' : ''}>{item}</span>
          {isMatched && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 absolute animate-ping" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function MemoryMeadow({ onBack, theme, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // Pick 6 pairs for a 3x4 grid
    const selectedItems = ITEMS.slice(0, 6);
    const deck = shuffle([...selectedItems, ...selectedItems]);
    setCards(deck);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setShowReward(false);
  };

  const handleCardClick = (index) => {
    if (isLocked || flippedIndices.includes(index) || matchedIndices.includes(index)) return;

    playSound('pop');
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Match!
        setTimeout(() => {
          playSound('ding');
          playSound('sparkle');
          const newMatched = [...matchedIndices, first, second];
          setMatchedIndices(newMatched);
          setFlippedIndices([]);
          setScore(s => s + 10);
          setIsLocked(false);
          if (newMatched.length === cards.length && cards.length > 0) {
            setTimeout(() => {
              playSound('sparkle');
              setShowReward(true);
            }, 500);
          }
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          playSound('fail');
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    setShowReward(false);
    if (onComplete) onComplete();
    else onBack();
  };

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full p-4 relative overflow-hidden bg-gradient-to-br ${theme?.spellingBg || 'from-green-300 to-emerald-500 dark:from-green-900 dark:to-emerald-900'}`}>
      <MagicalEffects isCelebrating={showReward} />

      <LevelCompleteOverlay
        show={showReward}
        title="MEADOW CLEARED!"
        subtitle="All pairs matched!"
        emoji="🌸"
        stars={score >= 60 ? 5 : score >= 40 ? 4 : score >= 20 ? 3 : 2}
        score={score}
        theme={theme}
        onNext={handleNext}
        onRetry={() => { setScore(0); setShowReward(false); initGame(); }}
        nextLabel="DONE"
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
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-wide">Memory Meadow</h2>
            <p className="text-xs sm:text-sm text-white/80 font-bold uppercase tracking-widest">Match all pairs!</p>
          </div>
        </div>
        <div className="flex bg-yellow-400/30 px-4 py-2 rounded-2xl items-center gap-2 border border-yellow-300/50">
          <Trophy className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          <span className="text-xl font-black text-white">{score}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl flex items-center justify-center z-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-8 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-2 border-white/30">
          {cards.map((item, idx) => (
            <MemoryCard
              key={idx}
              index={idx}
              item={item}
              isFlipped={flippedIndices.includes(idx)}
              isMatched={matchedIndices.includes(idx)}
              onClick={() => handleCardClick(idx)}
            />
          ))}
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* CSS for 3D flip */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}} />
    </div>
  );
}
