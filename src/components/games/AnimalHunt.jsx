'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, RoundedBox, Float, Text } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

const LEVELS = [
  {
    name: 'Forest',
    groundColor: '#4ade80',
    skyColor: '#87ceeb',
    fogColor: '#4ade80',
    animals: [
      { name: 'Cow', position: [5, 0, -5], color: '#fca5a1' },
      { name: 'Pig', position: [-8, 0, -10], color: '#f9a8d4' },
      { name: 'Sheep', position: [10, 0, 5], color: '#f1f5f9' },
      { name: 'Chicken', position: [-5, 0, 8], color: '#fef08a' },
      { name: 'Cat', position: [0, 0, -15], color: '#fdba74' },
    ],
    decorations: 'forest'
  },
  {
    name: 'Underwater',
    groundColor: '#fde047', // sand
    skyColor: '#0ea5e9',
    fogColor: '#0ea5e9',
    animals: [
      { name: 'Fish', position: [5, 2, -5], color: '#f87171' },
      { name: 'Shark', position: [-10, 3, -12], color: '#94a3b8' },
      { name: 'Crab', position: [8, 0, 6], color: '#ef4444' },
      { name: 'Whale', position: [0, 5, -20], color: '#334155' },
      { name: 'Octopus', position: [-6, 1, 8], color: '#c084fc' },
    ],
    decorations: 'underwater'
  },
  {
    name: 'Desert',
    groundColor: '#f59e0b',
    skyColor: '#fbbf24',
    fogColor: '#f59e0b',
    animals: [
      { name: 'Camel', position: [8, 0, -8], color: '#d97706' },
      { name: 'Scorpion', position: [-5, 0, -5], color: '#451a03' },
      { name: 'Snake', position: [10, 0, 10], color: '#166534' },
      { name: 'Lizard', position: [-8, 0, 5], color: '#84cc16' },
      { name: 'Fox', position: [0, 0, -12], color: '#ea580c' },
    ],
    decorations: 'desert'
  },
  {
    name: 'Swamp',
    groundColor: '#14532d',
    skyColor: '#3f6212',
    fogColor: '#14532d',
    animals: [
      { name: 'Alligator', position: [12, 0, -10], color: '#064e3b' },
      { name: 'Frog', position: [-4, 0.2, -4], color: '#22c55e' },
      { name: 'Turtle', position: [7, 0, 7], color: '#15803d' },
      { name: 'Heron', position: [-8, 1, 10], color: '#e2e8f0' },
      { name: 'Dragonfly', position: [0, 3, -8], color: '#38bdf8' },
    ],
    decorations: 'swamp'
  },
  {
    name: 'Pond',
    groundColor: '#38bdf8', // water
    skyColor: '#bae6fd',
    fogColor: '#38bdf8',
    animals: [
      { name: 'Duck', position: [6, 0, -6], color: '#facc15' },
      { name: 'Swan', position: [-9, 0, -9], color: '#ffffff' },
      { name: 'Beaver', position: [11, 0, 6], color: '#78350f' },
      { name: 'Frog', position: [-5, 0, 5], color: '#4ade80' },
      { name: 'Fish', position: [0, -1, -10], color: '#fb923c' },
    ],
    decorations: 'pond'
  }
];

// --- Environment Components ---

function Environment({ type, groundColor }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {type === 'forest' && (
        <>
          <BlockyTree position={[3, 0, -7]} />
          <BlockyTree position={[-10, 0, -5]} />
          <BlockyTree position={[8, 0, 10]} />
          <BlockyRock position={[5, -0.2, -4]} scale={0.8} />
          <BlockyRock position={[-6, -0.1, 5]} scale={1.2} />
          <BlockyGrass position={[2, 0, 2]} />
          <BlockyGrass position={[-3, 0, -4]} />
          <BlockyGrass position={[7, 0, -8]} />
        </>
      )}

      {type === 'underwater' && (
        <>
          <BlockySeaweed position={[4, 0, -8]} color="#059669" />
          <BlockySeaweed position={[-8, 0, -6]} color="#10b981" />
          <BlockySeaweed position={[10, 0, 5]} color="#047857" />
          <BlockyRock position={[6, -0.2, -2]} scale={0.5} color="#94a3b8" />
          <BlockyRock position={[-12, -0.1, 10]} scale={2} color="#64748b" />
          <Bubble position={[2, 2, 2]} />
          <Bubble position={[-5, 4, -10]} />
          <Bubble position={[8, 1, -5]} />
        </>
      )}

      {type === 'desert' && (
        <>
          <BlockyCactus position={[6, 0, -10]} />
          <BlockyCactus position={[-12, 0, -4]} />
          <BlockyCactus position={[10, 0, 8]} />
          <BlockyRock position={[4, -0.2, -2]} scale={1.5} color="#d97706" />
          <BlockyRock position={[-15, -0.1, 12]} scale={2.5} color="#b45309" />
        </>
      )}

      {type === 'swamp' && (
        <>
          <BlockyTree position={[5, 0, -12]} color="#064e3b" />
          <BlockyTree position={[-15, 0, -8]} color="#064e3b" />
          <BlockyVine position={[2, 0, 2]} />
          <BlockyVine position={[-8, 0, 6]} />
          <BlockyRock position={[10, -0.2, 15]} scale={3} color="#1e293b" />
        </>
      )}

      {type === 'pond' && (
        <>
          <LilyPad position={[4, -0.45, -6]} />
          <LilyPad position={[-8, -0.45, -4]} />
          <LilyPad position={[10, -0.45, 10]} />
          <BlockyReed position={[15, 0, 0]} />
          <BlockyReed position={[-15, 0, 5]} />
        </>
      )}
    </>
  );
}

function BlockyTree({ position, color = "#78350f", leafColor = "#166534" }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={leafColor} />
      </mesh>
    </group>
  );
}

function BlockySeaweed({ position, color }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.2, 2.5, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.3, 0.5, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.15, 1.5, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function BlockyCactus({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.6, 3, 0.6]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      <mesh position={[0.8, 2, 0]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      <mesh position={[-0.8, 1.5, 0]}>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}

function LilyPad({ position }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}

function BlockyReed({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}

function BlockyVine({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.1, 5, 0.1]} />
      <meshStandardMaterial color="#064e3b" />
    </mesh>
  );
}

function Bubble({ position }) {
  return (
    <Float speed={4} floatIntensity={1}>
      <mesh position={position}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

function BlockyRock({ position, scale = 1, color = "#64748b" }) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function BlockyGrass({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.2, 0.4, 0.2]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}

// --- Animal Component ---

function BlockyAnimal({ position, color, name, onFind, found }) {
  const [hovered, setHover] = useState(false);
  
  if (found) return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        position={position} 
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onClick={() => onFind(name)}
      >
        {/* Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 0.6, 1.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1, 0.5]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.15, 1.1, 0.75]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.15, 1.1, 0.75]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {hovered && (
          <Text
            position={[0, 2, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {name}!
          </Text>
        )}
      </group>
    </Float>
  );
}

// --- Camera Controller ---

function Rig() {
  const { camera, mouse } = useThree();
  const pitchRef = useRef(0);
  const yawRef = useRef(0);

  useFrame(() => {
    const targetYaw = -mouse.x * Math.PI;
    const targetPitch = mouse.y * Math.PI * 0.15;

    yawRef.current = THREE.MathUtils.lerp(yawRef.current, targetYaw, 0.05);
    pitchRef.current = THREE.MathUtils.lerp(pitchRef.current, targetPitch, 0.05);

    camera.rotation.set(0, 0, 0);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yawRef.current;
    camera.rotation.x = pitchRef.current;
  });
  return null;
}

export default function AnimalHunt({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [foundAnimals, setFoundAnimals] = useState([]);
  
  const level = LEVELS[currentLevel];
  const animals = level.animals;

  const handleFind = (name) => {
    if (!foundAnimals.includes(name)) {
      setFoundAnimals([...foundAnimals, name]);
    }
  };

  const nextLevel = () => {
    setFoundAnimals([]);
    setCurrentLevel((currentLevel + 1) % LEVELS.length);
  };

  const totalAnimals = animals.length;
  const animalsLeft = totalAnimals - foundAnimals.length;

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-4 pointer-events-none">
          <button 
            onClick={onBack}
            className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 shadow-2xl">
            <h1 className="text-2xl font-bold text-white mb-1">{level.name} Hunt</h1>
            <p className="text-amber-200 font-medium">
              {animalsLeft === 0 ? "Level Complete! 🎉" : `Find the animals: ${foundAnimals.length} / ${totalAnimals}`}
            </p>
          </div>
        </div>
        {animalsLeft === 0 && (
          <button 
            onClick={nextLevel}
            className="pointer-events-auto bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Next Level
          </button>
        )}
      </div>

      <Canvas shadows camera={{ position: [0, 2, 0], fov: 75 }}>
        <Suspense fallback={null}>
          <color attach="background" args={[level.skyColor]} />
          <fog attach="fog" args={[level.fogColor, 1, 30]} />
          
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          
          <Environment type={level.decorations} groundColor={level.groundColor} />

          {/* Animals */}
          {animals.map((animal) => (
            <BlockyAnimal 
              key={`${level.name}-${animal.name}`}
              {...animal} 
              onFind={handleFind}
              found={foundAnimals.includes(animal.name)}
            />
          ))}

          <Rig />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium animate-pulse pointer-events-none text-center">
        {level.decorations === 'underwater' ? 'Float through the ocean' : 'Look around the ' + level.name} • Click animals to find them
      </div>
    </div>
  );
}
