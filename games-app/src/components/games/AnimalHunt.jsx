'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, RoundedBox, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- Environment Components ---

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
}

function BlockyTree({ position }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}

function BlockyRock({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#64748b" />
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
          >
            Click me!
          </Text>
        )}
      </group>
    </Float>
  );
}

// --- Camera Controller ---

function Rig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Pivot 360 degrees from fixed center
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -mouse.x * Math.PI, 0.1);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, mouse.y * Math.PI * 0.2, 0.1);
  });
  return null;
}

export default function AnimalHunt() {
  const [foundAnimals, setFoundAnimals] = useState([]);
  const animals = [
    { name: 'Cow', position: [5, 0, -5], color: '#fca5a1' },
    { name: 'Pig', position: [-8, 0, -10], color: '#f9a8d4' },
    { name: 'Sheep', position: [10, 0, 5], color: '#f1f5f9' },
    { name: 'Chicken', position: [-5, 0, 8], color: '#fef08a' },
    { name: 'Cat', position: [0, 0, -15], color: '#fdba74' },
  ];

  const handleFind = (name) => {
    if (!foundAnimals.includes(name)) {
      setFoundAnimals([...foundAnimals, name]);
      // Play a sound if we had one
    }
  };

  const totalAnimals = animals.length;
  const animalsLeft = totalAnimals - foundAnimals.length;

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Animal Hunt</h1>
          <p className="text-amber-200 font-medium">
            {animalsLeft === 0 ? "You found them all! 🎉" : `Find the animals: ${foundAnimals.length} / ${totalAnimals}`}
          </p>
        </div>
        {animalsLeft === 0 && (
          <button 
            onClick={() => setFoundAnimals([])}
            className="pointer-events-auto bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Play Again
          </button>
        )}
      </div>

      <Canvas shadows camera={{ position: [0, 2, 0], fov: 75 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <Ground />
          
          {/* Decorative Environment */}
          <BlockyTree position={[3, 0, -7]} />
          <BlockyTree position={[-10, 0, -5]} />
          <BlockyTree position={[8, 0, 10]} />
          <BlockyRock position={[5, -0.2, -4]} scale={0.8} />
          <BlockyRock position={[-6, -0.1, 5]} scale={1.2} />
          <BlockyGrass position={[2, 0, 2]} />
          <BlockyGrass position={[-3, 0, -4]} />
          <BlockyGrass position={[7, 0, -8]} />

          {/* Animals */}
          {animals.map((animal) => (
            <BlockyAnimal 
              key={animal.name}
              {...animal} 
              onFind={handleFind}
              found={foundAnimals.includes(animal.name)}
            />
          ))}

          <Rig />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium animate-pulse pointer-events-none">
        Move mouse to look around • Click animals to find them
      </div>
    </div>
  );
}
