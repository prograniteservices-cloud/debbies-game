import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, BarChart, Settings, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function ParentDashboard({ onBack }) {
  const [profiles, setProfiles] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: profilesData } = await supabase.from('profiles').select('*');
        const { data: scoresData } = await supabase.from('scores').select('*');
        
        if (profilesData) setProfiles(profilesData);
        if (scoresData) setScores(scoresData);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const getProfileScores = (profileId) => {
    return scores.filter(s => s.profile_id === profileId);
  };

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="w-full bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
            Parent Dashboard
          </h1>
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 sm:p-10 flex flex-col gap-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.map(profile => {
              const profileScores = getProfileScores(profile.id);
              const mathScore = profileScores.find(s => s.game_mode === 'counting');
              const spellScore = profileScores.find(s => s.game_mode === 'spelling');

              return (
                <motion.div 
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner ${profile.theme_id === 'unicorn' ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-500' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-500'}`}>
                      {profile.theme_id === 'unicorn' ? '🦄' : '🐱'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 dark:text-white capitalize">
                        {profile.display_name}
                      </h2>
                      <p className="text-slate-500 flex items-center gap-1 text-sm font-semibold">
                        <Clock className="w-4 h-4" /> 
                        Last active: {new Date(profile.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center">
                          <BarChart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300">Numbers Game</p>
                          <p className="text-sm text-slate-500">Max Level: {mathScore?.max_level || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-indigo-500">{mathScore?.max_score || 0}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Score</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500 flex items-center justify-center">
                          <BarChart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-300">Spelling Quest</p>
                          <p className="text-sm text-slate-500">Max Level: {spellScore?.max_level || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-emerald-500">{spellScore?.max_score || 0}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Score</p>
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
                <p>Start playing to see statistics here!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
