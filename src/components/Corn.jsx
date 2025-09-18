import React, { useRef, useState } from 'react';
import { tileSize } from '@/utils/constants';
import { useFrame } from '@react-three/fiber';
import { playerState } from '@/logic/playerLogic';
import { visibleTilesDistance } from '@/utils/constants';

export default function Corn({
  tileIndex,
  collected = false,
  start,
  rowIndex,
}) {
  const ref = useRef();
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  const isVisible =
    typeof rowIndex === 'number'
      ? Math.abs(rowIndex - playerState.currentRow) <= visibleTilesDistance
      : true;
  useFrame(() => {
    if (!isVisible) return;
    if (!collected || !ref.current || doneRef.current) return;
    const duration = 0.6;
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed >= duration) {
      if (!doneRef.current) {
        doneRef.current = true;
        setDone(prev => {
          if (!prev) return true;
          return prev;
        });
      }
      return;
    }
    const scale = 1 + 2 * Math.sin((elapsed / duration) * Math.PI);
    ref.current.scale.set(scale, scale, scale);
    ref.current.position.z = 30 + 10 * Math.sin((elapsed / duration) * Math.PI);
  });
  if (done) return null;
  return (
    <group ref={ref} position={[tileIndex * tileSize, 0, 6]}>
      {/* Corn cob (yellow) */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[2, 4, 8, 16]} />
        <meshLambertMaterial color={0xffe066} flatShading />
      </mesh>
      {/* Husk (green leaves) */}
      <mesh position={[0, -1.5, -2]} rotation-z={0.3}>
        <cylinderGeometry args={[0.3, 0.7, 3, 8]} />
        <meshLambertMaterial color={0x4caf50} flatShading />
      </mesh>
      <mesh position={[0.7, 0, -2]} rotation-z={-0.7}>
        <cylinderGeometry args={[0.2, 0.5, 2.5, 8]} />
        <meshLambertMaterial color={0x4caf50} flatShading />
      </mesh>
      <mesh position={[-0.7, 0, -2]} rotation-z={0.7}>
        <cylinderGeometry args={[0.2, 0.5, 2.5, 8]} />
        <meshLambertMaterial color={0x4caf50} flatShading />
      </mesh>
    </group>
  );
}
