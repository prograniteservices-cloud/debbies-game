import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { popIn } from '../utils/animeEffects';
import { Sparkles, Map, Star, Award, Zap, Trophy, Goal, AwardIcon } from 'lucide-react';

const ACHIEVEMENTS_DATA = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Play your first game mode.',
    icon: Award,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
    check: (scores) => scores.counting?.max_score > 0 || scores.spelling?.max_score > 0
  },
  {
    id: 'magic_mapper',
    title: 'Magic Mapper',
    description: 'Reach Level 5 in Number Base.',
    icon: Map,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/40',
    check: (scores) => scores.counting?.max_level >= 5
  },
  {
    id: 'word_wizard',
    title: 'Word Wizard',
    description: 'Reach Level 5 in Spelling Quest.',
    icon: Zap,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/40',
    check: (scores) => scores.spelling?.max_level >= 5
  },
  {
    id: 'double_digits',
    title: 'Double Digits',
    description: 'Reach Level 10 in Number Base.',
    icon: Trophy,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100 dark:bg-orange-900/40',
    check: (scores) => scores.counting?.max_level >= 10
  },
  {
    id: 'super_speller',
    title: 'Super Speller',
    description: 'Reach Level 10 in Spelling Quest.',
    icon: Star,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/40',
    check: (scores) => scores.spelling?.max_level >= 10
  },
  {
    id: 'golden_star',
    title: 'Golden Star',
    description: 'Earn 100 points total across all games.',
    icon: Goal,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
    check: (scores) => (scores.counting?.max_score || 0) + (scores.spelling?.max_score || 0) >= 100
  }
];

export default function Achievements({ profileId, onBack, theme }) {
  const [scores, setScores] = useState({ counting: null, spelling: null });
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchScores = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('profile_id', profileId);
        
      if (!error && data) {
        const scoreDict = {};
        data.forEach(s => scoreDict[s.game_mode] = s);
        setScores(scoreDict);
      }
      setLoading(false);
    };
    
    fetchScores();
  }, [profileId]);

  useEffect(() => {
    if (!loading && gridRef.current) {
      popIn(gridRef.current.querySelectorAll('.achievement-card'));
    }
  }, [loading]);

  const earnedAchievements = useMemo(() => {
    return ACHIEVEMENTS_DATA.filter(ach => ach.check(scores)).map(a => a.id);
  }, [scores]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex flex-col items-center justify-start w-full h-full max-w-4xl p-6 md:p-10 z-10"
    >
      <div className={`w-full glass-card rounded-[3rem] p-8 md:p-12 mb-8 border-4 ${theme.cardBorder}`}>
        <div className="flex justify-between items-center mb-10 w-full relative">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer z-20"
          >
            ← Back to Map
          </button>
          
          <h1 className={`absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient} tracking-tight pointer-events-none`}>
            Trophy Room
          </h1>
          
          <div className="w-[124px]" /> {/* Empty spacer to balance "Back" button */}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-xl font-bold text-slate-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              ⭐
            </motion.div>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS_DATA.map((ach) => {
              const isEarned = earnedAchievements.includes(ach.id);
              const Icon = ach.icon;
              
              return (
                <div 
                  key={ach.id} 
                  className={`achievement-card opacity-0 transform-gpu relative overflow-hidden rounded-3xl p-6 border-4 flex flex-col items-center text-center transition-all duration-300
                    ${isEarned 
                      ? `bg-white/90 dark:bg-slate-800/90 shadow-xl ${theme.cardBorder}` 
                      : 'bg-slate-100/50 dark:bg-slate-900/50 border-transparent achievement-locked'
                    }
                  `}
                >
                  <div className={`p-4 rounded-full mb-4 ${ach.bgColor}`}>
                    <Icon className={`w-10 h-10 ${ach.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 font-heading tracking-wide text-slate-800 dark:text-slate-100">
                    {ach.title}
                  </h3>
                  
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {ach.description}
                  </p>
                  
                  {isEarned && (
                    <div className="absolute top-3 right-3 text-yellow-400 drop-shadow-md">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
