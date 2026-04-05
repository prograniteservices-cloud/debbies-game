import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles } from 'lucide-react';
import { playTheme, stopTheme } from './audio/soundEngine';
import CountingLevel from './components/CountingLevel';
import SpellingGame from './components/SpellingGame';
import CursorSparkles from './components/CursorSparkles';
import PoppingLevel from './components/PoppingLevel';
import ProfileScreen from './components/ProfileScreen';
import Achievements from './components/Achievements';
import ParentDashboard from './components/ParentDashboard';
import { THEMES } from './themes';
import { supabase } from './supabaseClient';

function App() {
  const [gameState, setGameState] = useState('PROFILE'); // PROFILE, LANDING, COUNTING, SPELLING, POPPING, ACHIEVEMENTS
  const [returnState, setReturnState] = useState(null); // the game to return to after POPPING
  const [levelInfo, setLevelInfo] = useState({ level: 1, score: 0 });
  const [themeId, setThemeId] = useState('unicorn'); // 'unicorn' | 'werecat'
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    // Check if we have a saved profile ID
    const savedId = localStorage.getItem('debbies_game_profile_id');
    if (savedId) {
      setProfileId(savedId);
      loadProfileData(savedId);
    }
  }, []);

  const loadProfileData = async (id) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setThemeId(data.theme_id);
        setGameState('LANDING');
        playTheme(data.theme_id);
        // also load max score for counting mode
        const { data: scoreData } = await supabase
          .from('scores')
          .select('*')
          .eq('profile_id', id)
          .eq('game_mode', 'counting')
          .single();
        if (scoreData) {
          setLevelInfo({ level: scoreData.max_level, score: scoreData.max_score });
        }
      }
    } catch (err) {
      console.error('Error loading profile', err);
    }
  };

  const handleSelectProfile = async (selectedThemeId) => {
    let id = profileId;
    if (!id) {
      id = uuidv4();
      setProfileId(id);
      localStorage.setItem('debbies_game_profile_id', id);
    }
    
    setThemeId(selectedThemeId === 'debbie' ? 'unicorn' : 'werecat');
    setGameState('LANDING');
    playTheme(selectedThemeId === 'debbie' ? 'unicorn' : 'werecat');

    // Save/upsert profile to Supabase
    await supabase.from('profiles').upsert({
      id: id,
      display_name: selectedThemeId === 'debbie' ? 'Debbie' : 'Bubba',
      theme_id: selectedThemeId === 'debbie' ? 'unicorn' : 'werecat',
      updated_at: new Date().toISOString()
    });
  };

  const theme = THEMES[themeId];

  const handleStartGame = (game) => {
    stopTheme();
    setGameState(game);
  };

  const handleLevelComplete = async () => {
    setLevelInfo(prev => {
      const newScore = prev.score + 1;
      const newLevel = Math.floor(newScore / 5) + 1;
      
      // If the level increased, switch to POPPING state
      if (newLevel > prev.level) {
        setReturnState(gameState); // save current game mode (COUNTING)
        setGameState('POPPING');
      }

      // Upsert score to Supabase
      if (profileId) {
        supabase.from('scores').upsert({
          profile_id: profileId,
          game_mode: gameState === 'COUNTING' ? 'counting' : 'spelling',
          max_level: newLevel,
          max_score: newScore,
          updated_at: new Date().toISOString()
        }, { onConflict: 'profile_id,game_mode' }).then(({ error }) => {
          if (error) console.error("Error saving score:", error);
        });
      }
      
      return { score: newScore, level: newLevel };
    });
  };

  const bgTheme = useMemo(() => {
    return theme.bgThemes[(levelInfo.level - 1) % theme.bgThemes.length];
  }, [levelInfo.level, themeId]);

  const isWerecat = themeId === 'werecat';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${bgTheme} overflow-hidden relative font-sans text-slate-800 dark:text-slate-100 selection:bg-pink-300 transition-colors duration-[3000ms]`}>
      <CursorSparkles />
      <AnimatePresence mode="wait">
        {gameState === 'PROFILE' && (
          <ProfileScreen
            key="profile"
            onSelectProfile={handleSelectProfile}
            onOpenParentDashboard={() => setGameState('PARENT_DASHBOARD')}
          />
        )}

        {gameState === 'LANDING' && (
          <motion.div
            key="landing"
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center gap-6 z-10 w-full px-4"
          >
            <div className={`p-8 sm:p-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-[3rem] shadow-2xl border-4 ${theme.cardBorder} max-w-lg w-full`}>

              {/* Profile Header */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => {
                    localStorage.removeItem('debbies_game_profile_id');
                    setProfileId(null);
                    stopTheme();
                    setGameState('PROFILE');
                  }}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
                >
                  ← Switch Profile
                </button>
                <button
                  onClick={() => setGameState('ACHIEVEMENTS')}
                  className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 rounded-full text-sm font-bold text-yellow-700 dark:text-yellow-400 transition-colors border border-yellow-300 dark:border-yellow-600 shadow-sm cursor-pointer"
                >
                  🏆 Achievements
                </button>
              </div>

              {/* Mascot */}
              <div className="flex justify-center mb-4">
                <motion.div
                  key={themeId}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <AnimatePresence mode="wait">
                    {isWerecat ? (
                      <motion.img
                        key="werecat"
                        src="/assets/werecat_king.png"
                        alt="Werecat King"
                        className="w-28 h-28 object-contain drop-shadow-2xl"
                        style={{ mixBlendMode: 'multiply' }}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
                        transition={{ y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }, scale: { type: 'spring' } }}
                      />
                    ) : (
                      <motion.div
                        key="sparkles"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      >
                        <Sparkles className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.h1
                key={`title-${themeId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient} mb-3 text-center leading-tight tracking-tight`}
              >
                {theme.name}
              </motion.h1>

              <motion.p
                key={`tag-${themeId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-bold text-center mb-8"
              >
                {theme.tagline}
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <button
                  onClick={() => handleStartGame('COUNTING')}
                  className={`px-6 py-4 bg-gradient-to-r ${theme.mathBtn} text-white rounded-full text-xl font-black shadow-xl border-b-8 active:border-b-0 active:translate-y-2 transition-all cursor-pointer w-full tracking-wide`}
                >
                  Numbers Base
                </button>
                <button
                  onClick={() => handleStartGame('SPELLING')}
                  className={`px-6 py-4 bg-gradient-to-r ${theme.spellBtn} text-white rounded-full text-xl font-black shadow-xl border-b-8 active:border-b-0 active:translate-y-2 transition-all cursor-pointer w-full tracking-wide`}
                >
                  Spelling Quest
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'COUNTING' && (
          <motion.div
            key="counting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full"
          >
            <CountingLevel
              levelInfo={levelInfo}
              onLevelComplete={handleLevelComplete}
              onBack={() => setGameState('LANDING')}
              theme={theme}
            />
          </motion.div>
        )}

        {gameState === 'SPELLING' && (
          <motion.div
            key="spelling"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full"
          >
            <SpellingGame onBack={() => setGameState('LANDING')} theme={theme} />
          </motion.div>
        )}

        {gameState === 'POPPING' && (
          <motion.div
            key="popping"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full bg-slate-900"
          >
            <PoppingLevel 
              theme={theme} 
              onComplete={() => setGameState(returnState || 'LANDING')} 
            />
          </motion.div>
        )}

        {gameState === 'ACHIEVEMENTS' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full bg-black/20 backdrop-blur-sm"
          >
            <Achievements
              profileId={profileId}
              onBack={() => setGameState('LANDING')}
              theme={theme}
            />
          </motion.div>
        )}

        {gameState === 'PARENT_DASHBOARD' && (
          <motion.div
            key="parent_dashboard"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-50 w-full h-full bg-white"
          >
            <ParentDashboard onBack={() => setGameState('PROFILE')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
