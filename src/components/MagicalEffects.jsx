import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function MagicalEffects({ isCelebrating }) {
  const { width, height } = useWindowSize();

  if (!isCelebrating) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={400}
        gravity={0.15}
        initialVelocityY={15}
        colors={['#f472b6', '#c084fc', '#818cf8', '#38bdf8', '#34d399', '#fbbf24']} // Magical pastel colors
      />
    </div>
  );
}
