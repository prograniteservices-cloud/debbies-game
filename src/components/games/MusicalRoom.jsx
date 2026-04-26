'use client';

import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, Float, ContactShadows } from '@react-three/drei';
import { ArrowLeft, TreePine, Music } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Optimized Water Ripple Component ---

function WaterRipple({ position, color, onFinish }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.x += 0.18;
      meshRef.current.scale.y += 0.18;
      meshRef.current.material.opacity = Math.max(0, 0.6 - meshRef.current.scale.x / 14);
      if (meshRef.current.material.opacity <= 0) onFinish();
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, -1.18, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.8, 1.2, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

// --- Optimized Musical Frog ---

function RhythmFrog({ position, color, isActive, onToggle, beatPulseRef }) {
  const groupRef = useRef();
  const frogRef = useRef();
  const lightRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      const pulse = beatPulseRef.current;
      const targetScale = isActive ? 1 + pulse * 0.4 : 1;
      frogRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);
      
      if (lightRef.current) {
        lightRef.current.intensity = isActive ? 15 + pulse * 30 : 0;
      }
    }
  });

  return (
    <group position={position} ref={groupRef} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#065f46" roughness={1} />
      </mesh>
      <group ref={frogRef}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color={isActive ? color : "#1e293b"} emissive={isActive ? color : "#000"} emissiveIntensity={isActive ? 2 : 0} />
        </mesh>
        <mesh position={[0.3, 0.4, 0.3]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
        <mesh position={[-0.3, 0.4, 0.3]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
      </group>
      <pointLight ref={lightRef} position={[0, 1, 0]} color={color} distance={10} />
    </group>
  );
}

// --- High Performance Mushroom ---

function Mushroom({ initialPos, color, note, synth, addRipple }) {
  const groupRef = useRef();
  const capRef = useRef();
  const lightRef = useRef();
  const activeRef = useRef(0); // Using ref instead of state for 60fps visuals

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t + initialPos[0]) * 0.1;
      
      // Visual pulse decay
      activeRef.current = Math.max(0, activeRef.current - 0.05);
      const s = 1 + activeRef.current * 0.5;
      capRef.current.scale.lerp(new THREE.Vector3(s, 1 - activeRef.current * 0.2, s), 0.2);
      capRef.current.material.emissiveIntensity = 1.5 + activeRef.current * 20;
      lightRef.current.intensity = 3 + activeRef.current * 60;
    }
  });

  const trigger = (e) => {
    if (e) e.stopPropagation();
    if (Tone.context.state !== 'running') Tone.start();
    
    activeRef.current = 1.0; // Trigger visual pulse
    if (synth) synth.triggerAttackRelease(note, '4n', Tone.now());
    addRipple(new THREE.Vector3(...initialPos), color);
  };

  return (
    <group position={initialPos} ref={groupRef}>
      <mesh position={[0, 0.4, 0]} onPointerDown={trigger}>
        <cylinderGeometry args={[0.3, 0.5, 1, 8]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh ref={capRef} position={[0, 1, 0]} castShadow onPointerDown={trigger}>
        <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[Math.cos(i * 1.5) * 0.6, 0.5, Math.sin(i * 1.5) * 0.6]} rotation={[Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.2, 8]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
        ))}
      </mesh>
      <pointLight ref={lightRef} position={[0, 1, 0]} intensity={3} color={color} distance={10} />
    </group>
  );
}

// --- Main Scene ---

function Scene({ onTrigger }) {
  const [ripples, setRipples] = useState([]);
  const [synth, setSynth] = useState(null);
  const [activeBeats, setActiveBeats] = useState({ 0: false, 1: false, 2: false });
  const beatPulseRef = useRef(0);
  const [bgColor, setBgColor] = useState('#020617');

  const mushrooms = useMemo(() => [
    { pos: [-6, 0, -6], color: '#ef4444', note: 'C4' },
    { pos: [0, 0, -7],  color: '#f59e0b', note: 'D4' },
    { pos: [6, 0, -6],  color: '#10b981', note: 'E4' },
    { pos: [-7, 0, 0],  color: '#3b82f6', note: 'G4' },
    { pos: [0, 0, 0],   color: '#8b5cf6', note: 'A4' },
    { pos: [7, 0, 0],   color: '#ec4899', note: 'C5' },
    { pos: [-6, 0, 6],  color: '#06b6d4', note: 'D5' },
    { pos: [0, 0, 7],   color: '#f97316', note: 'E5' },
    { pos: [6, 0, 6],   color: '#f43f5e', note: 'G5' },
  ], []);

  const frogs = useMemo(() => [
    { pos: [-12, 0, -8], color: '#3b82f6' },
    { pos: [12, 0, -8],  color: '#10b981' },
    { pos: [0, 0, 12],   color: '#fbbf24' },
  ], []);

  useEffect(() => {
    const reverb = new Tone.Reverb({ decay: 4, wet: 0.4 }).toDestination();
    const delay = new Tone.FeedbackDelay("4n", 0.3).connect(reverb);
    const poly = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'triangle' }, // High efficiency
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 1.5 }
    }).connect(delay);
    poly.volume.value = -2;
    setSynth(poly);

    const kick = new Tone.MembraneSynth({ volume: -4 }).toDestination();
    const plink = new Tone.MetalSynth({ volume: -20, envelope: { release: 0.1 } }).toDestination();
    const shaker = new Tone.NoiseSynth({ volume: -15, envelope: { release: 0.05 } }).toDestination();

    Tone.Transport.bpm.value = 85;
    const loop = new Tone.Sequence((time, index) => {
      beatPulseRef.current = 1;
      setTimeout(() => beatPulseRef.current = 0, 120);
      if (activeBeats[0] && (index === 0 || index === 8)) kick.triggerAttackRelease("C1", "8n", time);
      if (activeBeats[1] && (index % 4 === 2)) plink.triggerAttackRelease("16n", time);
      if (activeBeats[2]) shaker.triggerAttackRelease("16n", time);
    }, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "16n").start(0);

    return () => {
      poly.dispose(); kick.dispose(); plink.dispose(); shaker.dispose(); reverb.dispose(); delay.dispose(); loop.dispose();
    };
  }, [activeBeats]);

  const toggleBeat = (idx) => {
    if (Tone.context.state !== 'running') Tone.start();
    Tone.Transport.start();
    setActiveBeats(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addRipple = (pos, color) => {
    const id = Date.now(); // More stable ID
    setRipples(prev => [...prev.slice(-10), { id, pos, color }]); // Cap at 10 ripples
    setBgColor(color);
    setTimeout(() => setBgColor('#020617'), 400);
    onTrigger(color);
  };

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 15, 50]} />
      <ambientLight intensity={0.5} />
      
      {mushrooms.map((m, i) => (
        <Mushroom key={i} initialPos={m.pos} color={m.color} note={m.note} synth={synth} addRipple={addRipple} />
      ))}

      {frogs.map((f, i) => (
        <RhythmFrog key={i} position={f.pos} color={f.color} isActive={activeBeats[i]} onToggle={() => toggleBeat(i)} beatPulseRef={beatPulseRef} />
      ))}

      {ripples.map(r => (
        <WaterRipple key={r.id} position={r.pos} color={r.color} onFinish={() => setRipples(prev => prev.filter(x => x.id !== r.id))} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={bgColor} roughness={0.1} metalness={0.8} />
      </mesh>
      
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={15} maxDistance={35} makeDefault />
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  const [lastColor, setLastColor] = useState('#10b981');

  return (
    <div className="relative w-full h-screen bg-emerald-950 overflow-hidden touch-none">
      <button onClick={onBack} className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-xl border border-white/10 transition-all cursor-pointer group">
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="absolute top-8 left-8 z-10 pointer-events-none">
         <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <Music className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-[0.2em] uppercase text-sm">Magic Meadow</h2>
              <p className="text-emerald-400/60 text-[10px] font-bold tracking-widest uppercase">High Performance Music Engine</p>
            </div>
         </div>
      </div>

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 20, 25], fov: 45 }}>
        <Suspense fallback={null}><Scene onTrigger={setLastColor} /></Suspense>
      </Canvas>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-black tracking-[0.5em] uppercase pointer-events-none text-center">
        Mushrooms & Frogs Symphony
      </div>
    </div>
  );
}
