'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Pad Component ---

function Pad({ position, color, note, synth, onTrigger }) {
  const [active, setActive] = useState(false);
  const meshRef = useRef();

  const handleDown = () => {
    setActive(true);
    if (synth) {
      synth.triggerAttackRelease(note, '8n');
    }
    onTrigger(color);
    setTimeout(() => setActive(false), 200);
  };

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1.8, 0.4, 1.8]}
        radius={0.1}
        smoothness={4}
        onPointerDown={handleDown}
        scale={active ? [0.95, 0.8, 0.95] : [1, 1, 1]}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 10 : 1.5}
          roughness={0.1}
          metalness={0.5}
        />
      </RoundedBox>
      {/* Light for the pad */}
      <pointLight 
        position={[0, 1, 0]} 
        intensity={active ? 20 : 2} 
        color={color} 
        distance={5}
      />
    </group>
  );
}

// --- Scene Setup ---

function Scene() {
  const [bgColor, setBgColor] = useState('#1e1b4b'); // Warmer, deeper initial blue
  const [lightColor, setLightColor] = useState('#ffffff');
  const [synth, setSynth] = useState(null);
  
  useEffect(() => {
    // Initialize Tone.js Synth
    const duoSynth = new Tone.DuoSynth({
      vibratoAmount: 0.2,
      vibratoRate: 6,
      harmonicity: 1.5,
      voice0: {
        volume: -12,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, release: 0.8 }
      },
      voice1: {
        volume: -12,
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, release: 0.8 }
      }
    }).toDestination();
    
    setSynth(duoSynth);
    
    return () => duoSynth.dispose();
  }, []);

  const handleTrigger = (color) => {
    setBgColor(color);
    setLightColor(color);
    // Longer transition for more impact
    setTimeout(() => {
      setBgColor('#1e1b4b');
      setLightColor('#ffffff');
    }, 500);
  };

  // C Major Pentatonic Scale: C, D, E, G, A
  const pads = [
    { pos: [-2.5, 0, -2.5], color: '#ff4444', note: 'C3' },
    { pos: [0, 0, -2.5],    color: '#ffbb33', note: 'D3' },
    { pos: [2.5, 0, -2.5],  color: '#00C851', note: 'E3' },
    { pos: [-2.5, 0, 0],    color: '#33b5e5', note: 'G3' },
    { pos: [0, 0, 0],       color: '#2BBBAD', note: 'A3' },
    { pos: [2.5, 0, 0],     color: '#4285F4', note: 'C4' },
    { pos: [-2.5, 0, 2.5],  color: '#aa66cc', note: 'D4' },
    { pos: [0, 0, 2.5],     color: '#ffbb33', note: 'E4' },
    { pos: [2.5, 0, 2.5],   color: '#ff4444', note: 'G4' },
  ];

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 5, 25]} />
      
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 10, 5]} intensity={5} color={lightColor} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
      
      <group position={[0, -1.5, 0]}>
        {pads.map((pad, i) => (
          <Pad 
            key={i} 
            position={pad.pos} 
            color={pad.color} 
            note={pad.note} 
            synth={synth}
            onTrigger={handleTrigger}
          />
        ))}
        
        {/* Floor - lighter color and grid helper for depth */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.2} />
        </mesh>
        <gridHelper args={[20, 10, "#ffffff", "#ffffff"]} position={[0, -0.19, 0]} opacity={0.1} transparent />
        
        <ContactShadows 
          position={[0, -0.15, 0]} 
          opacity={0.6} 
          scale={20} 
          blur={2} 
          far={1.5} 
        />
      </group>

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={45} />
      </Float>
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  const [started, setStarted] = useState(false);

  const startAudio = async () => {
    await Tone.start();
    setStarted(true);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden touch-none">
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
      >
        <ArrowLeft size={24} />
      </button>

      {!started && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl">
          <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-4xl font-black text-white mb-4">Musical Color Room</h1>
            <p className="text-slate-400 mb-8 max-w-xs">Tap the glowing pads to create magical music and lights.</p>
            <button
              onClick={startAudio}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-12 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
            >
              Start Playing
            </button>
          </div>
        </div>
      )}

      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="absolute top-6 left-6 z-10">
         <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
            <span className="text-white font-bold tracking-wider uppercase text-sm">Pentatonic Jam</span>
         </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs font-bold tracking-[0.2em] uppercase pointer-events-none">
        Touch or Click to Play
      </div>
    </div>
  );
}
