import React, { useRef } from 'react';
import { useVehicleAnimation } from '@/animation/useVehicleAnimation';
import { useHitDetection } from '@/logic/collisionEffects';
import { tileSize, minTileIndex, maxTileIndex } from '@/utils/constants';
import { useFrame } from '@react-three/fiber';

export default function Ball({ rowIndex, ballIndex, direction, speed, color, total }) {
  const ballRef = useRef(null);
  const rotationRef = useRef(0);
  const wrapLength = (maxTileIndex - minTileIndex + 4) * tileSize;
  const beginningOfRow = (minTileIndex - 2) * tileSize;
  const endOfRow = (maxTileIndex + 2) * tileSize;
  const offset = (ballIndex / total) * wrapLength;
  useVehicleAnimation(ballRef, direction, speed, offset, wrapLength, beginningOfRow, endOfRow);
  useHitDetection(ballRef, rowIndex);
  let size = tileSize * 0.36;
  let ballZ = size;
  if (color === 0xf44336) { size = tileSize * 0.44; ballZ = size; }
  if (color === 0xff9800) { size = tileSize * 0.48; ballZ = size; }
  if (color === 0x9c27b0) { size = tileSize * 0.36; ballZ = size; }
  useFrame((_, delta) => {
    if (!ballRef.current) return;
    const rotSpeed = (speed / (tileSize * Math.PI)) * delta;
    rotationRef.current += direction ? rotSpeed : -rotSpeed;
    ballRef.current.rotation.y = rotationRef.current;
  });
  return (
    <group ref={ballRef} position={[0, 0, ballZ]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[size, 16, 16]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}
