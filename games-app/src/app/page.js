'use client';

import React, { useState } from 'react';
import AnimalHunt from '../components/games/AnimalHunt';
import MusicalRoom from '../components/games/MusicalRoom';
import { Ghost, Music, LayoutGrid, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame === 'animal') {
    return (
      <>
        <button 
          onClick={() => setActiveGame(null)}
          className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <AnimalHunt />
      </>
    );
  }

  if (activeGame === 'musical') {
    return (
      <>
        <button 
          onClick={() => setActiveGame(null)}
          className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <MusicalRoom />
      </>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#020617] text-white">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Magical Game Box
          </h1>
          <p className="text-slate-400 text-xl font-medium">Choose a magical world to explore</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Animal Hunt Card */}
          <button
            onClick={() => setActiveGame('animal')}
            className="group relative flex flex-col items-center p-12 bg-white/5 hover:bg-white/10 rounded-[3rem] border border-white/10 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            <div className="mb-6 p-6 bg-amber-400/20 rounded-3xl group-hover:bg-amber-400/30 transition-colors">
              <Ghost size={48} className="text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Animal Hunt</h2>
            <p className="text-slate-400">Explore the blocky meadow and find all the hidden animals.</p>
            <div className="mt-8 px-6 py-2 bg-amber-400 text-amber-950 font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Let's Play!
            </div>
          </button>

          {/* Musical Room Card */}
          <button
            onClick={() => setActiveGame('musical')}
            className="group relative flex flex-col items-center p-12 bg-white/5 hover:bg-white/10 rounded-[3rem] border border-white/10 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            <div className="mb-6 p-6 bg-indigo-400/20 rounded-3xl group-hover:bg-indigo-400/30 transition-colors">
              <Music size={48} className="text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Music Room</h2>
            <p className="text-slate-400">Tap glowing pads to make magical music and light up the dark.</p>
            <div className="mt-8 px-6 py-2 bg-indigo-400 text-white font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Let's Jam!
            </div>
          </button>
        </div>

        <div className="pt-12">
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Ambient Companion Experience</p>
        </div>
      </div>
    </main>
  );
}
