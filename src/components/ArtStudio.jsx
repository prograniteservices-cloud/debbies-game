import { motion } from 'framer-motion';
import { ArrowLeft, Play, Sparkles, Image as ImageIcon, Music } from 'lucide-react';
import { useState } from 'react';

const GalleryItem = ({ title, type, src, index, theme }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: y * -20 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      style={{
        rotateX: mousePos.y,
        rotateY: mousePos.x,
        transformStyle: "preserve-3d"
      }}
      className="relative group cursor-pointer perspective-1000 w-full aspect-square sm:aspect-auto sm:h-64"
    >
      <div className="glass-card w-full h-full p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 relative border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Media Container */}
        <div 
          className="w-full flex-1 rounded-xl mb-3 overflow-hidden relative shadow-inner flex items-center justify-center bg-slate-900/5"
          style={{ transform: 'translateZ(30px)' }}
        >
          {src ? (
            <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              {type === 'video' ? <Play className="w-12 h-12 mb-2 opacity-50" /> : type === 'music' ? <Music className="w-12 h-12 mb-2 opacity-50" /> : <ImageIcon className="w-12 h-12 mb-2 opacity-50" />}
              <span className="text-xs uppercase tracking-widest font-bold">Generating...</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full text-center" style={{ transform: 'translateZ(40px)' }}>
          <h3 className="text-sm sm:text-base font-black text-slate-800 font-heading mb-1">{title}</h3>
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-500">
            {type === 'video' && <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-200">Veo Video</span>}
            {type === 'image' && <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full border border-pink-200">Gemini Nanobana</span>}
            {type === 'music' && <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">Gemini Music</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ArtStudio({ onBack, theme }) {
  const items = [
    { title: 'Debbie in the Clouds', type: 'image', src: '/assets/character_debbie.png' },
    { title: 'Bubba\'s Mischief', type: 'image', src: '/assets/character_bubba.png' },
    { title: 'Milo the Explorer', type: 'image', src: '/assets/character_milo.png' },
    { title: 'Luna\'s Galaxy', type: 'image', src: '/assets/character_luna.png' },
    { title: 'Unicorn Island Intro', type: 'video', src: null },
    { title: 'Magical Soundtrack', type: 'music', src: null },
  ];

  return (
    <div className="flex flex-col items-center w-full h-full overflow-hidden bg-transparent pointer-events-auto">
      {/* Premium Header */}
      <div className="py-4 w-full flex shrink-0 justify-between items-center px-6 sm:px-12 bg-white/20 backdrop-blur-xl z-50 border-b border-white/20 shadow-sm relative">
        <button onClick={onBack} className="clay-button !bg-white/50 hover:!bg-white/80 backdrop-blur-md !text-slate-600 !px-4 !py-2 !text-sm !border border-white/40 group transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform mr-1" />
          <span className="hidden sm:inline">Back to Menu</span>
        </button>
        
        <div className="flex items-center gap-3" style={{ transform: 'translateZ(50px)' }}>
          <Sparkles className={`w-6 h-6 ${theme.iconSets[2].color} animate-pulse`} />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            Magic Studio
          </h1>
        </div>
        
        <div className="w-24 hidden sm:block" /> {/* Spacer */}
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden p-6 sm:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto pb-20"
        >
          {items.map((item, i) => (
            <GalleryItem key={i} index={i} {...item} theme={theme} />
          ))}
        </motion.div>
      </div>
      
      {/* Depth Decorators */}
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-pink-400/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
