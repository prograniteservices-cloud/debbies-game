'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Pad Component ---

function Pad({ position, color, note, synth, onTrigger }) {
  const [active, setActive] = useState(false);
  const meshRef = useRef();

  const handleDown = async () => {
    // Start audio context on first click if not already started
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
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
          emissiveIntensity={active ? 10 : 2}
          roughness={0.1}
          metalness={0.5}
        />
      </RoundedBox>
      <pointLight 
        position={[0, 1, 0]} 
        intensity={active ? 50 : 5} 
        color={color} 
        distance={10}
      />
    </group>
  );
}

// --- Scene Setup ---

function Scene() {
  const [bgColor, setBgColor] = useState('#1e1b4b');
  const [synth, setSynth] = useState(null);
  
  useEffect(() => {
    const duoSynth = new Tone.DuoSynth({
      vibratoAmount: 0.2,
      vibratoRate: 6,
      harmonicity: 1.5,
      voice0: {
        volume: -10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, release: 0.8 }
      },
      voice1: {
        volume: -10,
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, release: 0.8 }
      }
    }).toDestination();
    
    setSynth(duoSynth);
    return () => duoSynth.dispose();
  }, []);

  const handleTrigger = (color) => {
    setBgColor(color);
    setTimeout(() => {
      setBgColor('#1e1b4b');
    }, 500);
  };

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
      <fog attach="fog" args={[bgColor, 10, 30]} />
      
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[0, 5, 0]} intensity={10} color="#ffffff" />
      
      <group position={[0, 0, 0]}>
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
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        <gridHelper args={[20, 10, "#4a5568", "#4a5568"]} position={[0, -0.2, 0]} />
        
        <ContactShadows 
          position={[0, -0.19, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={1} 
        />
      </group>

      <PerspectiveCamera makeDefault position={[0, 10, 12]} fov={50} />
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden touch-none">
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="absolute top-6 left-6 z-10">
         <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
            <span className="text-white font-bold tracking-wider uppercase text-sm">Musical Color Room</span>
         </div>
      </div>

      <Canvas shadows camera={{ position: [0, 10, 12], fov: 50 }}>
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <Scene />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs font-bold tracking-[0.2em] uppercase pointer-events-none text-center">
        Tap the glowing pads to play music
      </div>
    </div>
  );
}
