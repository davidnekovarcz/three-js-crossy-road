import React, { useRef } from 'react';
import { useVehicleAnimation } from '@/animation/useVehicleAnimation';
import { useHitDetection } from '@/logic/collisionEffects';
import { tileSize, minTileIndex, maxTileIndex, visibleTilesDistance } from '@/utils/constants';
import { playerState } from '@/logic/playerLogic';
import { useFrame } from '@react-three/fiber';

export default function Log({ rowIndex, logIndex, direction, speed, total }) {
  const logRef = useRef(null);
  const rotationRef = useRef(0);
  const wrapLength = (maxTileIndex - minTileIndex + 4) * tileSize; // +4 for 2-tile buffer each side
  const beginningOfRow = (minTileIndex - 2) * tileSize;
  const endOfRow = (maxTileIndex + 2) * tileSize;
  // Evenly space logs along the wrap path
  const offset = (logIndex / total) * wrapLength;
  useVehicleAnimation(logRef, direction, speed, offset, wrapLength, beginningOfRow, endOfRow);
  useHitDetection(logRef, rowIndex);
  const logRadius = tileSize * 0.32;
  const logLength = tileSize * 0.92;
  const logZ = logRadius;
  const isVisible = Math.abs(rowIndex - playerState.currentRow) <= visibleTilesDistance;
  useFrame((_, delta) => {
    if (!isVisible) return;
    if (!logRef.current) return;
    const rotSpeed = (speed / (tileSize * Math.PI)) * delta;
    rotationRef.current += direction ? rotSpeed : -rotSpeed;
    logRef.current.rotation.y = rotationRef.current;
  });
  return (
    <group ref={logRef} position={[0, 0, logZ]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[logRadius, logRadius, logLength, 16]} />
        <meshLambertMaterial color={0x9c6615} flatShading />
      </mesh>
    </group>
  );
}
