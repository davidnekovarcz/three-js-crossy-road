import React from 'react';
import { tilesPerRow, tileSize } from '@/utils/constants';
import GridLines from './GridLines';
import { GrassProps } from '@/types';

export default function Grass({ rowIndex, children }: GrassProps) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh receiveShadow>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0xbaf455} flatShading />
      </mesh>
      <mesh receiveShadow position-x={tilesPerRow * tileSize}>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0x99c846} flatShading />
      </mesh>
      <mesh receiveShadow position-x={-tilesPerRow * tileSize}>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0x99c846} flatShading />
      </mesh>
      {children}
      <group position-z={2}>
        <GridLines variant="grass" />
      </group>
    </group>
  );
}
