'use client';

import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows, OrbitControls, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import { ArrowLeft, Music, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Particle System for "Stardust" ---

function Stardust() {
  const count = 100;
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = Math.random() * 20 - 10;
      const y = Math.random() * 20 - 10;
      const z = Math.random() * 20 - 10;
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle;
      time = particle.time += speed / 2;
      const s = Math.cos(time);
      dummy.position.set(
        x + Math.cos(time) * 1,
        y + Math.sin(time) * 1,
        z + Math.sin(time) * 1
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.3} />
    </instancedMesh>
  );
}

// --- Glowing Crystal Pad Component ---

function Pad({ position, color, note, synth, onTrigger }) {
  const [active, setActive] = useState(false);
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1;
    }
  });

  const handleDown = async (e) => {
    e.stopPropagation();
    if (Tone.context.state !== 'running') await Tone.start();
    
    setActive(true);
    if (synth) synth.triggerAttackRelease(note, '4n');
    onTrigger(color);
    setTimeout(() => setActive(false), 300);
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerDown={handleDown}
        scale={active ? [1.4, 1.4, 1.4] : [1, 1, 1]}
      >
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 15 : 2}
          transparent
          opacity={0.8}
          roughness={0}
          metalness={1}
        />
      </mesh>
      <pointLight 
        position={[0, 0, 0]} 
        intensity={active ? 100 : 5} 
        color={color} 
        distance={15}
      />
    </group>
  );
}

// --- Scene Setup ---

function Scene({ onTrigger }) {
  const [bgColor, setBgColor] = useState('#0a0a1a');
  const [synth, setSynth] = useState(null);
  
  const pads = useMemo(() => [
    { pos: [-4, 0, -4], color: '#f43f5e', note: 'C3' },
    { pos: [0, 0, -4],  color: '#fbbf24', note: 'D3' },
    { pos: [4, 0, -4],  color: '#10b981', note: 'E3' },
    { pos: [-4, 0, 0],  color: '#3b82f6', note: 'G3' },
    { pos: [0, 0, 0],   color: '#8b5cf6', note: 'A3' },
    { pos: [4, 0, 0],   color: '#ec4899', note: 'C4' },
    { pos: [-4, 0, 4],  color: '#06b6d4', note: 'D4' },
    { pos: [0, 0, 4],   color: '#f97316', note: 'E4' },
    { pos: [4, 0, 4],   color: '#f43f5e', note: 'G4' },
  ], []);

  useEffect(() => {
    // Ethereal Synth Setup
    const reverb = new Tone.Reverb({ decay: 4, wet: 0.6 }).toDestination();
    const delay = new Tone.FeedbackDelay("8n", 0.5).connect(reverb);
    
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.2, decay: 0.1, sustain: 0.5, release: 2 }
    }).connect(delay);
    
    setSynth(polySynth);
    return () => {
      polySynth.dispose();
      reverb.dispose();
      delay.dispose();
    };
  }, []);

  const handleTrigger = (color) => {
    onTrigger(color);
    setBgColor(color);
    setTimeout(() => setBgColor('#0a0a1a'), 600);
  };

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 5, 35]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 20, 10]} intensity={1} color="#ffffff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Stardust />

      <group position={[0, -2, 0]}>
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
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color={bgColor} roughness={1} metalness={0} />
        </mesh>
        
        <gridHelper args={[60, 30, "#ffffff", "#ffffff"]} position={[0, -0.99, 0]} opacity={0.05} transparent />
      </group>

      <OrbitControls 
        makeDefault 
        autoRotate 
        autoRotateSpeed={0.5}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={10}
        maxDistance={25}
      />
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  const [lastColor, setLastColor] = useState('#3b82f6');

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden touch-none">
      {/* Abstract UI Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 transition-colors duration-1000 opacity-20"
          style={{ 
            background: `radial-gradient(circle at center, ${lastColor} 0%, transparent 70%)` 
          }} 
        />
      </div>

      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-xl border border-white/10 transition-all cursor-pointer group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="absolute top-8 left-8 z-10 pointer-events-none">
         <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10">
            <div className="p-2 bg-white/10 rounded-full">
              <Music className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-[0.2em] uppercase text-sm">Celestial Jam</h2>
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Abstract Harmony Engine</p>
            </div>
         </div>
      </div>

      <Canvas 
        shadows 
        camera={{ position: [0, 15, 20], fov: 45 }}
        gl={{ antialias: true, stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <Scene onTrigger={(c) => setLastColor(c)} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-black tracking-[0.4em] uppercase pointer-events-none text-center flex items-center gap-4">
        <div className="w-8 h-[1px] bg-white/20" />
        Tap the floating crystals
        <div className="w-8 h-[1px] bg-white/20" />
      </div>

      {/* Side Decorative Sparkle icons */}
      <div className="absolute right-8 bottom-8 z-10 opacity-20 hover:opacity-100 transition-opacity">
        <Sparkles className="w-12 h-12 text-white blur-[2px]" />
      </div>
    </div>
  );
}
