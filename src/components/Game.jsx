import React from 'react';
import { Canvas } from '@react-three/fiber';
import Player from './Player';
import Map from './Map';
import { Score, Controls, Result, CornScore } from './UI';

const Scene = ({ children }) => (
  <Canvas
    orthographic={true}
    shadows={true}
    camera={{
      up: [0, 0, 1],
      position: [300, -300, 300]
    }}
  >
    <ambientLight />
    {children}
  </Canvas>
);

export default function Game() {
  return (
    <div className="game">
      <Scene>
        <Player />
        <Map />
      </Scene>
      <Score />
      <CornScore />
      <Controls />
      <Result />
    </div>
  );
} 
