import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, BarChart, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { THEMES } from '../themes';

export default function ParentDashboard({ onBack }) {
  const [profiles, setProfiles] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });
      
      const { data: scoresData, error: scoresError } = await supabase
        .from('scores')
        .select('*');

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        setError(`Could not load profiles: ${profilesError.message}`);
      } else if (!profilesData && !scoresData) {
        // This usually means a network failure happened before the response
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl || supabaseUrl.includes('MISSING')) {
          setError("⚠️ Supabase URL is missing or incorrect in Vercel. Please check your Environment Variables.");
        } else {
          setError("⚠️ Connection failed. Please check your internet or Supabase project status.");
        }
      }
      if (scoresError) {
        console.error('Scores error:', scoresError);
      }
      
      // Use Supabase data if available, otherwise fall back to local
      let finalProfiles = profilesData || [];
      let finalScores = scoresData || [];
      
      // If Supabase returned empty, try to reconstruct from localStorage
      if (finalProfiles.length === 0) {
        const savedId = localStorage.getItem('debbies_game_profile_id');
        if (savedId) {
          // Try a direct lookup for this specific profile
          const { data: singleProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', savedId)
            .maybeSingle();
          
          if (singleProfile) {
            finalProfiles = [singleProfile];
            
            // Also fetch their scores
            const { data: singleScores } = await supabase
              .from('scores')
              .select('*')
              .eq('profile_id', savedId);
            
            if (singleScores) finalScores = singleScores;
          } else {
            // Profile exists in localStorage but not in Supabase — show local info
            finalProfiles = [{
              id: savedId,
              display_name: 'Player',
              theme_id: 'unicorn',
              updated_at: new Date().toISOString(),
              _local: true,
            }];
          }
        }
      }
      
      setProfiles(finalProfiles);
      setScores(finalScores);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setError('Something went wrong loading data.');
    } finally {
      setLoading(false);
    }
  }

  const getProfileScores = (profileId) => {
    return scores.filter(s => s.profile_id === profileId);
  };

  const getThemeEmoji = (themeId) => {
    switch(themeId) {
      case 'unicorn': return '🦄';
      case 'werecat': return '🐲';
      case 'milo': return '⚔️';
      case 'luna': return '🌙';
      default: return '🎮';
    }
  };

  const getThemeColors = (themeId) => {
    switch(themeId) {
      case 'unicorn': return { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-500' };
      case 'werecat': return { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-500' };
      case 'milo': return { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-500' };
      case 'luna': return { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-500' };
      default: return { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-500' };
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="w-full bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Parent Dashboard
          </h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full font-bold transition-colors cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8">
        {error && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 text-amber-700 dark:text-amber-400 text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {profiles.map(profile => {
              const profileScores = getProfileScores(profile.id);
              const mathScore = profileScores.find(s => s.game_mode === 'counting');
              const spellScore = profileScores.find(s => s.game_mode === 'spelling');
              const themeColors = getThemeColors(profile.theme_id);

              return (
                <motion.div 
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-inner ${themeColors.bg} ${themeColors.text}`}>
                      {getThemeEmoji(profile.theme_id)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white capitalize truncate">
                        {profile.display_name || THEMES[profile.theme_id]?.name || 'Player'}
                      </h2>
                      <p className="text-slate-500 flex items-center gap-1 text-xs sm:text-sm font-semibold">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" /> 
                        Last active: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Unknown'}
                      </p>
                      {profile._local && (
                        <p className="text-xs text-amber-500 font-bold mt-1">📱 Local device only</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center">
                          <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">Numbers Game</p>
                          <p className="text-xs sm:text-sm text-slate-500">Max Level: {mathScore?.max_level || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-black text-indigo-500">{mathScore?.max_score || 0}</p>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Score</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500 flex items-center justify-center">
                          <BarChart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm sm:text-base">Spelling Quest</p>
                          <p className="text-xs sm:text-sm text-slate-500">Max Level: {spellScore?.max_level || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-black text-emerald-500">{spellScore?.max_score || 0}</p>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Score</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {profiles.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Profiles Found</h3>
                <p className="mb-4">Start playing to see statistics here!</p>
                <p className="text-sm text-slate-400">Go back and select a character to begin.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
