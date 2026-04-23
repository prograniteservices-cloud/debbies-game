import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Trophy, Volume2 } from 'lucide-react';
import MagicalEffects from './MagicalEffects';
import { playSound } from '../audio/soundEngine';
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const WORD_TIERS = [
  // Tier 1: Levels 1-5 (3-letter, hint visible)
  [
    { word: "CAT", hint: "A furry pet that says meow" }, { word: "DOG", hint: "Man's best friend" },
    { word: "SUN", hint: "Shines bright in the sky" }, { word: "BEE", hint: "Makes honey" },
    { word: "CAR", hint: "Has four wheels" }, { word: "HAT", hint: "Worn on the head" },
    { word: "BAT", hint: "Flies at night" }, { word: "COW", hint: "Gives milk" },
    { word: "PIG", hint: "Says oink" }, { word: "BOX", hint: "You put things in it" },
    { word: "CUP", hint: "You drink from it" }, { word: "BUS", hint: "Takes you to school" }
  ],
  // Tier 2: Levels 6-10 (4-letter, hint visible)
  [
    { word: "STAR", hint: "Twinkles at night" }, { word: "FROG", hint: "Jumps and says ribbit" },
    { word: "CAKE", hint: "Sweet treat" }, { word: "BIRD", hint: "Sings in the trees" },
    { word: "FISH", hint: "Swims in water" }, { word: "DUCK", hint: "Says quack" },
    { word: "MOON", hint: "Shines at night" }, { word: "BEAR", hint: "Big animal in the woods" },
    { word: "TREE", hint: "Has leaves and branches" }, { word: "BOAT", hint: "Floats on water" },
    { word: "DOOR", hint: "You open to go in" }, { word: "SHOE", hint: "Worn on your foot" }
  ],
  // Tier 3: Levels 11-15 (3-letter, hint only)
  [
    { word: "HEN", hint: "Lays eggs" }, { word: "FOX", hint: "A sly animal" },
    { word: "BUG", hint: "Small insect" }, { word: "PEN", hint: "Used to write" },
    { word: "ANT", hint: "Tiny strong bug" }, { word: "BED", hint: "Where you sleep" },
    { word: "OWL", hint: "Says hoot" }, { word: "MUG", hint: "Holds hot cocoa" },
    { word: "VAN", hint: "A large car" }, { word: "MAP", hint: "Shows you where to go" },
    { word: "KEY", hint: "Unlocks a door" }, { word: "EGG", hint: "Birds hatch from it" }
  ],
  // Tier 4: Levels 16-20 (4-letter, hint only)
  [
    { word: "LEAF", hint: "Falls in autumn" }, { word: "JUMP", hint: "Spring into the air" },
    { word: "BLUE", hint: "Color of the sky" }, { word: "RAIN", hint: "Water from clouds" },
    { word: "KITE", hint: "Flies on a string" }, { word: "SNOW", hint: "White and cold" },
    { word: "FIRE", hint: "Hot and bright" }, { word: "WIND", hint: "Blows the trees" },
    { word: "SAND", hint: "Found at the beach" }, { word: "ROCK", hint: "A hard stone" },
    { word: "SOUP", hint: "Hot liquid food" }, { word: "MILK", hint: "White drink" }
  ],
  // Tier 5: Levels 21-25 (5-letter, hint only)
  [
    { word: "APPLE", hint: "A red or green fruit" }, { word: "TRAIN", hint: "Runs on tracks" },
    { word: "MOUSE", hint: "Eats cheese" }, { word: "CLOCK", hint: "Tells the time" },
    { word: "SMILE", hint: "Shows you are happy" }, { word: "WATER", hint: "Clear liquid to drink" },
    { word: "HOUSE", hint: "Where you live" }, { word: "CHAIR", hint: "What you sit on" },
    { word: "HORSE", hint: "Animal you can ride" }, { word: "PUPPY", hint: "A baby dog" },
    { word: "GRASS", hint: "Green plant on lawns" }, { word: "BREAD", hint: "Used to make a sandwich" }
  ],
  // Tier 6: Levels 26-30 (6-letter, hint only)
  [
    { word: "PLANET", hint: "Earth is one" }, { word: "MONKEY", hint: "Swings from trees" },
    { word: "FLOWER", hint: "Blooms in the garden" }, { word: "PENCIL", hint: "Used for drawing" },
    { word: "RABBIT", hint: "Has long ears" }, { word: "WINDOW", hint: "You look out of it" },
    { word: "DRAGON", hint: "Breathes fire" }, { word: "CASTLE", hint: "Where a king lives" },
    { word: "ORANGE", hint: "A color and a fruit" }, { word: "SCHOOL", hint: "Where you go to learn" },
    { word: "CIRCLE", hint: "A round shape" }, { word: "SPIDER", hint: "Has eight legs" }
  ]
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
function DraggableLetter({ id, letter, disabled, isSelected, onSelect, letterBorder, letterGradient, selectedGradient }) {
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
      style={{ ...style, '--button-bg': isSelected ? '#fbbf24' : '#ffffff' }}
      {...listeners}
      {...attributes}
      onClick={() => !disabled && onSelect(id, letter)}
      className={`clay-button !w-14 !h-14 sm:!w-20 sm:!h-20 !rounded-2xl !text-2xl sm:!text-4xl !shadow-lg transition-all
        ${isSelected
          ? '!bg-yellow-300 !scale-110 !shadow-2xl ring-4 ring-yellow-400'
          : `!bg-white !text-slate-800`}
        ${disabled ? 'opacity-50 grayscale' : ''}
      `}
    >
      <span className={isSelected ? 'text-white' : 'text-slate-800'}>
        {letter}
      </span>
      {isDragging && (
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
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
      className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl font-black transition-all clay-card
        ${isFilled
          ? '!bg-emerald-400 !text-white !border-4 !border-white'
          : isOver
            ? '!bg-pink-100 !border-4 !border-dashed !border-pink-400'
            : hasSelection && !isFilled
              ? '!bg-yellow-50 !border-4 !border-dashed !border-yellow-400 cursor-pointer animate-pulse'
              : '!bg-slate-100/30 !border-4 !border-dashed !border-slate-300'}
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires minimum 5px movement before drag starts, letting clicks fire
      },
    })
  );

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const WORDS = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const tierIndex = Math.floor(i / 5);
      const tier = WORD_TIERS[Math.min(tierIndex, WORD_TIERS.length - 1)];
      return tier[Math.floor(Math.random() * tier.length)];
    });
  }, []);

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
      playSound('sparkle');
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
    if (draggedLetter !== expectedLetter) {
      playSound('fail');
      return;
    }
    if (placedLetters[slotId]) return;

    playSound('ding');
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
    playSound('pop');
    setSelectedLetter(prev => (prev?.id === id ? null : { id, letter }));
  };

  // ─── Click-place handler ──────────────────────────────────────────────────
  const handlePlaceSelected = (slotId, expectedLetter) => {
    if (!selectedLetter) return;
    placeLetter(slotId, expectedLetter, selectedLetter.letter, selectedLetter.id);
  };

  const handleReadClue = () => speakText(spokenText);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-4 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob bg-purple-100 -top-20 -left-20 opacity-60" />
        <div className="aurora-blob bg-pink-100 top-1/2 -right-20 opacity-60" style={{ animationDelay: '-5s' }} />
        <div className="aurora-blob bg-indigo-100 -bottom-20 left-1/2 opacity-60" style={{ animationDelay: '-10s' }} />
      </div>
      <MagicalEffects isCelebrating={showReward} />

      {/* Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] z-20 border border-white/40 shadow-sm">
        <button
          onClick={onBack}
          className="clay-button !bg-slate-100 !text-slate-600 !p-3 !border-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 clay-card p-1 bg-white">
            <img
              src={theme?.mascotImg || '/assets/unicorn_queen.png'}
              alt={theme?.mascotAlt || 'Mascot'}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 font-heading tracking-tight">Spelling Quest</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Level {currentWordIndex + 1}/{WORDS.length}</p>
          </div>
        </div>
        <div className="clay-card !rounded-2xl !px-4 !py-2 flex items-center gap-2 !bg-white/80">
          <Trophy className="w-6 h-6 text-yellow-500 drop-shadow-sm" />
          <span className="text-xl font-black text-slate-800 font-heading">{Object.keys(placedLetters).length * 10}</span>
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
                <div className="clay-card !bg-white/95 p-8 rounded-[4rem] shadow-2xl flex flex-col items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-yellow-400 opacity-10" />
                  <h3 className={`text-5xl font-black text-slate-800 mb-6 font-heading tracking-tight relative z-10`}>{theme?.rewardText || 'MAGICAL!'}</h3>
                  <img
                    src={theme?.rewardImg || '/assets/flying_unicorn_rainbow.png'}
                    alt={theme?.rewardAlt || 'Reward'}
                    className="w-64 h-64 object-contain animate-bounce relative z-10"
                  />
                  <div className="flex mt-8 gap-2 relative z-10">
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
            className="flex items-center gap-4 mb-6 sm:mb-10 clay-card !rounded-full !px-8 !py-4 !bg-white/80 max-w-full"
          >
            <span className={`font-black text-slate-800 text-center font-heading ${isEarlyLevel ? 'text-2xl sm:text-4xl tracking-wider' : 'text-base sm:text-2xl'}`}>
              {displayText}
            </span>
            <button
              onClick={handleReadClue}
              className="clay-button !bg-indigo-100 !text-indigo-600 !p-3 !border-2 shrink-0"
              title="Hear Hint"
            >
              <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </motion.div>

          {/* Target Slots */}
          <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap justify-center">
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
          <div className="w-full max-w-3xl flex flex-wrap justify-center gap-2 sm:gap-4 clay-card p-3 sm:p-4 !bg-white/60">
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

      {/* Interactive indicator */}
      {selectedLetter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 clay-card !bg-yellow-100 !px-8 !py-3 font-black text-yellow-800 font-heading shadow-2xl"
        >
          Tap a box to place "{selectedLetter.letter}"
        </motion.div>
      )}
        </div>
      </DndContext>
    </div>
  );
}
