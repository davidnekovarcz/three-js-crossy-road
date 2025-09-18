import React from 'react';
import { tileSize } from '@/utils/constants';
import { TreeProps } from '@/types';

export default function Tree({ tileIndex, height }: TreeProps) {
  const foliageOffsets = [0, 6];
  return (
    <group position-x={tileIndex * tileSize}>
      {/* Trunk */}
      <mesh
        position-z={height / 2}
        castShadow
        receiveShadow
        rotation-x={Math.PI / 2}
      >
        <cylinderGeometry args={[4, 4, height, 8]} />
        <meshLambertMaterial color={0x8d5524} flatShading />
      </mesh>
      {/* Foliage: two or three stacked/offset spheres */}
      <mesh position-z={height + 14} castShadow receiveShadow>
        <sphereGeometry args={[18, 16, 16]} />
        <meshLambertMaterial color={0x6cbf2c} flatShading />
      </mesh>
      <mesh
        position={[foliageOffsets[0], 0, height + 28]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[13, 16, 16]} />
        <meshLambertMaterial color={0x5ea726} flatShading />
      </mesh>
      <mesh
        position={[-foliageOffsets[1], 0, height + 20]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[10, 16, 16]} />
        <meshLambertMaterial color={0x4e8c1a} flatShading />
      </mesh>
    </group>
  );
}
