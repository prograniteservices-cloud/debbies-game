'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows, OrbitControls } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Pad Component ---

function Pad({ position, color, note, synth, onTrigger }) {
  const [active, setActive] = useState(false);
  const meshRef = useRef();

  const handleDown = async (e) => {
    e.stopPropagation();
    console.log(`Pad clicked: ${note}`);
    
    // Resume audio context
    if (Tone.context.state !== 'running') {
      await Tone.start();
      console.log('Tone.js started');
    }
    
    setActive(true);
    if (synth) {
      try {
        synth.triggerAttackRelease(note, '8n');
      } catch (err) {
        console.error('Synth error:', err);
      }
    }
    onTrigger(color);
    setTimeout(() => setActive(false), 200);
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerDown={handleDown}
        scale={active ? [0.95, 0.8, 0.95] : [1, 1, 1]}
      >
        <boxGeometry args={[1.8, 0.4, 1.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 5 : 1}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      <pointLight 
        position={[0, 1, 0]} 
        intensity={active ? 20 : 2} 
        color={color} 
        distance={10}
      />
    </group>
  );
}

// --- Scene Setup ---

function Scene({ onTrigger }) {
  const [bgColor, setBgColor] = useState('#1e1b4b');
  const [synth, setSynth] = useState(null);
  
  useEffect(() => {
    console.log('MusicalRoom Scene Mounting...');
    // Simpler synth for compatibility
    const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    polySynth.set({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, release: 1 }
    });
    
    setSynth(polySynth);
    return () => {
      console.log('MusicalRoom Scene Unmounting...');
      polySynth.dispose();
    };
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
      
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
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
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>
        
        {/* Grid for visual reference */}
        <gridHelper args={[20, 10, "#ffffff", "#ffffff"]} position={[0, -0.2, 0]} opacity={0.2} transparent />
      </group>

      <OrbitControls makeDefault />
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  console.log('MusicalRoom Component Rendering');

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden touch-none">
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="absolute top-6 left-6 z-10">
         <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
            <span className="text-white font-bold tracking-wider uppercase text-sm">Music & Light Jam</span>
         </div>
      </div>

      <Canvas 
        shadows 
        camera={{ position: [0, 10, 12], fov: 50 }}
        onCreated={({ gl }) => {
          console.log('Three.js WebGL Context Created');
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs font-bold tracking-[0.2em] uppercase pointer-events-none text-center">
        Tap the pads to play (Drag to look around)
      </div>
    </div>
  );
}
