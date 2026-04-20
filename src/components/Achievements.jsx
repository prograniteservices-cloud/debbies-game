import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Sparkles, Map, Star, Award, Zap, Trophy, Goal, ArrowLeft, RotateCw } from 'lucide-react';

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

  useEffect(() => {
    const fetchScores = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .eq('profile_id', profileId);
          
        if (!error && data) {
          const scoreDict = {};
          data.forEach(s => scoreDict[s.game_mode] = s);
          
          // Merge with local fallback
          const localScores = JSON.parse(localStorage.getItem('debbies_game_local_scores') || '{}');
          Object.keys(localScores).forEach(mode => {
            if (!scoreDict[mode] || localScores[mode].max_score > (scoreDict[mode].max_score || 0)) {
              scoreDict[mode] = localScores[mode];
            }
          });
          
          setScores(scoreDict);
        } else if (error) {
          console.error('Error fetching scores:', error);
          // Pure local fallback
          const localScores = JSON.parse(localStorage.getItem('debbies_game_local_scores') || '{}');
          setScores(localScores);
        }
      } catch (err) {
        console.error('Error in fetchScores:', err);
        const localScores = JSON.parse(localStorage.getItem('debbies_game_local_scores') || '{}');
        setScores(localScores);
      }
      setLoading(false);
    };
    
    fetchScores();
  }, [profileId]);

  const earnedAchievements = useMemo(() => {
    return ACHIEVEMENTS_DATA.filter(ach => ach.check(scores)).map(a => a.id);
  }, [scores]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex flex-col items-center justify-start w-full h-full max-w-4xl p-4 sm:p-6 md:p-10 z-10 overflow-y-auto"
    >
      <div className="w-full clay-card p-6 sm:p-8 md:p-12 mb-8 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgThemes[0]} opacity-5`} />
        
        <div className="flex justify-between items-center mb-8 sm:mb-10 w-full relative z-10">
          <button
            onClick={onBack}
            className="clay-button !bg-slate-100 !text-slate-600 !px-4 !py-2 !text-sm !border-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <h1 className={`absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl md:text-5xl font-black text-slate-800 font-heading tracking-tight pointer-events-none`}>
            Trophy Room
          </h1>
          
          <div className="w-[80px] sm:w-[124px]" /> 
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-xl font-bold text-slate-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <RotateCw className="w-12 h-12" />
            </motion.div>
            <p className="mt-4">Loading your treasures...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ACHIEVEMENTS_DATA.map((ach, index) => {
              const isEarned = earnedAchievements.includes(ach.id);
              const Icon = ach.icon;
              
              return (
                <motion.div 
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15
                  }}
                  className={`relative overflow-hidden clay-card p-5 sm:p-6 flex flex-col items-center text-center transition-all duration-300 z-10
                    ${isEarned 
                      ? 'bg-white shadow-xl scale-100' 
                      : 'bg-slate-50/50 border-slate-200/30 achievement-locked'
                    }
                  `}
                >
                  <div className={`p-3 sm:p-4 rounded-full mb-3 sm:mb-4 ${ach.bgColor}`}>
                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${ach.color}`} />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 font-heading tracking-wide text-slate-800 dark:text-slate-100">
                    {ach.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {ach.description}
                  </p>
                  
                  {isEarned && (
                    <div className="absolute top-3 right-3 text-yellow-400 drop-shadow-md">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
