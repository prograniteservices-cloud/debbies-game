'use client';

import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, Float, ContactShadows } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { ArrowLeft, TreePine, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Improved Water Ripple Component ---

function WaterRipple({ position, color, onFinish }) {
  const meshRef = useRef();
  const [timer, setTimer] = useState(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.x += 0.15;
      meshRef.current.scale.y += 0.15;
      meshRef.current.material.opacity = Math.max(0, 0.6 - meshRef.current.scale.x / 12);
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

// --- Fireflies (Nature Particles) ---

function Fireflies() {
  const count = 40;
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.01 + Math.random() / 100,
        x: Math.random() * 40 - 20,
        y: Math.random() * 15,
        z: Math.random() * 40 - 20,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((p, i) => {
      let { t, speed, x, y, z } = p;
      t = p.t += speed;
      dummy.position.set(
        x + Math.cos(t) * 2,
        y + Math.sin(t * 1.5) * 1,
        z + Math.sin(t) * 2
      );
      const s = 0.2 + Math.sin(t) * 0.1;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={5} transparent opacity={0.6} />
    </instancedMesh>
  );
}

// --- Musical Mushroom Component ---

function Mushroom({ initialPos, color, note, synth, addRipple }) {
  const groupRef = useRef();
  const capRef = useRef();
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t + initialPos[0]) * 0.1;
      if (active) {
        capRef.current.scale.set(
          THREE.MathUtils.lerp(capRef.current.scale.x, 1.4, 0.2),
          THREE.MathUtils.lerp(capRef.current.scale.y, 0.8, 0.2),
          THREE.MathUtils.lerp(capRef.current.scale.z, 1.4, 0.2)
        );
      } else {
        capRef.current.scale.set(
          THREE.MathUtils.lerp(capRef.current.scale.x, 1, 0.1),
          THREE.MathUtils.lerp(capRef.current.scale.y, 1, 0.1),
          THREE.MathUtils.lerp(capRef.current.scale.z, 1, 0.1)
        );
      }
    }
  });

  const trigger = async () => {
    if (Tone.context.state !== 'running') await Tone.start();
    setActive(true);
    if (synth) synth.triggerAttackRelease(note, '8n');
    addRipple(new THREE.Vector3(...initialPos), color);
    setTimeout(() => setActive(false), 200);
  };

  return (
    <group position={initialPos} ref={groupRef} onPointerDown={(e) => { e.stopPropagation(); trigger(); }}>
      {/* Stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1, 8]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      {/* Cap */}
      <mesh ref={capRef} position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 10 : 1} />
        {/* Spots */}
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[Math.cos(i * 1.5) * 0.6, 0.5, Math.sin(i * 1.5) * 0.6]} rotation={[Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.2, 8]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
        ))}
      </mesh>
      <pointLight position={[0, 1, 0]} intensity={active ? 50 : 2} color={color} distance={8} />
    </group>
  );
}

// --- Decorative Forest Elements ---

function ForestDeco() {
  return (
    <group position={[0, -1.2, 0]}>
      {/* Trees in distance */}
      {[...Array(10)].map((_, i) => (
        <group key={i} position={[Math.cos(i) * 25, 0, Math.sin(i) * 25]}>
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[2, 6, 8]} />
            <meshStandardMaterial color="#064e3b" />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// --- Main Scene ---

function Scene({ onTrigger }) {
  const [ripples, setRipples] = useState([]);
  const [synth, setSynth] = useState(null);
  const [bgColor, setBgColor] = useState('#020617');

  const mushrooms = useMemo(() => [
    { pos: [-6, 0, -6], color: '#ef4444', note: 'C3' },
    { pos: [0, 0, -7],  color: '#f59e0b', note: 'D3' },
    { pos: [6, 0, -6],  color: '#10b981', note: 'E3' },
    { pos: [-7, 0, 0],  color: '#3b82f6', note: 'G3' },
    { pos: [0, 0, 0],   color: '#8b5cf6', note: 'A3' },
    { pos: [7, 0, 0],   color: '#ec4899', note: 'C4' },
    { pos: [-6, 0, 6],  color: '#06b6d4', note: 'D4' },
    { pos: [0, 0, 7],   color: '#f97316', note: 'E4' },
    { pos: [6, 0, 6],   color: '#f43f5e', note: 'G4' },
  ], []);

  useEffect(() => {
    // Organic "Woody" Synth
    const reverb = new Tone.Reverb({ decay: 3, wet: 0.5 }).toDestination();
    const delay = new Tone.FeedbackDelay("8n", 0.3).connect(reverb);
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 1 }
    }).connect(delay);
    
    setSynth(polySynth);
    return () => { polySynth.dispose(); reverb.dispose(); delay.dispose(); };
  }, []);

  const addRipple = (pos, color) => {
    const id = Math.random();
    setRipples(prev => [...prev, { id, pos, color }]);
    setBgColor(color);
    setTimeout(() => setBgColor('#020617'), 600);
    onTrigger(color);
  };

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 15, 50]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 20, 10]} intensity={1.5} color="#ffffff" />
      
      <Fireflies />
      <ForestDeco />

      {mushrooms.map((m, i) => (
        <Mushroom 
          key={i} 
          initialPos={m.pos} 
          color={m.color} 
          note={m.note} 
          synth={synth} 
          addRipple={addRipple} 
        />
      ))}

      {ripples.map(r => (
        <WaterRipple 
          key={r.id} 
          position={r.pos} 
          color={r.color} 
          onFinish={() => setRipples(prev => prev.filter(x => x.id !== r.id))} 
        />
      ))}

      {/* Pond Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={bgColor} roughness={0.1} metalness={0.8} />
      </mesh>
      
      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2.2} 
        minDistance={15} 
        maxDistance={35} 
        autoRotate
        autoRotateSpeed={0.3}
        makeDefault 
      />
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  const [lastColor, setLastColor] = useState('#10b981');

  return (
    <div className="relative w-full h-screen bg-emerald-950 overflow-hidden touch-none">
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-xl border border-white/10 transition-all cursor-pointer group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="absolute top-8 left-8 z-10 pointer-events-none">
         <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <TreePine className="w-5 h-5 text-emerald-400 animate-bounce" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-[0.2em] uppercase text-sm">Magic Meadow</h2>
              <p className="text-emerald-400/60 text-[10px] font-bold tracking-widest uppercase">Nature Harmony Engine</p>
            </div>
         </div>
      </div>

      <Canvas shadows camera={{ position: [0, 20, 25], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene onTrigger={setLastColor} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-black tracking-[0.5em] uppercase pointer-events-none text-center">
        Tap the glowing mushrooms to ripple the pond
      </div>
    </div>
  );
}
