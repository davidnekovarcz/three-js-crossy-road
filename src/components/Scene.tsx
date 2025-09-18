import React from 'react';
import { Canvas } from '@react-three/fiber';
import { throttleRender } from '@/utils/fpsThrottle';
import { CAMERA_CONFIG } from '@/utils/constants';

/**
 * Scene wrapper component that provides the Three.js Canvas with
 * optimized rendering and lighting setup
 */
const Scene = ({ children }) => (
  <Canvas
    orthographic={true}
    shadows={true}
    camera={CAMERA_CONFIG}
    frameloop="always"
    onCreated={throttleRender}
  >
    <ambientLight />
    {children}
  </Canvas>
);

export default Scene;
