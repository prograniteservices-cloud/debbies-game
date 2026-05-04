'use client';

import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars, Float, Text } from '@react-three/drei';
import { ArrowLeft, Heart, RotateCcw, Utensils } from 'lucide-react';
import * as THREE from 'three';
import { playSound } from '../../audio/soundEngine';

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

const WORLD_LIMIT = 34;
const BIOME_SIZE = 30;
const BIOMES = [
  { ...LEVELS[0], center: [-18, 0, -18] },
  { ...LEVELS[1], center: [18, 0, -18] },
  { ...LEVELS[2], center: [-18, 0, 18] },
  { ...LEVELS[3], center: [18, 0, 18] },
  { ...LEVELS[4], center: [0, 0, 0] },
];

const WORLD_ANIMALS = BIOMES.flatMap((biome) =>
  biome.animals.map((animal) => ({
    ...animal,
    id: `${biome.name}-${animal.name}`,
    biome: biome.name,
    position: [
      animal.position[0] + biome.center[0],
      animal.position[1],
      animal.position[2] + biome.center[2],
    ],
  }))
);

const CARE_ACTIONS = {
  feed: {
    label: 'Feed',
    completeLabel: 'Fed',
    Icon: Utensils,
    sound: 'ding',
  },
  pet: {
    label: 'Pet',
    completeLabel: 'Petted',
    Icon: Heart,
    sound: 'sparkle',
  },
};

function isBefriended(care) {
  return Boolean(care?.feed && care?.pet);
}

// --- Environment Components ---

function Environment({ type, groundColor, position = [0, 0, 0], size = 100 }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.5, 0]}>
        <planeGeometry args={[size, size]} />
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
    </group>
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

// --- Animal Shapes ---

function AnimalShape({ name, color }) {
  const meshRef = useRef();
  const wingRef1 = useRef();
  const wingRef2 = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Unique animations based on animal type
    switch (name) {
      case 'Fish':
      case 'Shark':
      case 'Whale':
        meshRef.current.rotation.y = Math.sin(t * 2) * 0.2;
        meshRef.current.position.x = Math.sin(t * 0.5) * 0.5;
        break;
      case 'Frog':
      case 'Chicken':
      case 'Duck':
      case 'Swan':
        meshRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.3;
        break;
      case 'Snake':
      case 'Alligator':
      case 'Lizard':
        meshRef.current.rotation.y = Math.sin(t * 2) * 0.15;
        break;
      case 'Dragonfly':
        if (wingRef1.current) wingRef1.current.rotation.z = Math.sin(t * 20) * 0.5;
        if (wingRef2.current) wingRef2.current.rotation.z = -Math.sin(t * 20) * 0.5;
        meshRef.current.position.y = Math.sin(t * 5) * 0.2;
        break;
      default:
        meshRef.current.position.y = Math.sin(t * 2) * 0.1;
    }
  });

  const Eye = ({ pos }) => (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );

  return (
    <group ref={meshRef}>
      {name === 'Cow' && (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1, 0.8, 1.6]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1.1, 0.8]} castShadow><boxGeometry args={[0.6, 0.6, 0.6]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1.0, 1.1]} castShadow><boxGeometry args={[0.4, 0.3, 0.2]} /><meshStandardMaterial color="#fbcfe8" /></mesh>
          <mesh position={[0.4, 1.4, 0.8]} castShadow><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#475569" /></mesh>
          <mesh position={[-0.4, 1.4, 0.8]} castShadow><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#475569" /></mesh>
          <Eye pos={[0.2, 1.2, 1.1]} />
          <Eye pos={[-0.2, 1.2, 1.1]} />
        </group>
      )}

      {name === 'Pig' && (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.8, 0.7, 1.2]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.8, 0.6]} castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.75, 0.85]} castShadow><boxGeometry args={[0.25, 0.2, 0.1]} /><meshStandardMaterial color="#f472b6" /></mesh>
          <Eye pos={[0.15, 0.9, 0.85]} />
          <Eye pos={[-0.15, 0.9, 0.85]} />
        </group>
      )}

      {name === 'Sheep' && (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1.1, 1.1, 1.4]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.9, 0.8]} castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="#d1d5db" /></mesh>
          <Eye pos={[0.15, 1.0, 1.05]} />
          <Eye pos={[-0.15, 1.0, 1.05]} />
        </group>
      )}

      {name === 'Shark' && (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.8, 0.8, 2.8]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1.2, -0.2]} castShadow rotation={[0.5, 0, 0]}><boxGeometry args={[0.1, 0.8, 0.6]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0.6, 0.4, 0.2]} castShadow rotation={[0, 0, -0.5]}><boxGeometry args={[0.6, 0.1, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[-0.6, 0.4, 0.2]} castShadow rotation={[0, 0, 0.5]}><boxGeometry args={[0.6, 0.1, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.3, 0.6, 1.2]} />
          <Eye pos={[-0.3, 0.6, 1.2]} />
        </group>
      )}

      {name === 'Fish' && (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.3, 0.8, 1.2]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.5, -0.8]} castShadow><boxGeometry args={[0.1, 0.6, 0.6]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.15, 0.6, 0.4]} />
          <Eye pos={[-0.15, 0.6, 0.4]} />
        </group>
      )}

      {name === 'Whale' && (
        <group>
          <mesh position={[0, 1, 0]} castShadow><boxGeometry args={[2.5, 2, 4]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1, -2.5]} castShadow><boxGeometry args={[3, 0.2, 1.5]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[1.3, 1.2, 1.5]} />
          <Eye pos={[-1.3, 1.2, 1.5]} />
        </group>
      )}

      {(name === 'Chicken' || name === 'Duck') && (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.5, 0.6, 0.7]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.8, 0.3]} castShadow><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.8, 0.5]} castShadow><boxGeometry args={[0.2, 0.1, 0.2]} /><meshStandardMaterial color="#f97316" /></mesh>
          <Eye pos={[0.15, 0.9, 0.45]} />
          <Eye pos={[-0.15, 0.9, 0.45]} />
        </group>
      )}

      {name === 'Frog' && (
        <group scale={0.8}>
          <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1, 0.6, 1]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.3, 0.7, 0.3]} />
          <Eye pos={[-0.3, 0.7, 0.3]} />
        </group>
      )}

      {name === 'Snake' && (
        <group>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[Math.sin(i * 1.5) * 0.4, 0.2, -i * 0.6]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.5]} />
              <meshStandardMaterial color={color} />
              {i === 0 && (
                <>
                  <Eye pos={[0.15, 0.2, 0.2]} />
                  <Eye pos={[-0.15, 0.2, 0.2]} />
                  <mesh position={[0, 0, 0.3]}><boxGeometry args={[0.1, 0.05, 0.4]} /><meshStandardMaterial color="red" /></mesh>
                </>
              )}
            </mesh>
          ))}
        </group>
      )}

      {name === 'Scorpion' && (
        <group>
          <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.8, 0.4, 1.2]} /><meshStandardMaterial color={color} /></mesh>
          <group position={[0, 0.4, -0.4]}>
            {[0, 1, 2, 3].map(i => (
              <mesh key={i} position={[0, i * 0.4, -i * 0.2]} rotation={[i * 0.4, 0, 0]}>
                <boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color={color} />
                {i === 3 && <mesh position={[0, 0.3, 0.1]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="black" /></mesh>}
              </mesh>
            ))}
          </group>
          <mesh position={[0.5, 0.2, 0.6]} rotation={[0, 0.5, 0]}><boxGeometry args={[0.3, 0.2, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[-0.5, 0.2, 0.6]} rotation={[0, -0.5, 0]}><boxGeometry args={[0.3, 0.2, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.2, 0.4, 0.5]} />
          <Eye pos={[-0.2, 0.4, 0.5]} />
        </group>
      )}

      {name === 'Alligator' && (
        <group>
          <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1, 0.5, 2.5]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.35, 1.8]} castShadow><boxGeometry args={[0.7, 0.3, 1.2]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.2, -1.8]} castShadow><boxGeometry args={[0.6, 0.3, 1.5]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.3, 0.6, 0.8]} />
          <Eye pos={[-0.3, 0.6, 0.8]} />
        </group>
      )}

      {name === 'Dragonfly' && (
        <group>
          <mesh position={[0, 0.1, 0]} castShadow><boxGeometry args={[0.2, 0.2, 2.5]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.2, 1.1]} castShadow><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color={color} /></mesh>
          <group ref={wingRef1} position={[0.5, 0.2, 0.8]}><mesh><boxGeometry args={[1.5, 0.05, 0.4]} /><meshStandardMaterial color="white" transparent opacity={0.4} /></mesh></group>
          <group ref={wingRef2} position={[-0.5, 0.2, 0.8]}><mesh><boxGeometry args={[1.5, 0.05, 0.4]} /><meshStandardMaterial color="white" transparent opacity={0.4} /></mesh></group>
          <Eye pos={[0.2, 0.3, 1.3]} />
          <Eye pos={[-0.2, 0.3, 1.3]} />
        </group>
      )}

      {name === 'Camel' && (
        <group>
          <mesh position={[0, 0.8, 0]} castShadow><boxGeometry args={[1, 1, 2]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1.5, 0.2]} castShadow><boxGeometry args={[0.8, 0.6, 0.8]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1.2, 1.2]} castShadow rotation={[-0.5, 0, 0]}><boxGeometry args={[0.5, 1.5, 0.5]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.2, 1.8, 1.6]} />
          <Eye pos={[-0.2, 1.8, 1.6]} />
        </group>
      )}

      {name === 'Cat' && (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.7, 0.6, 1.2]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.9, 0.5]} castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0.2, 1.2, 0.5]}><boxGeometry args={[0.2, 0.2, 0.1]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[-0.2, 1.2, 0.5]}><boxGeometry args={[0.2, 0.2, 0.1]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 0.4, -0.8]} rotation={[0.5, 0, 0]}><boxGeometry args={[0.1, 0.1, 0.8]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.15, 1.0, 0.75]} />
          <Eye pos={[-0.15, 1.0, 0.75]} />
        </group>
      )}

      {/* Fallback */}
      {!['Cow', 'Pig', 'Sheep', 'Shark', 'Fish', 'Whale', 'Chicken', 'Duck', 'Frog', 'Snake', 'Scorpion', 'Alligator', 'Dragonfly', 'Camel', 'Cat'].includes(name) && (
        <group>
          <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.8, 0.6, 1.2]} /><meshStandardMaterial color={color} /></mesh>
          <mesh position={[0, 1, 0.5]} castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color={color} /></mesh>
          <Eye pos={[0.15, 1.1, 0.75]} />
          <Eye pos={[-0.15, 1.1, 0.75]} />
        </group>
      )}
    </group>
  );
}

function CareBurst({ type, seed }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() + seed;
    groupRef.current.rotation.y = t * 0.9;
    groupRef.current.position.y = 1.8 + Math.sin(t * 3) * 0.18;
  });

  const color = type === 'feed' ? '#fbbf24' : '#fb7185';
  const items = [0, 1, 2, 3, 4, 5];

  return (
    <group ref={groupRef}>
      {items.map((item) => {
        const angle = (item / items.length) * Math.PI * 2;
        const x = Math.cos(angle) * 1.4;
        const z = Math.sin(angle) * 1.4;

        return (
          <mesh key={`${type}-${seed}-${item}`} position={[x, item * 0.08, z]} castShadow>
            {type === 'feed' ? (
              <boxGeometry args={[0.24, 0.24, 0.24]} />
            ) : (
              <sphereGeometry args={[0.16, 12, 12]} />
            )}
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

// --- Animal Component ---

function BlockyAnimal({ position, color, name, onSelect, care, selected, burst }) {
  const [hovered, setHover] = useState(false);
  const befriended = isBefriended(care);

  return (
    <group 
      position={position} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
        <group scale={selected ? 1.15 : 1}>
          <AnimalShape name={name} color={color} />
        </group>
      </Float>

      {(selected || befriended) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <torusGeometry args={[1.35, 0.05, 8, 40]} />
          <meshStandardMaterial
            color={befriended ? '#facc15' : '#38bdf8'}
            emissive={befriended ? '#facc15' : '#38bdf8'}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {care?.feed && (
        <mesh position={[-0.45, 2.35, 0]}>
          <boxGeometry args={[0.32, 0.32, 0.32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
        </mesh>
      )}

      {care?.pet && (
        <mesh position={[0.45, 2.35, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.2} />
        </mesh>
      )}

      {burst && <CareBurst type={burst.type} seed={burst.seed} />}
        
      {(hovered || selected || befriended) && (
        <Text
          position={[0, 2.85, 0]}
          fontSize={0.6}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {befriended ? `${name} friend!` : `${name}!`}
        </Text>
      )}
    </group>
  );
}

// --- Camera Controller ---

function PlayerAvatar({ playerRef }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.copy(playerRef.current);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.8, 1.1, 0.6]} />
        <meshStandardMaterial color="#fb7185" />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#fde68a" />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.28, 0.8, 4]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
    </group>
  );
}

function Rig({ controlsRef, playerRef }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const keys = controls.keys;
    const keyX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    const keyY = (keys.forward ? 1 : 0) - (keys.back ? 1 : 0);
    const moveX = controls.moveX || keyX;
    const moveY = controls.moveY || keyY;

    const forward = new THREE.Vector3(-Math.sin(controls.yaw), 0, -Math.cos(controls.yaw));
    const right = new THREE.Vector3(Math.cos(controls.yaw), 0, -Math.sin(controls.yaw));
    const movement = new THREE.Vector3()
      .addScaledVector(forward, moveY)
      .addScaledVector(right, moveX);

    if (movement.lengthSq() > 0) {
      movement.normalize().multiplyScalar(8 * delta);
      playerRef.current.add(movement);
      playerRef.current.x = THREE.MathUtils.clamp(playerRef.current.x, -WORLD_LIMIT, WORLD_LIMIT);
      playerRef.current.z = THREE.MathUtils.clamp(playerRef.current.z, -WORLD_LIMIT, WORLD_LIMIT);
    }

    const lookTarget = playerRef.current.clone().addScaledVector(forward, 3);
    lookTarget.y = 1.1 + controls.pitch * 3;
    const cameraTarget = playerRef.current.clone().addScaledVector(forward, -8);
    cameraTarget.y = 4.5;

    camera.position.lerp(cameraTarget, 0.14);
    camera.lookAt(lookTarget);
  });

  return null;
}

function Joystick({ controlsRef }) {
  const baseRef = useRef(null);
  const pointerIdRef = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const updateMove = (event) => {
    const rect = baseRef.current?.getBoundingClientRect();
    if (!rect) return;

    const radius = rect.width / 2;
    const centerX = rect.left + radius;
    const centerY = rect.top + radius;
    const dx = THREE.MathUtils.clamp(event.clientX - centerX, -radius, radius);
    const dy = THREE.MathUtils.clamp(event.clientY - centerY, -radius, radius);
    const length = Math.min(radius, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;

    setKnob({ x, y });
    controlsRef.current.moveX = x / radius;
    controlsRef.current.moveY = -y / radius;
  };

  const resetMove = () => {
    pointerIdRef.current = null;
    setKnob({ x: 0, y: 0 });
    controlsRef.current.moveX = 0;
    controlsRef.current.moveY = 0;
  };

  return (
    <div
      ref={baseRef}
      data-animal-hud
      className="absolute bottom-6 left-5 z-20 h-28 w-28 rounded-full border-2 border-white/35 bg-white/15 shadow-2xl backdrop-blur-md touch-none sm:h-32 sm:w-32"
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        pointerIdRef.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateMove(event);
      }}
      onPointerMove={(event) => {
        if (pointerIdRef.current !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        updateMove(event);
      }}
      onPointerUp={resetMove}
      onPointerCancel={resetMove}
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-lg shadow-black/20"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}

export default function AnimalHunt({ onBack }) {
  const [animalCare, setAnimalCare] = useState({});
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [careBurst, setCareBurst] = useState(null);
  const controlsRef = useRef({
    moveX: 0,
    moveY: 0,
    yaw: 0,
    pitch: 0,
    keys: {
      forward: false,
      back: false,
      left: false,
      right: false,
    },
  });
  const playerRef = useRef(new THREE.Vector3(0, 0, 10));
  const lookDragRef = useRef(null);
  const animals = useMemo(() => WORLD_ANIMALS, []);

  useEffect(() => {
    const setKey = (event, isDown) => {
      const keys = controlsRef.current.keys;
      if (['ArrowUp', 'w', 'W'].includes(event.key)) keys.forward = isDown;
      if (['ArrowDown', 's', 'S'].includes(event.key)) keys.back = isDown;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) keys.left = isDown;
      if (['ArrowRight', 'd', 'D'].includes(event.key)) keys.right = isDown;
    };

    const handleKeyDown = (event) => setKey(event, true);
    const handleKeyUp = (event) => setKey(event, false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const selectedAnimal = animals.find((animal) => animal.id === selectedAnimalId);
  const selectedCare = selectedAnimal ? animalCare[selectedAnimal.id] || {} : {};

  const handleSelectAnimal = (id) => {
    setSelectedAnimalId(id);
    playSound('click');
  };

  const handleCareAction = (action) => {
    if (!selectedAnimal) return;

    const nextCare = {
      ...(animalCare[selectedAnimal.id] || {}),
      [action]: true,
    };
    const wasBefriended = isBefriended(animalCare[selectedAnimal.id]);
    const nowBefriended = isBefriended(nextCare);

    setAnimalCare((current) => ({
      ...current,
      [selectedAnimal.id]: nextCare,
    }));
    setCareBurst({ id: selectedAnimal.id, type: action, seed: Date.now() });
    playSound(CARE_ACTIONS[action].sound);
    setTimeout(() => {
      setCareBurst((current) => current?.id === selectedAnimal.id && current.type === action ? null : current);
    }, 1300);

    if (!wasBefriended && nowBefriended) {
      setTimeout(() => playSound('levelUp'), 180);
    }
  };

  const resetWorld = () => {
    setAnimalCare({});
    setSelectedAnimalId(null);
    setCareBurst(null);
    playerRef.current.set(0, 0, 10);
    controlsRef.current.yaw = 0;
    controlsRef.current.pitch = 0;
  };

  const totalAnimals = animals.length;
  const befriendedCount = animals.filter((animal) => isBefriended(animalCare[animal.id])).length;
  const animalsLeft = totalAnimals - befriendedCount;

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-sky-700 touch-none"
      onPointerDownCapture={(event) => {
        if (event.target instanceof HTMLElement && event.target.closest('[data-animal-hud]')) return;
        if (event.clientX < window.innerWidth * 0.42) return;
        lookDragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      }}
      onPointerMoveCapture={(event) => {
        const drag = lookDragRef.current;
        if (!drag || drag.id !== event.pointerId) return;

        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        controlsRef.current.yaw -= dx * 0.006;
        controlsRef.current.pitch = THREE.MathUtils.clamp(controlsRef.current.pitch - dy * 0.002, -0.35, 0.18);
        lookDragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      }}
      onPointerUpCapture={(event) => {
        if (lookDragRef.current?.id === event.pointerId) lookDragRef.current = null;
      }}
      onPointerCancelCapture={() => {
        lookDragRef.current = null;
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex w-full items-start justify-between gap-3 p-3 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <button 
            onClick={onBack}
            className="pointer-events-auto rounded-full border border-white/25 bg-white/15 p-3 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/25"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="rounded-2xl border border-white/25 bg-slate-950/35 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-5">
            <h1 className="text-lg font-black text-white sm:text-2xl">Blocky Animal Island</h1>
            <p className="text-sm font-bold text-amber-100 sm:text-base">
              {animalsLeft === 0 ? "All animals are friends!" : `Friends ${befriendedCount} / ${totalAnimals}`}
            </p>
          </div>
        </div>
        {animalsLeft === 0 && (
          <button 
            onClick={resetWorld}
            className="pointer-events-auto bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-8 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Play Again
          </button>
        )}
      </div>

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 5, 16], fov: 65 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#8bd3ff']} />
          <fog attach="fog" args={['#8bd3ff', 28, 86]} />
          
          <Sky sunPosition={[100, 40, 100]} turbidity={5} rayleigh={0.8} />
          <Stars radius={120} depth={50} count={1200} factor={4} saturation={0} fade speed={0.4} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[12, 18, 10]} intensity={1.8} castShadow />
          
          {BIOMES.map((biome) => (
            <Environment
              key={biome.name}
              type={biome.decorations}
              groundColor={biome.groundColor}
              position={biome.center}
              size={BIOME_SIZE}
            />
          ))}

          {animals.map((animal) => (
            <BlockyAnimal 
              key={animal.id}
              {...animal} 
              onSelect={() => handleSelectAnimal(animal.id)}
              care={animalCare[animal.id]}
              selected={selectedAnimalId === animal.id}
              burst={careBurst?.id === animal.id ? careBurst : null}
            />
          ))}

          <PlayerAvatar playerRef={playerRef} />
          <Rig controlsRef={controlsRef} playerRef={playerRef} />
        </Suspense>
      </Canvas>
      <Joystick controlsRef={controlsRef} />

      <div data-animal-hud className="pointer-events-none absolute bottom-5 right-4 z-20 flex w-[min(22rem,calc(100vw-9.5rem))] flex-col gap-3 sm:bottom-6 sm:right-6 sm:w-80">
        {selectedAnimal ? (
          <div className="pointer-events-auto rounded-3xl border border-white/25 bg-slate-950/55 p-4 text-white shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">{selectedAnimal.biome}</p>
                <h2 className="truncate text-2xl font-black leading-none">{selectedAnimal.name}</h2>
              </div>
              {isBefriended(selectedCare) && (
                <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase text-amber-950 shadow-lg">
                  Friend
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CARE_ACTIONS).map(([action, config]) => {
                const Icon = config.Icon;
                const complete = Boolean(selectedCare[action]);

                return (
                  <button
                    key={action}
                    onClick={() => handleCareAction(action)}
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-base font-black shadow-lg transition active:scale-95 ${
                      complete
                        ? 'border-emerald-200/70 bg-emerald-300 text-emerald-950'
                        : 'border-white/25 bg-white text-slate-900 hover:bg-amber-100'
                    }`}
                  >
                    <Icon size={22} />
                    {complete ? config.completeLabel : config.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="hidden rounded-full border border-white/20 bg-slate-950/30 px-4 py-3 text-center text-sm font-bold text-white/85 shadow-xl backdrop-blur-md sm:block">
            Tap an animal to feed or pet it.
          </div>
        )}
      </div>
      
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/25 px-4 py-2 text-center text-sm font-bold text-white/80 backdrop-blur-md sm:block">
        Walk with the left stick or WASD. Drag the right side to look. Tap animals.
      </div>
    </div>
  );
}
