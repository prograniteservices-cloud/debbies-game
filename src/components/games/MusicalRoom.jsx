'use client';

import React, { useState, Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, Float, ContactShadows, MeshTransmissionMaterial } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { ArrowLeft, Music, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import * as Tone from 'tone';

// --- Ripple Component ---

function Ripple({ position, color, onFinish }) {
  const meshRef = useRef();
  const [scale, setScale] = useState(0.1);
  const [opacity, setOpacity] = useState(0.5);

  useFrame(() => {
    if (meshRef.current) {
      const nextScale = meshRef.current.scale.x + 0.1;
      const nextOpacity = Math.max(0, 0.5 - nextScale / 15);
      meshRef.current.scale.set(nextScale, nextScale, 1);
      meshRef.current.material.opacity = nextOpacity;
      if (nextOpacity <= 0) onFinish();
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, -1.19, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

// --- Stardust Particle System ---

function Stardust() {
  const count = 120;
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        factor: 10 + Math.random() * 50,
        speed: 0.005 + Math.random() / 500,
        x: Math.random() * 30 - 15,
        y: Math.random() * 20 - 5,
        z: Math.random() * 30 - 15,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((p, i) => {
      let { t, factor, speed, x, y, z } = p;
      t = p.t += speed / 1.5;
      const s = Math.cos(t);
      dummy.position.set(x + Math.cos(t) * 2, y + Math.sin(t) * 2, z + Math.sin(t) * 2);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <octahedronGeometry args={[0.06, 0]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} transparent opacity={0.2} />
    </instancedMesh>
  );
}

// --- Interactive Sunstone (Draggable Crystal) ---

function Sunstone({ initialPos, color, note, synth, addRipple }) {
  const meshRef = useRef();
  const [active, setActive] = useState(false);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Physics State
  const velocity = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));
  const pos = useRef(new THREE.Vector3(...initialPos));

  const bind = useDrag(({ active, movement: [mx, my], event }) => {
    event.stopPropagation();
    setActive(active);
    
    if (active) {
      // Dragging
      pos.current.x = initialPos[0] + mx / aspect;
      pos.current.z = initialPos[2] + my / aspect;
      velocity.current.set(mx / aspect / 50, 0, my / aspect / 50); // Give it some "fling"
    } else {
      // Fling trigger
      triggerSound();
    }
  });

  const triggerSound = async () => {
    if (Tone.context.state !== 'running') await Tone.start();
    if (synth) {
      // Shift pitch based on height (pos.y)
      const pitchShift = pos.current.y * 2;
      synth.triggerAttackRelease(note, '4n');
    }
    addRipple(pos.current, color);
  };

  useFrame((state) => {
    if (!active && meshRef.current) {
      // Drift & Bounce
      pos.current.add(velocity.current);
      
      // Boundaries
      if (Math.abs(pos.current.x) > 10) velocity.current.x *= -1;
      if (Math.abs(pos.current.y - 2) > 4) velocity.current.y *= -1;
      if (Math.abs(pos.current.z) > 10) velocity.current.z *= -1;
      
      // Slow rotation
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      
      // Gentle Bobbing
      pos.current.y += Math.sin(state.clock.elapsedTime + initialPos[0]) * 0.005;
    }
    meshRef.current.position.copy(pos.current);
  });

  return (
    <mesh ref={meshRef} {...bind()} castShadow>
      <octahedronGeometry args={[1.5, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={1}
        chromaticAberration={0.05}
        anisotropy={0.1}
        distortion={0.1}
        distortionScale={0.1}
        temporalDistortion={0.1}
        color={color}
        emissive={color}
        emissiveIntensity={active ? 10 : 1}
      />
      <pointLight intensity={active ? 50 : 2} color={color} distance={10} />
    </mesh>
  );
}

// --- Main Scene ---

function Scene({ onTrigger }) {
  const [ripples, setRipples] = useState([]);
  const [synth, setSynth] = useState(null);
  const [bgColor, setBgColor] = useState('#05050f');

  const stones = useMemo(() => [
    { pos: [-6, 2, -6], color: '#f43f5e', note: 'C3' },
    { pos: [0, 3, -7],  color: '#fbbf24', note: 'D3' },
    { pos: [6, 1, -6],  color: '#10b981', note: 'E3' },
    { pos: [-7, 4, 0],  color: '#3b82f6', note: 'G3' },
    { pos: [0, 2, 0],   color: '#8b5cf6', note: 'A3' },
    { pos: [7, 3, 0],   color: '#ec4899', note: 'C4' },
    { pos: [-6, 1, 6],  color: '#06b6d4', note: 'D4' },
    { pos: [0, 4, 7],   color: '#f97316', note: 'E4' },
    { pos: [6, 2, 6],   color: '#f43f5e', note: 'G4' },
  ], []);

  useEffect(() => {
    const reverb = new Tone.Reverb({ decay: 5, wet: 0.7 }).toDestination();
    const delay = new Tone.FeedbackDelay("4n", 0.4).connect(reverb);
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.3, decay: 0.2, sustain: 0.6, release: 3 }
    }).connect(delay);
    
    setSynth(polySynth);
    return () => { polySynth.dispose(); reverb.dispose(); delay.dispose(); };
  }, []);

  const addRipple = (pos, color) => {
    const id = Math.random();
    setRipples(prev => [...prev, { id, pos: { ...pos }, color }]);
    setBgColor(color);
    setTimeout(() => setBgColor('#05050f'), 800);
    onTrigger(color);
  };

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, 10, 40]} />
      <ambientLight intensity={0.4} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Stardust />

      {stones.map((s, i) => (
        <Sunstone 
          key={i} 
          initialPos={s.pos} 
          color={s.color} 
          note={s.note} 
          synth={synth} 
          addRipple={addRipple} 
        />
      ))}

      {ripples.map(r => (
        <Ripple 
          key={r.id} 
          position={r.pos} 
          color={r.color} 
          onFinish={() => setRipples(prev => prev.filter(x => x.id !== r.id))} 
        />
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={bgColor} roughness={1} transparent opacity={0.8} />
      </mesh>
      <gridHelper args={[80, 40, "#ffffff", "#ffffff"]} position={[0, -1.19, 0]} opacity={0.03} transparent />
      
      <OrbitControls 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={15} 
        maxDistance={35} 
        makeDefault 
      />
    </>
  );
}

export default function MusicalRoom({ onBack }) {
  const [lastColor, setLastColor] = useState('#3b82f6');

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden touch-none">
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-xl border border-white/10 transition-all cursor-pointer group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="absolute top-8 left-8 z-10 pointer-events-none">
         <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10">
            <div className="p-2 bg-white/10 rounded-full">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-[0.2em] uppercase text-sm">Nebula Playground</h2>
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Grab, Throw, and Listen</p>
            </div>
         </div>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 20, 25], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene onTrigger={setLastColor} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-black tracking-[0.5em] uppercase pointer-events-none text-center">
        Fling the sunstones to ripple the universe
      </div>
    </div>
  );
}
