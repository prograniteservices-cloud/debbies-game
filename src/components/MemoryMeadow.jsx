import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import MagicalEffects from './MagicalEffects';
import LevelCompleteOverlay from './LevelCompleteOverlay';
import { playSound } from '../audio/soundEngine';

const ITEM_SETS = {
  fruits: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍', '🥝', '🍋'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  space: ['⭐', '🌙', '☀️', '🚀', '🛸', '🛰️', '🌎', '🪐', '☄️', '🌌'],
  nature: ['🌸', '🌺', '🌻', '🌼', '🌿', '🌱', '🍃', '🍄', '🌳', '🌲'],
  sweets: ['🍦', '🍩', '🍪', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮']
};

const LEVELS = [
  { name: 'Tiny Garden', rows: 2, cols: 2, itemSet: 'fruits' },
  { name: 'Animal Trail', rows: 2, cols: 3, itemSet: 'animals' },
  { name: 'Starry Field', rows: 3, cols: 4, itemSet: 'space' },
  { name: 'Floral Forest', rows: 4, cols: 4, itemSet: 'nature' },
  { name: 'Sweet Valley', rows: 4, cols: 5, itemSet: 'sweets' }
];

const shuffle = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const MemoryCard = ({ item, isFlipped, isMatched, onClick, index, rows, cols }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`relative perspective-1000 cursor-pointer group 
        ${cols > 4 ? 'w-12 h-16 sm:w-16 sm:h-20' : 'w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28'}
      `}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500 ease-out"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
      >
        {/* Card Back */}
        <div className={`absolute w-full h-full backface-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl border-4 border-indigo-300 flex items-center justify-center group-hover:shadow-indigo-500/50 group-hover:-translate-y-1 transition-all`}>
          <Sparkles className={`${cols > 4 ? 'w-4 h-4' : 'w-6 h-6 sm:w-8 sm:h-8'} text-indigo-300/50`} />
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden rounded-xl sm:rounded-2xl bg-white shadow-xl border-4 border-slate-200 flex items-center justify-center text-2xl sm:text-3xl md:text-5xl" style={{ transform: 'rotateY(180deg)' }}>
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
  const [level, setLevel] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);

  const currentLevel = LEVELS[level];
  const bgGradient = theme?.bgThemes 
    ? theme.bgThemes[level % theme.bgThemes.length]
    : 'from-green-300 to-emerald-500 dark:from-green-900 dark:to-emerald-900';

  useEffect(() => {
    initGame(level);
  }, [level]);

  const initGame = (lvlIdx) => {
    const lvl = LEVELS[lvlIdx];
    const numPairs = (lvl.rows * lvl.cols) / 2;
    const selectedItems = ITEM_SETS[lvl.itemSet].slice(0, numPairs);
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
    if (level < LEVELS.length - 1) {
      setLevel(l => l + 1);
    } else {
      if (onComplete) onComplete();
      else onBack();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full p-4 relative overflow-hidden bg-gradient-to-br ${bgGradient} transition-colors duration-1000`}>
      <MagicalEffects isCelebrating={showReward} />

      {/* Ambient Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`${level}-${i}`}
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.15, 0],
              y: ['110%', '-10%'],
              x: [((i * 15) % 100) + '%', (((i * 15) + 10) % 100) + '%'],
              rotate: 360
            }}
            transition={{ 
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            className="absolute text-3xl sm:text-5xl opacity-10 blur-[2px]"
          >
            {ITEM_SETS[currentLevel.itemSet][i % ITEM_SETS[currentLevel.itemSet].length]}
          </motion.div>
        ))}
      </div>

      <LevelCompleteOverlay
        show={showReward}
        title={level === LEVELS.length - 1 ? "GRAND CHAMPION!" : "MEADOW CLEARED!"}
        subtitle={currentLevel.name}
        emoji="🌸"
        stars={5}
        score={score}
        theme={theme}
        onNext={handleNext}
        onRetry={() => { setScore(0); setShowReward(false); initGame(level); }}
        nextLabel={level === LEVELS.length - 1 ? "DONE" : "NEXT LEVEL"}
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
          <motion.img
            key={level}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={theme?.mascotImg || '/assets/unicorn_queen.png'}
            alt="Mascot"
            className="w-12 h-12 object-contain drop-shadow-lg"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-wide">{currentLevel.name}</h2>
            <p className="text-xs sm:text-sm text-white/80 font-bold uppercase tracking-widest">Level {level + 1}/{LEVELS.length}</p>
          </div>
        </div>
        <div className="flex bg-yellow-400/30 px-4 py-2 rounded-2xl items-center gap-2 border border-yellow-300/50">
          <Trophy className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          <span className="text-xl font-black text-white">{score}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex items-center justify-center z-10">
        <div 
          className="grid gap-2 sm:gap-4 p-4 sm:p-8 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-2 border-white/30"
          style={{ 
            gridTemplateColumns: `repeat(${currentLevel.cols}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((item, idx) => (
            <MemoryCard
              key={`${level}-${idx}`}
              index={idx}
              item={item}
              isFlipped={flippedIndices.includes(idx)}
              isMatched={matchedIndices.includes(idx)}
              onClick={() => handleCardClick(idx)}
              rows={currentLevel.rows}
              cols={currentLevel.cols}
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
