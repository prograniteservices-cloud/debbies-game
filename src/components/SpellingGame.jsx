import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Trophy, Volume2 } from 'lucide-react';
import MagicalEffects from './MagicalEffects';
import {
  DndContext,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Levels 1-10 (index 0-9): TTS reads and displays the actual WORD
// Levels 11-20 (index 10-19): TTS reads and displays a descriptive HINT
const WORDS = [
  // --- 3-letter words: levels 1-4 ---
  { word: "CAT",  hint: "A furry pet that says meow" },
  { word: "DOG",  hint: "Man's best friend, loves to fetch" },
  { word: "SUN",  hint: "Shines bright in the sky" },
  { word: "BEE",  hint: "A buzzing insect that makes honey" },
  // --- 4-letter words: levels 5-10 ---
  { word: "STAR", hint: "Twinkles at night in the sky" },
  { word: "FROG", hint: "A green jumper that loves ponds" },
  { word: "CAKE", hint: "Sweet treat for birthdays" },
  { word: "BIRD", hint: "Has wings and can fly" },
  { word: "FISH", hint: "Swims underwater and has fins" },
  { word: "DUCK", hint: "A bird that says quack" },
  // --- 3-letter words: levels 11-14 (hints only) ---
  { word: "COW",  hint: "Gives milk on the farm" },
  { word: "HAT",  hint: "You wear it on your head" },
  { word: "HEN",  hint: "A bird that lays eggs" },
  { word: "PIG",  hint: "A pink farm animal that oinks" },
  // --- 4-letter words: levels 15-20 (hints only) ---
  { word: "LEAF", hint: "Falls from trees in autumn" },
  { word: "BEAR", hint: "A big furry creature in the woods" },
  { word: "JUMP", hint: "What you do to get off the ground" },
  { word: "BLUE", hint: "The color of the sky and ocean" },
  { word: "RAIN", hint: "Falls from clouds on a wet day" },
  { word: "KITE", hint: "You fly it in the wind on a string" },
];

// ─── TTS helper: picks best available voice (Google, Microsoft, or system) ───
function getBestVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Priority list: prefer child-friendly, clear English voices
  const preferred = [
    'Google US English',
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Zira Desktop - English (United States)',
    'Samantha',          // macOS
    'Karen',             // macOS Australian
    'en-US-Standard-C',  // Generic
  ];
  for (const name of preferred) {
    const match = voices.find(v => v.name === name);
    if (match) return match;
  }
  // Fallback: any en-US voice
  return voices.find(v => v.lang === 'en-US') || voices[0] || null;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = getBestVoice();
  utterance.pitch = 1.1;
  utterance.rate = 0.85;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

// ─── Draggable Letter (also handles click-select) ───────────────────────────
function DraggableLetter({ id, letter, disabled, isSelected, onSelect }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { letter },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? 'default' : 'grab',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !disabled && onSelect(id, letter)}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black shadow-xl border-b-4 select-none z-10 transition-all
        ${isSelected
          ? 'bg-yellow-300 border-yellow-500 scale-110 ring-4 ring-yellow-400 ring-offset-2'
          : `bg-white/90 dark:bg-slate-800/90 ${theme?.letterBorder || 'border-pink-400'} hover:-translate-y-1 active:scale-95`}
        ${disabled ? 'opacity-50 grayscale' : ''}
      `}
    >
      <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isSelected ? (theme?.selectedGradient || 'from-orange-500 to-yellow-600') : (theme?.letterGradient || 'from-purple-500 to-pink-500')}`}>
        {letter}
      </span>
      {isDragging && (
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
      )}
      {isSelected && (
        <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500 animate-bounce" />
      )}
    </motion.div>
  );
}

// ─── Droppable Slot (also handles click-place) ───────────────────────────────
function DroppableSlot({ id, letter, isFilled, hasSelection, onPlace }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { expectedLetter: letter },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => !isFilled && hasSelection && onPlace(id, letter)}
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all
        ${isFilled
          ? 'bg-gradient-to-br from-green-300 to-emerald-400 text-white shadow-inner border-4 border-white/50'
          : isOver
            ? 'bg-pink-100 border-4 border-dashed border-pink-400 dark:bg-pink-900/30'
            : hasSelection && !isFilled
              ? 'bg-yellow-100 border-4 border-dashed border-yellow-400 dark:bg-yellow-900/30 cursor-pointer animate-pulse'
              : 'bg-black/10 dark:bg-white/10 border-4 border-dashed border-slate-300 dark:border-slate-600'}
      `}
    >
      {isFilled && (
        <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
          {letter}
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SpellingGame({ onBack, theme }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [placedLetters, setPlacedLetters] = useState({});
  const [lettersPool, setLettersPool] = useState([]);
  const [showReward, setShowReward] = useState(false);
  // Click-to-select state: { id, letter } or null
  const [selectedLetter, setSelectedLetter] = useState(null);
  // Load voices async (Chrome lazy-loads them)
  const voicesReady = useRef(false);

  const currentLevel = WORDS[currentWordIndex];
  const isEarlyLevel = currentWordIndex < 10;
  const spokenText = isEarlyLevel ? currentLevel.word.toLowerCase() : currentLevel.hint;
  const displayText = isEarlyLevel
    ? `The word is: ${currentLevel.word}`
    : `Hint: ${currentLevel.hint}`;

  // Ensure voices are loaded before first speak
  useEffect(() => {
    const loadVoices = () => { voicesReady.current = true; };
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    // Some browsers load them synchronously
    if (window.speechSynthesis.getVoices().length > 0) voicesReady.current = true;
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  useEffect(() => {
    initLevel();
    // Small delay to allow voices to initialize
    const timer = setTimeout(() => speakText(WORDS[currentWordIndex]
      ? (currentWordIndex < 10
          ? WORDS[currentWordIndex].word.toLowerCase()
          : WORDS[currentWordIndex].hint)
      : ''), 400);
    return () => clearTimeout(timer);
  }, [currentWordIndex]);

  const initLevel = () => {
    const word = WORDS[currentWordIndex].word;
    const scrambled = [...word].sort(() => Math.random() - 0.5);
    const pool = scrambled.map((char, i) => ({ id: `pool-${char}-${i}`, letter: char }));
    setLettersPool(pool);
    setPlacedLetters({});
    setShowReward(false);
    setSelectedLetter(null);
  };

  const checkWinCondition = useCallback((currentPlaced) => {
    const word = WORDS[currentWordIndex].word;
    if (Object.keys(currentPlaced).length === word.length) {
      setShowReward(true);
      speakText('Amazing! You spelled it!');
      setTimeout(() => {
        if (currentWordIndex < WORDS.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          onBack();
        }
      }, 3000);
    }
  }, [currentWordIndex, onBack]);

  // ─── Place a letter into a slot (shared logic for drag AND click) ─────────
  const placeLetter = useCallback((slotId, expectedLetter, draggedLetter, poolItemId) => {
    if (draggedLetter !== expectedLetter) return;
    if (placedLetters[slotId]) return;

    setPlacedLetters(prev => {
      const next = { ...prev, [slotId]: draggedLetter };
      checkWinCondition(next);
      return next;
    });
    setLettersPool(prev => prev.filter(item => item.id !== poolItemId));
    setSelectedLetter(null);
  }, [placedLetters, checkWinCondition]);

  // ─── Drag-and-drop handler ────────────────────────────────────────────────
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    placeLetter(
      over.id,
      over.data.current.expectedLetter,
      active.data.current.letter,
      active.id
    );
  };

  // ─── Click-select handler ─────────────────────────────────────────────────
  const handleSelectLetter = (id, letter) => {
    setSelectedLetter(prev => (prev?.id === id ? null : { id, letter }));
  };

  // ─── Click-place handler ──────────────────────────────────────────────────
  const handlePlaceSelected = (slotId, expectedLetter) => {
    if (!selectedLetter) return;
    placeLetter(slotId, expectedLetter, selectedLetter.letter, selectedLetter.id);
  };

  const handleReadClue = () => speakText(spokenText);

  return (
    <div className={`flex flex-col items-center justify-between w-full h-full p-4 relative overflow-hidden bg-gradient-to-b ${theme?.spellingBg || 'from-purple-200 to-indigo-300 dark:from-slate-800 dark:to-indigo-950'}`}>
      <MagicalEffects isCelebrating={showReward} />

      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-md p-4 rounded-3xl z-20">
        <button
          onClick={onBack}
          className="p-3 bg-white/80 dark:bg-slate-800 rounded-full hover:bg-white transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-4">
          <img
            src={theme?.mascotImg || '/assets/unicorn_queen.png'}
            alt={theme?.mascotAlt || 'Mascot'}
            className="w-12 h-12 object-contain shrink-0 drop-shadow-lg"
            style={{ mixBlendMode: 'multiply' }}
          />
          <div>
            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">Spelling Quest</h2>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Level {currentWordIndex + 1}/{WORDS.length}</p>
          </div>
        </div>
        <div className="flex bg-yellow-400/20 px-4 py-2 rounded-2xl items-center gap-2 border border-yellow-400/50">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-xl font-black text-yellow-600 dark:text-yellow-400">{Object.keys(placedLetters).length * 10}</span>
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center justify-center flex-1 w-full relative z-10">

          {/* Win Reward overlay */}
          <AnimatePresence>
            {showReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                transition={{ type: "spring" }}
                className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
              >
                <div className="bg-white/90 backdrop-blur-md p-8 rounded-[3rem] shadow-2xl border-4 border-yellow-400 flex flex-col items-center">
                  <h3 className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme?.rewardGradient || 'from-pink-500 to-yellow-500'} mb-6 drop-shadow-sm`}>{theme?.rewardText || 'MAGICAL!'}</h3>
                  <img
                    src={theme?.rewardImg || '/assets/flying_unicorn_rainbow.png'}
                    alt={theme?.rewardAlt || 'Reward'}
                    className="w-64 h-64 object-contain animate-bounce"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <div className="flex mt-8 gap-2">
                    {[1,2,3].map(i => (
                      <Sparkles key={i} className="w-10 h-10 text-yellow-400" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint / Word Display */}
          <motion.div
            key={`hint-${currentWordIndex}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10 bg-white/30 dark:bg-black/30 px-8 py-4 rounded-full shadow-inner"
          >
            <span className={`font-bold text-indigo-900 dark:text-indigo-100 ${isEarlyLevel ? 'text-4xl sm:text-5xl tracking-wider' : 'text-xl sm:text-2xl'}`}>
              {displayText}
            </span>
            <button
              onClick={handleReadClue}
              className="p-2 bg-white/50 dark:bg-slate-700/50 rounded-full hover:bg-white transition-colors cursor-pointer shrink-0"
              title="Hear Hint"
            >
              <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
            </button>
          </motion.div>

          {/* Target Slots */}
          <div className="flex gap-4 mb-12">
            {currentLevel.word.split('').map((letter, index) => (
              <DroppableSlot
                key={`slot-${index}`}
                id={`slot-${index}`}
                letter={letter}
                isFilled={placedLetters[`slot-${index}`] === letter}
                hasSelection={!!selectedLetter}
                onPlace={handlePlaceSelected}
              />
            ))}
          </div>

          {/* Letter Pool */}
          <div className="w-full max-w-3xl flex flex-wrap justify-center gap-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-white/30">
            {lettersPool.map((item) => (
              <DraggableLetter
                key={item.id}
                id={item.id}
                letter={item.letter}
                disabled={showReward}
                isSelected={selectedLetter?.id === item.id}
                onSelect={handleSelectLetter}
              />
            ))}
          </div>

          {/* Click-mode hint for young players */}
          {selectedLetter && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-yellow-100/70 px-6 py-2 rounded-full"
            >
              Now tap a box to place the letter!
            </motion.p>
          )}
        </div>
      </DndContext>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-pink-400/20 border border-pink-300 blur-2xl rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-purple-400/20 border border-purple-300 blur-2xl rounded-full" />
    </div>
  );
}
