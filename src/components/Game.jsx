import React from 'react';
import { Canvas } from '@react-three/fiber';
import Player from '@/components/Player';
import Map from '@/components/Map';
import { Score, Controls, Result, CornScore } from '@/components/UI';

// FPS throttle logic
let lastFrame = 0;
const TARGET_FPS = 25;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

function throttleRender({ gl }) {
  const origRender = gl.render.bind(gl);
  gl.render = (...args) => {
    const now = performance.now();
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;
    origRender(...args);
  };
}

const Scene = ({ children }) => (
  <Canvas
    orthographic={true}
    shadows={true}
    camera={{
      up: [0, 0, 1],
      position: [300, -300, 300]
    }}
    frameloop="always"
    onCreated={throttleRender}
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
