import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Factory,
  Map,
  PackageCheck,
  Search,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  Wand2,
  Wrench,
} from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import MagicalEffects from './MagicalEffects';
import { playSound, playTheme, playTTS, stopTheme } from '../audio/soundEngine';
import {
  SPELLING_LEVELS,
  getInitialSpellingLevel,
  getSpellingLevelChoices,
  getSpellingStars,
  getStationPrompt,
  getStationTitle,
} from '../data/spellingFactory';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STATION_ICONS = {
  build: Wrench,
  sort: PackageCheck,
  find: Search,
};

const PROFILE_SKINS = {
  unicorn: {
    bg: 'from-fuchsia-100 via-pink-50 to-indigo-100',
    accent: '#ec4899',
    secondary: '#8b5cf6',
    panel: 'bg-white/75',
    machine: 'from-pink-300 via-fuchsia-300 to-violet-300',
  },
  werecat: {
    bg: 'from-teal-100 via-emerald-50 to-lime-100',
    accent: '#0f766e',
    secondary: '#84cc16',
    panel: 'bg-white/75',
    machine: 'from-teal-300 via-emerald-300 to-lime-300',
  },
  milo: {
    bg: 'from-sky-100 via-indigo-50 to-amber-100',
    accent: '#2563eb',
    secondary: '#f59e0b',
    panel: 'bg-white/75',
    machine: 'from-blue-300 via-indigo-300 to-amber-300',
  },
  luna: {
    bg: 'from-indigo-100 via-violet-50 to-pink-100',
    accent: '#7c3aed',
    secondary: '#e879f9',
    panel: 'bg-white/75',
    machine: 'from-indigo-300 via-violet-300 to-pink-300',
  },
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getDistractors(word, count) {
  const used = new Set(word.split(''));
  return shuffle(LETTERS.filter((letter) => !used.has(letter))).slice(0, count);
}

function buildLetterPool(level) {
  const letters = [...level.word, ...getDistractors(level.word, level.distractorCount)];
  return shuffle(letters).map((letter, index) => ({
    id: `letter-${level.level}-${letter}-${index}`,
    letter,
    revealed: level.station !== 'find',
  }));
}

function DraggableLetter({ item, selected, disabled, station, onSelect, onReveal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { letter: item.letter },
    disabled: disabled || !item.revealed,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  if (!item.revealed) {
    return (
      <motion.button
        type="button"
        onClick={() => onReveal(item.id)}
        whileTap={{ scale: 0.92 }}
        className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-4 border-white/70 bg-gradient-to-br from-yellow-200 to-orange-300 shadow-xl"
        aria-label="Reveal hidden letter"
      >
        <Eye className="m-auto h-7 w-7 text-orange-700" />
        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white/80 animate-ping" />
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => !disabled && onSelect(item.id, item.letter)}
      whileTap={{ scale: 0.92 }}
      className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-4 text-3xl sm:text-4xl font-black font-heading shadow-xl transition-all
        ${selected ? 'border-yellow-300 bg-yellow-300 text-white scale-110' : 'border-white/70 bg-white text-slate-800'}
        ${disabled ? 'opacity-50 grayscale' : 'cursor-pointer'}
        ${station === 'sort' ? 'rotate-1' : ''}
      `}
      aria-label={`Letter ${item.letter}`}
    >
      {item.letter}
      <Sparkles className={`absolute -right-2 -top-2 h-5 w-5 text-yellow-400 ${selected ? 'block' : 'hidden'}`} />
    </motion.button>
  );
}

function LetterSlot({ id, expectedLetter, placedLetter, selectedLetter, hintActive, onPlace }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { expectedLetter },
  });

  const isFilled = placedLetter === expectedLetter;

  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={() => selectedLetter && !isFilled && onPlace(id, expectedLetter)}
      className={`relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-4 text-3xl sm:text-4xl font-black font-heading shadow-inner transition-all
        ${isFilled ? 'border-white bg-emerald-400 text-white shadow-xl' : 'border-dashed bg-white/45 text-slate-400'}
        ${isOver ? 'border-pink-400 bg-pink-100' : ''}
        ${hintActive && !isFilled ? 'border-yellow-400 bg-yellow-100 animate-pulse' : ''}
        ${selectedLetter && !isFilled ? 'cursor-pointer' : ''}
      `}
      aria-label={`Slot for ${expectedLetter}`}
    >
      {isFilled ? (
        <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}>
          {expectedLetter}
        </motion.span>
      ) : (
        <span className="text-lg">?</span>
      )}
    </button>
  );
}

function FactoryMachine({ level, skin, placedCount, totalLetters }) {
  const progress = totalLetters === 0 ? 0 : placedCount / totalLetters;
  const Icon = STATION_ICONS[level.station] || Wrench;

  return (
    <div className="relative mx-auto flex min-h-[190px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white/60 bg-white/35 p-4 shadow-2xl backdrop-blur-md">
      <div className={`absolute inset-0 bg-gradient-to-br ${skin.machine} opacity-70`} />
      <div className="absolute left-4 top-4 rounded-full bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600">
        Chapter {level.chapter}
      </div>
      <div className="absolute bottom-5 h-5 w-4/5 overflow-hidden rounded-full bg-slate-900/15">
        <motion.div
          className="h-full rounded-full bg-white"
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
      <motion.div
        animate={{ y: [0, -8, 0], rotate: level.station === 'sort' ? [0, 2, -2, 0] : 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex h-32 w-32 items-center justify-center rounded-[2rem] border-8 border-white/70 bg-white/80 shadow-2xl"
      >
        <Icon className="h-16 w-16" style={{ color: skin.accent }} />
      </motion.div>
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <motion.span
          key={item}
          className="absolute h-4 w-4 rounded-full bg-white/80"
          style={{ left: `${15 + item * 14}%`, top: `${20 + (item % 2) * 45}%` }}
          animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 2 + item * 0.2, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function PopCelebration({ theme, level, onComplete }) {
  const [items, setItems] = useState(() =>
    Array.from({ length: 24 }).map((_, index) => ({
      id: index,
      popped: false,
      letter: level.word[index % level.word.length],
      x: 8 + Math.random() * 84,
      y: 12 + Math.random() * 72,
    }))
  );

  const poppedCount = items.filter((item) => item.popped).length;

  useEffect(() => {
    if (poppedCount === items.length) {
      const timer = setTimeout(onComplete, 900);
      return () => clearTimeout(timer);
    }
  }, [items.length, onComplete, poppedCount]);

  const popItem = (id) => {
    playSound('pop');
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, popped: true } : item)));
  };

  return (
    <div className="absolute inset-0 z-40 overflow-hidden bg-slate-950/60 backdrop-blur-sm">
      <div className="absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-white/90 px-6 py-3 text-center shadow-xl">
        <div className="text-xs font-black uppercase tracking-widest text-slate-500">Bonus pop celebration</div>
        <div className="font-heading text-2xl text-slate-800">
          Pop the word parts: {poppedCount}/{items.length}
        </div>
      </div>
      {items.map((item) =>
        item.popped ? (
          <motion.div
            key={item.id}
            className="absolute text-4xl font-black text-white pointer-events-none"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
          >
            {item.letter}
          </motion.div>
        ) : (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => popItem(item.id)}
            className="absolute flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-white/80 font-heading text-2xl font-black shadow-2xl"
            style={{ left: `${item.x}%`, top: `${item.y}%`, color: theme?.primaryColor || '#ec4899' }}
            animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.4 + (item.id % 5) * 0.25, repeat: Infinity }}
          >
            {item.letter}
          </motion.button>
        )
      )}
      <button
        type="button"
        onClick={onComplete}
        className="clay-button absolute bottom-6 left-1/2 z-50 -translate-x-1/2 !bg-emerald-500 !px-8 !py-4 text-xl"
      >
        Continue
      </button>
    </div>
  );
}

export default function SpellingGame({ onBack, theme, onLevelComplete }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const skin = PROFILE_SKINS[theme?.id] || PROFILE_SKINS.unicorn;
  const charKey = theme?.id === 'werecat' ? 'bubba' : theme?.id || 'debbie';
  const progressKey = `debbies_game_spelling_current_level_${theme?.id || 'default'}`;
  const levelChoices = getSpellingLevelChoices();

  const [levelIndex, setLevelIndex] = useState(() => getInitialSpellingLevel({
    savedLevel: localStorage.getItem(progressKey),
  }) - 1);
  const [lettersPool, setLettersPool] = useState(() => buildLetterPool(SPELLING_LEVELS[levelIndex]));
  const [placedLetters, setPlacedLetters] = useState({});
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintPulse, setHintPulse] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [completed, setCompleted] = useState(false);

  const level = SPELLING_LEVELS[levelIndex];
  const placedCount = Object.keys(placedLetters).length;
  const nextSlotIndex = level.word.split('').findIndex((letter, index) => placedLetters[`slot-${index}`] !== letter);
  const stars = getSpellingStars({ mistakes, hintsUsed });

  const resetLevel = useCallback((nextIndex) => {
    const nextLevel = SPELLING_LEVELS[nextIndex];
    setLettersPool(buildLetterPool(nextLevel));
    setPlacedLetters({});
    setSelectedLetter(null);
    setMistakes(0);
    setHintsUsed(0);
    setHintPulse(false);
    setShowReward(false);
    setShowPop(false);
    setCompleted(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(progressKey, String(level.level));
    playTheme(level.station === 'find' ? 'spelling_factory_focus' : 'spelling_factory_main');
  }, [level.level, level.station, progressKey]);

  useEffect(() => {
    return () => stopTheme();
  }, []);

  const playLevelAudio = useCallback(async () => {
    const played = await playTTS(level.showWord ? level.wordAudio : level.hintAudio);
    if (!played) {
      setHintPulse(true);
      setTimeout(() => setHintPulse(false), 1400);
    }
  }, [level.hintAudio, level.showWord, level.wordAudio]);

  useEffect(() => {
    const timer = setTimeout(() => {
      playLevelAudio();
    }, 350);
    return () => clearTimeout(timer);
  }, [levelIndex, playLevelAudio]);

  const saveStars = useCallback((levelNumber, starCount) => {
    const key = `debbies_game_spelling_stars_${theme?.id || 'default'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    localStorage.setItem(key, JSON.stringify({ ...existing, [levelNumber]: Math.max(existing[levelNumber] || 0, starCount) }));
  }, [theme?.id]);

  const advanceLevel = useCallback(() => {
    if (levelIndex >= SPELLING_LEVELS.length - 1) {
      setCompleted(true);
      localStorage.setItem(progressKey, String(SPELLING_LEVELS.length));
      return;
    }
    setLevelIndex((prev) => {
      const next = prev + 1;
      resetLevel(next);
      return next;
    });
  }, [levelIndex, progressKey, resetLevel]);

  const jumpToLevel = (levelNumber) => {
    const nextIndex = getInitialSpellingLevel({ savedLevel: levelNumber }) - 1;
    setLevelIndex(nextIndex);
    resetLevel(nextIndex);
  };

  const completeWord = useCallback((currentPlaced) => {
    if (Object.keys(currentPlaced).length !== level.word.length) return;

    const earnedStars = getSpellingStars({ mistakes, hintsUsed });
    const score = level.level * 100 + earnedStars * 25;
    saveStars(level.level, earnedStars);
    onLevelComplete?.({ level: level.level, score, stars: earnedStars });
    playSound('sparkle');
    playTheme('spelling_factory_celebration');
    playTTS(`${charKey}_correct_${Math.floor(Math.random() * 3) + 1}`);
    setShowReward(true);

    if (level.isMilestone) {
      const timer = setTimeout(() => {
        playTheme('spelling_factory_pop');
        setShowReward(false);
        setShowPop(true);
      }, 1500);
      return () => clearTimeout(timer);
    }

    setTimeout(advanceLevel, 2200);
  }, [advanceLevel, charKey, hintsUsed, level, mistakes, onLevelComplete, saveStars]);

  const placeLetter = useCallback((slotId, expectedLetter, draggedLetter, poolItemId) => {
    if (placedLetters[slotId]) return;

    if (draggedLetter !== expectedLetter) {
      setMistakes((prev) => prev + 1);
      setHintPulse(true);
      playSound('fail');
      playTTS(`${charKey}_incorrect_${Math.floor(Math.random() * 3) + 1}`);
      setTimeout(() => setHintPulse(false), 1100);
      return;
    }

    playSound('ding');
    setPlacedLetters((prev) => {
      const next = { ...prev, [slotId]: draggedLetter };
      completeWord(next);
      return next;
    });
    setLettersPool((prev) => prev.filter((item) => item.id !== poolItemId));
    setSelectedLetter(null);
  }, [charKey, completeWord, placedLetters]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    placeLetter(over.id, over.data.current.expectedLetter, active.data.current.letter, active.id);
  };

  const handleSelectLetter = (id, letter) => {
    playSound('pop');
    setSelectedLetter((prev) => (prev?.id === id ? null : { id, letter }));
  };

  const handleRevealLetter = (id) => {
    playSound('click');
    setLettersPool((prev) => prev.map((item) => (item.id === id ? { ...item, revealed: true } : item)));
  };

  const handleReadHint = () => {
    setHintsUsed((prev) => prev + 1);
    setHintPulse(true);
    playLevelAudio();
    setTimeout(() => setHintPulse(false), 1300);
  };

  const handlePopComplete = () => {
    playTheme(level.station === 'find' ? 'spelling_factory_focus' : 'spelling_factory_main');
    advanceLevel();
  };

  const stationTitle = getStationTitle(level.station);
  const stationPrompt = getStationPrompt(level.station);

  if (completed) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${skin.bg} p-4`}>
        <div className="clay-card flex max-w-lg flex-col items-center p-8 text-center">
          <Trophy className="mb-4 h-20 w-20 text-yellow-500" />
          <h2 className="font-heading text-4xl text-slate-800">Factory Complete!</h2>
          <p className="mt-3 text-lg font-bold text-slate-600">You powered all 60 spelling machines.</p>
          <button type="button" onClick={onBack} className="clay-button mt-8 !bg-emerald-500 !px-8 !py-4 text-xl">
            Back to Island
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br ${skin.bg} p-3 sm:p-4`}>
      <MagicalEffects isCelebrating={showReward} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <motion.div
            key={item}
            className="absolute h-20 w-20 rounded-full bg-white/30 blur-sm"
            style={{ left: `${item * 13}%`, top: `${10 + (item % 4) * 22}%` }}
            animate={{ y: [0, -24, 0], opacity: [0.25, 0.65, 0.25] }}
            transition={{ duration: 4 + item * 0.4, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between rounded-[2rem] border border-white/60 bg-white/55 p-3 shadow-lg backdrop-blur-xl">
        <button type="button" onClick={onBack} className="clay-button !bg-white !p-3 !text-slate-600">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg">
            <Factory className="h-8 w-8" style={{ color: skin.accent }} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-xl text-slate-800 sm:text-3xl">Magic Letter Factory</h2>
            <p className="truncate text-xs font-black uppercase tracking-widest text-slate-500">
              Level {level.level}/60 - {stationTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-white/80 px-3 py-2 shadow">
          {[1, 2, 3].map((value) => (
            <Star key={value} className={`h-5 w-5 ${value <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
          ))}
        </div>
      </div>

      <div className="relative z-20 mx-auto mt-2 flex w-full max-w-5xl items-center justify-end">
        <label className="flex items-center gap-2 rounded-2xl bg-white/65 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-600 shadow backdrop-blur-md">
          <Map className="h-4 w-4" style={{ color: skin.accent }} />
          Factory Map
          <select
            value={level.level}
            onChange={(event) => jumpToLevel(Number(event.target.value))}
            className="rounded-xl border border-white/70 bg-white px-2 py-1 text-sm font-black normal-case tracking-normal text-slate-800 outline-none"
          >
            {levelChoices.map((choice) => (
              <option key={choice.level} value={choice.level}>
                L{choice.level} - {choice.word}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-3 overflow-hidden py-3 sm:gap-4">
          <div className={`rounded-[2rem] border border-white/60 ${skin.panel} p-3 shadow-xl backdrop-blur-xl sm:p-4`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-500">{stationPrompt}</p>
                <h3 className="font-heading text-2xl text-slate-800 sm:text-4xl">
                  {level.showWord ? `Build: ${level.word}` : level.hint}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReadHint}
                className="clay-button shrink-0 !px-4 !py-3"
                style={{ '--button-bg': skin.secondary }}
              >
                <Volume2 className="mr-2 h-5 w-5" />
                Hear Clue
              </button>
            </div>
          </div>

          <FactoryMachine level={level} skin={skin} placedCount={placedCount} totalLetters={level.word.length} />

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {level.word.split('').map((letter, index) => (
              <LetterSlot
                key={`slot-${level.level}-${index}`}
                id={`slot-${index}`}
                expectedLetter={letter}
                placedLetter={placedLetters[`slot-${index}`]}
                selectedLetter={selectedLetter}
                hintActive={hintPulse && nextSlotIndex === index}
                onPlace={(slotId, expectedLetter) => {
                  if (!selectedLetter) return;
                  placeLetter(slotId, expectedLetter, selectedLetter.letter, selectedLetter.id);
                }}
              />
            ))}
          </div>

          <div className={`mx-auto flex w-full max-w-4xl flex-wrap justify-center gap-2 rounded-[2rem] border-4 border-white/60 p-3 shadow-xl backdrop-blur-md sm:gap-3 sm:p-4
            ${level.station === 'sort' ? 'bg-slate-800/15' : 'bg-white/50'}
          `}>
            {lettersPool.map((item) => (
              <DraggableLetter
                key={item.id}
                item={item}
                selected={selectedLetter?.id === item.id}
                disabled={showReward || showPop}
                station={level.station}
                onSelect={handleSelectLetter}
                onReveal={handleRevealLetter}
              />
            ))}
          </div>
        </main>
      </DndContext>

      <AnimatePresence>
        {selectedLetter && !showReward && !showPop && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-yellow-100 px-6 py-3 text-center font-heading text-lg text-yellow-800 shadow-2xl"
          >
            Tap the matching socket for {selectedLetter.letter}
          </motion.div>
        )}

        {showReward && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-white/15 backdrop-blur-sm"
          >
            <div className="clay-card flex max-w-sm flex-col items-center p-8 text-center">
              <Wand2 className="mb-4 h-16 w-16" style={{ color: skin.accent }} />
              <h3 className="font-heading text-4xl text-slate-800">{theme?.rewardText || 'Magical!'}</h3>
              <p className="mt-2 text-lg font-bold text-slate-600">Machine powered: {level.word}</p>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3].map((value) => (
                  <Star key={value} className={`h-8 w-8 ${value <= stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {showPop && <PopCelebration theme={theme} level={level} onComplete={handlePopComplete} />}
      </AnimatePresence>
    </div>
  );
}
