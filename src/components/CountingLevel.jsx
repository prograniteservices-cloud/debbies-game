import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowLeft } from 'lucide-react';
import MultiChoiceGame from './math/MultiChoiceGame';
import NumberMagnet from './math/NumberMagnet';
import TargetBlast from './math/TargetBlast';
import EquationBuilder from './math/EquationBuilder';
import { getMathMode, getZoneLabel } from '../utils/mathEngine';

export default function CountingLevel({ levelInfo, onLevelComplete, onBack, theme }) {
  const mode = getMathMode(levelInfo.level);
  const zoneLabel = getZoneLabel(levelInfo.level);

  let GameComponent;
  switch (mode) {
    case 'magnet':
      GameComponent = NumberMagnet;
      break;
    case 'blast':
      GameComponent = TargetBlast;
      break;
    case 'builder':
      GameComponent = EquationBuilder;
      break;
    case 'multichoice':
    default:
      GameComponent = MultiChoiceGame;
      break;
  }

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden bg-transparent pointer-events-auto">
      {/* Universal Header */}
      <div className="py-4 w-full flex shrink-0 justify-between items-center px-6 sm:px-8 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md z-50 border-b border-white/30 dark:border-slate-700/50 shadow-sm relative">
        <button onClick={onBack} className="p-2 sm:px-4 sm:py-2 bg-white/60 dark:bg-slate-700/60 rounded-full hover:bg-white transition-colors cursor-pointer flex items-center gap-2 group">
          <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-bold text-slate-700 dark:text-slate-300">Map</span>
        </button>
        
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {zoneLabel}
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-200 drop-shadow-sm">
            Level {levelInfo.level}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-700/60 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-amber-500 text-amber-500 animate-pulse" />
          <span className="text-xl sm:text-2xl font-black text-amber-500 drop-shadow-sm">
            {levelInfo.score}
          </span>
        </div>
      </div>

      {/* Mode Content */}
      <div className="flex-1 w-full min-h-0 relative isolate">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${levelInfo.level}-${mode}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <GameComponent 
              levelInfo={levelInfo} 
              onLevelComplete={onLevelComplete} 
              theme={theme} 
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
