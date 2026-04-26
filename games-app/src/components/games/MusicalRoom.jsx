'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
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
  const [bgColor, setBgColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [synth, setSynth] = useState(null);
  
  useEffect(() => {
    // Initialize Tone.js Synth
    const duoSynth = new Tone.DuoSynth({
      vibratoAmount: 0.1,
      vibratoRate: 5,
      harmonicity: 1.5,
      voice0: {
        volume: -10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, release: 0.5 }
      },
      voice1: {
        volume: -10,
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, release: 0.5 }
      }
    }).toDestination();
    
    setSynth(duoSynth);
    
    return () => duoSynth.dispose();
  }, []);

  const handleTrigger = (color) => {
    setBgColor(color);
    setLightColor(color);
    setTimeout(() => {
      setBgColor('#0f172a');
      setLightColor('#ffffff');
    }, 300);
  };

  // C Major Pentatonic Scale: C, D, E, G, A
  const pads = [
    { pos: [-2.5, 0, -2.5], color: '#f87171', note: 'C3' },
    { pos: [0, 0, -2.5],    color: '#fbbf24', note: 'D3' },
    { pos: [2.5, 0, -2.5],  color: '#4ade80', note: 'E3' },
    { pos: [-2.5, 0, 0],    color: '#2dd4bf', note: 'G3' },
    { pos: [0, 0, 0],       color: '#3b82f6', note: 'A3' },
    { pos: [2.5, 0, 0],     color: '#818cf8', note: 'C4' },
    { pos: [-2.5, 0, 2.5],  color: '#c084fc', note: 'D4' },
    { pos: [0, 0, 2.5],     color: '#f472b6', note: 'E4' },
    { pos: [2.5, 0, 2.5],   color: '#fb7185', note: 'G4' },
  ];

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 5, 20]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={2} color={lightColor} />
      
      <group position={[0, -1, 0]}>
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
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.8} />
        </mesh>
        
        <ContactShadows 
          position={[0, -0.25, 0]} 
          opacity={0.5} 
          scale={15} 
          blur={2.5} 
          far={1} 
        />
      </group>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <PerspectiveCamera makeDefault position={[0, 6, 8]} fov={50} />
      </Float>
    </>
  );
}

export default function MusicalRoom() {
  const [started, setStarted] = useState(false);

  const startAudio = async () => {
    await Tone.start();
    setStarted(true);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden touch-none">
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
