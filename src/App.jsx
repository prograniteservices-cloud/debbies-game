import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { animate } from 'animejs';
import { 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  Settings, 
  Map as MapIcon, 
  Sparkles, 
  MousePointer2,
  ChevronRight,
  Volume2, 
  VolumeX, 
  ArrowLeft,
  Shapes,
  Brain
} from 'lucide-react';
import { playTheme, stopTheme, resumeAudio, playSound, setMuted, isSoundMuted } from './audio/soundEngine';
import CountingLevel from './components/CountingLevel';
import SpellingGame from './components/SpellingGame';
import CursorSparkles from './components/CursorSparkles';
import PoppingLevel from './components/PoppingLevel';
import ProfileScreen from './components/ProfileScreen';
import Achievements from './components/Achievements';
import ParentDashboard from './components/ParentDashboard';
import PatternPath from './components/PatternPath';
import MemoryMeadow from './components/MemoryMeadow';
import { THEMES } from './themes';
import { supabase } from './supabaseClient';

function App() {
  const [gameState, setGameState] = useState('PROFILE'); // PROFILE, LANDING, COUNTING, SPELLING, POPPING, ACHIEVEMENTS, PATTERNS, MEMORY
  const [returnState, setReturnState] = useState(null); // the game to return to after POPPING
  const [levelInfo, setLevelInfo] = useState({ level: 1, score: 0 });
  const [themeId, setThemeId] = useState('unicorn'); // 'unicorn' | 'werecat'
  const [profileId, setProfileId] = useState(null);
  const [muted, setMutedState] = useState(false);

  // Resume audio context on first user interaction (required by mobile browsers)
  useEffect(() => {
    const handleInteraction = () => {
      resumeAudio();
    };
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

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
    // Resume audio context on user action
    resumeAudio();
    
    let id = profileId;
    if (!id) {
      id = uuidv4();
      setProfileId(id);
      localStorage.setItem('debbies_game_profile_id', id);
    }
    
    // selectedThemeId is one of: 'unicorn', 'werecat', 'milo', 'luna'
    setThemeId(selectedThemeId);
    setGameState('LANDING');
    playTheme(selectedThemeId);

    // Save/upsert profile to Supabase
    const { error } = await supabase.from('profiles').upsert({
      id: id,
      display_name: THEMES[selectedThemeId].name,
      theme_id: selectedThemeId,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error('Error saving profile:', error);
    }
  };

  const theme = THEMES[themeId];

  const handleStartGame = (game) => {
    stopTheme();
    setGameState(game);
  };

  const handleLevelComplete = async () => {
    const prev = levelInfo;
    const newScore = prev.score + 1;
    const newLevel = Math.floor(newScore / 5) + 1;
    const isLevelUp = newLevel > prev.level;

    // Update level info
    setLevelInfo({ ...prev, score: newScore, level: newLevel });

    // Handle level up transition
    if (isLevelUp) {
      setReturnState(gameState);
      setGameState('POPPING');
    }

    // Upsert score to Supabase
    if (profileId) {
      const gameMode = (gameState === 'COUNTING' || returnState === 'COUNTING') ? 'counting' : 'spelling';
      console.log(`Saving score for ${profileId} in mode ${gameMode}: Level ${newLevel}, Score ${newScore}`);
      
      supabase.from('scores').upsert({
        profile_id: profileId,
        game_mode: gameMode,
        max_level: newLevel,
        max_score: newScore,
        updated_at: new Date().toISOString()
      }, { onConflict: 'profile_id,game_mode' }).then(({ error }) => {
        if (error) {
          console.error("❌ Supabase Save Failed:", error);
          // Fallback: save to localStorage
          localStorage.setItem(`score_${profileId}_${gameMode}`, JSON.stringify({ level: newLevel, score: newScore }));
        } else {
          console.log("✅ Score saved successfully!");
        }
      }).catch(err => {
        console.error("🔥 Unexpected Save Error:", err);
      });
    }
  };

  const bgTheme = useMemo(() => {
    return theme.bgThemes[(levelInfo.level - 1) % theme.bgThemes.length];
  }, [levelInfo.level, themeId]);

  const toggleMute = () => {
    const newMuted = !muted;
    setMutedState(newMuted);
    setMuted(newMuted);
    if (newMuted) {
      stopTheme();
    } else if (gameState === 'LANDING') {
      playTheme(themeId);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-start sm:justify-center h-[100dvh] overflow-hidden relative font-sans text-slate-800 dark:text-slate-100 selection:bg-pink-300 transition-colors duration-[3000ms]`}>
      <div className="aurora-bg">
        <div className="aurora-blob bg-pink-300 -top-20 -left-20" />
        <div className="aurora-blob bg-purple-300 top-1/2 -right-20" style={{ animationDelay: '-5s' }} />
        <div className="aurora-blob bg-blue-300 -bottom-20 left-1/2" style={{ animationDelay: '-10s' }} />
      </div>
      <CursorSparkles />
      
      {/* Sound toggle — always visible except on profile screen */}
      {gameState !== 'PROFILE' && gameState !== 'PARENT_DASHBOARD' && (
        <button
          onClick={toggleMute}
          className="fixed top-4 right-4 z-[100] p-3 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-full hover:bg-white/40 dark:hover:bg-black/40 transition-all shadow-lg border border-white/20 cursor-pointer"
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          ) : (
            <Volume2 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          )}
        </button>
      )}

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center p-2 sm:p-4 w-full max-w-4xl z-10 max-h-full"
          >
            <div className="clay-card !p-3 sm:!p-8 w-full flex flex-col items-center bg-white/90 relative overflow-y-auto max-h-[95vh] sm:max-h-none">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-5" />
              
              <div className="w-full flex justify-between items-center mb-1 sm:mb-4 relative z-20">
                <button
                  onClick={() => {
                    localStorage.removeItem('debbies_game_profile_id');
                    setProfileId(null);
                    stopTheme();
                    setGameState('PROFILE');
                  }}
                  className="clay-button !bg-slate-100 !text-slate-600 !px-4 !py-2 !text-xs !border-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Switch
                </button>
                <button
                  onClick={() => setGameState('ACHIEVEMENTS')}
                  className="clay-button !bg-yellow-100 !text-yellow-600 !px-4 !py-2 !text-xs !border-2"
                >
                  <Trophy className="w-4 h-4 mr-2" /> Trophies
                </button>
              </div>

              <motion.div
                whileHover={{ rotateY: 15, rotateX: -15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 sm:w-32 sm:h-32 mb-1 sm:mb-2 relative perspective-1000"
              >
                <div className="clay-card !rounded-full p-3 w-full h-full bg-white shadow-lg flex items-center justify-center">
                  <img
                    src={theme.mascotImg}
                    alt={theme.mascotAlt}
                    className={`w-full h-full object-contain ${theme.glowClass}`}
                    onError={(e) => {
                      e.target.src = '/assets/unicorn_queen.png';
                      e.target.className = 'w-full h-full object-contain p-4';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full shadow-md border-2 border-white animate-bounce">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </motion.div>

              <h1 className="text-xl sm:text-4xl font-black text-slate-800 mb-0 font-heading tracking-tight text-center">
                Unicorn Island
              </h1>
              <p className="text-slate-500 font-bold mb-3 sm:mb-4 text-sm sm:text-base tracking-wide uppercase font-heading">
                Welcome, {theme.name}!
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
                <MenuButton 
                  icon={Gamepad2} 
                  label="Numbers" 
                  onClick={() => handleStartGame('COUNTING')} 
                  color="#7a5fff"
                />
                <MenuButton 
                  icon={BookOpen} 
                  label="Spelling" 
                  onClick={() => handleStartGame('SPELLING')} 
                  color="#ff7eb9"
                />
                <MenuButton 
                  icon={Shapes} 
                  label="Patterns" 
                  onClick={() => handleStartGame('PATTERNS')} 
                  color="#facc15"
                />
                <MenuButton 
                  icon={Brain} 
                  label="Memory" 
                  onClick={() => handleStartGame('MEMORY')} 
                  color="#2dd4bf"
                />
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

        {gameState === 'PATTERNS' && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full"
          >
            <PatternPath onBack={() => setGameState('LANDING')} theme={theme} />
          </motion.div>
        )}

        {gameState === 'MEMORY' && (
          <motion.div
            key="memory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full"
          >
            <MemoryMeadow onBack={() => setGameState('LANDING')} theme={theme} />
          </motion.div>
        )}

        {gameState === 'ACHIEVEMENTS' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex flex-col items-center z-10 w-full h-full bg-black/20 backdrop-blur-sm overflow-y-auto"
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

const MenuButton = ({ icon: Icon, label, onClick, color }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Reduced from 0.2 to 0.1 for better stability
    setMousePos({ x: x * 0.1, y: y * 0.1 });
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      animate={{ 
        x: mousePos.x, 
        y: mousePos.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.1 }}
      onClick={onClick}
      className="clay-button group relative overflow-hidden pointer-events-auto"
      style={{ '--button-bg': color }}
    >
      <div className="flex items-center justify-center w-full relative z-10">
        <Icon className={`w-6 h-6 mr-3 ${isHovered ? 'rotate-12' : ''} transition-transform`} />
        <span className="flex-1 text-left">{label}</span>
        <ChevronRight className={`w-5 h-5 ml-2 ${isHovered ? 'translate-x-1' : ''} transition-transform opacity-50`} />
      </div>
    </motion.button>
  );
};

export default App;
