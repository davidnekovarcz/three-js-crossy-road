import React from 'react';
import {
  tilesPerRow,
  tileSize,
  minTileIndex,
  maxTileIndex,
} from '@/utils/constants';

export default function GridLines({ variant = 'grass' }) {
  const opacity = variant === 'road' ? 0.06 : 0.18;
  const lines = [];
  for (let i = minTileIndex; i <= maxTileIndex + 1; i++) {
    lines.push(
      <mesh key={`v-${i}`} position-x={i * tileSize - tileSize / 2}>
        <boxGeometry args={[0.5, tileSize, 2]} />
        <meshBasicMaterial color={0xcccccc} transparent opacity={opacity} />
      </mesh>
    );
  }
  lines.push(
    <mesh key="h-top" position-y={tileSize / 2}>
      <boxGeometry args={[(tilesPerRow + 2) * tileSize, 0.5, 2]} />
      <meshBasicMaterial color={0xcccccc} transparent opacity={opacity * 0.6} />
    </mesh>
  );
  lines.push(
    <mesh key="h-bottom" position-y={-tileSize / 2}>
      <boxGeometry args={[(tilesPerRow + 2) * tileSize, 0.5, 2]} />
      <meshBasicMaterial color={0xcccccc} transparent opacity={opacity * 0.6} />
    </mesh>
  );
  return <group>{lines}</group>;
}
