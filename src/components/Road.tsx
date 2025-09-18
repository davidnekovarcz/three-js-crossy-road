import React from 'react';
import { tilesPerRow, tileSize } from '@/utils/constants';
import GridLines from './GridLines';

export default function Road({ rowIndex, children }) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh receiveShadow>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x454a59} flatShading />
      </mesh>
      <mesh receiveShadow position-x={tilesPerRow * tileSize}>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x393d49} flatShading />
      </mesh>
      <mesh receiveShadow position-x={-tilesPerRow * tileSize}>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x393d49} flatShading />
      </mesh>
      {children}
      <group position-z={2}>
        <GridLines variant="road" />
      </group>
    </group>
  );
}
