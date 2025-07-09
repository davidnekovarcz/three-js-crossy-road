import React, { useRef, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import { useVehicleAnimation } from '@/animation/useVehicleAnimation';
import { useHitDetection } from '@/logic/collisionEffects';
import { tilesPerRow, tileSize, minTileIndex, maxTileIndex } from '@/utils/constants';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';
import Ball from './Ball';
import BallLane from './BallLane';
import Corn from './Corn';
import Grass from './Grass';
import GridLines from './GridLines';
import Log from './Log';
import LogLane from './LogLane';
import Road from './Road';
import Tree from './Tree';

export default function Map() {
  const rows = useMapStore((state) => state.rows);
  return (
    <>
      <Grass rowIndex={0} />
      <Grass rowIndex={-1} />
      <Grass rowIndex={-2} />
      <Grass rowIndex={-3} />
      <Grass rowIndex={-4} />
      <Grass rowIndex={-5} />
      <Grass rowIndex={-6} />
      <Grass rowIndex={-7} />
      <Grass rowIndex={-8} />
      {rows.map((rowData, index) => (
        <Row key={index} rowIndex={index + 1} rowData={rowData} />
      ))}
    </>
  );
}

export function Row({ rowIndex, rowData }) {
  switch (rowData.type) {
    case 'forest':
      return <Forest rowIndex={rowIndex} rowData={rowData} />;
    case 'log':
      return <LogLane rowIndex={rowIndex} rowData={rowData} />;
    case 'animal':
      return <BallLane rowIndex={rowIndex} rowData={rowData} />;
    case 'grass':
      return <Grass rowIndex={rowIndex} />;
    default:
      return null;
  }
}

export function Forest({ rowIndex, rowData }) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.trees.map((tree, index) => (
        <Tree key={index} tileIndex={tree.tileIndex} height={tree.height} />
      ))}
      {rowData.corn && rowData.corn.map((tileIndex, idx) => (
        <Corn key={"corn-"+tileIndex} tileIndex={tileIndex} />
      ))}
      {rowData.collectedCorn && rowData.collectedCorn.map((c, idx) => (
        <Corn key={"collected-"+c.tileIndex+"-"+c.start} tileIndex={c.tileIndex} collected start={c.start} rowIndex={rowIndex} />
      ))}
    </Grass>
  );
} 
