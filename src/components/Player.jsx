import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Bounds } from '@react-three/drei';
import { setPlayerRef, playerState, stepCompleted } from '@/logic/playerLogic';
import { usePlayerAnimation } from '@/animation/usePlayerAnimation';
import { DirectionalLight } from '@/components/SceneHelpers';
import * as THREE from 'three';

export default function Player() {
  const player = useRef(null);
  const lightRef = useRef(null);
  const camera = useThree((state) => state.camera);

  usePlayerAnimation(player);

  // Camera shake effect (runs always, even if paused)
  useFrame(() => {
    if (!player.current) return;
    if (!camera) return;
    if (playerState.shake) {
      // Shake: random offset, decaying over 600ms
      const elapsed = performance.now() - (playerState.shakeStartTime || 0);
      const duration = 600;
      const intensity = 8 * (1 - Math.min(1, elapsed / duration));
      camera.position.x = 300 + (Math.random() - 0.5) * intensity;
      camera.position.y = -300 + (Math.random() - 0.5) * intensity;
      camera.position.z = 300 + (Math.random() - 0.5) * intensity * 0.5;
    } else {
      // Reset camera position
      camera.position.set(300, -300, 300);
    }
  });

  useEffect(() => {
    if (!player.current) return;
    if (!lightRef.current) return;
    player.current.add(camera);
    lightRef.current.target = player.current;
    setPlayerRef(player.current);
  });

  return (
    <Bounds fit clip observe margin={10}>
      <group ref={player}>
        <ChickenBody />
        <DirectionalLight ref={lightRef} />
      </group>
    </Bounds>
  );
}

export function ChickenBody() {
  const group = useRef();
  useFrame(() => {
    if (!group.current) return;
    const player = group.current;
    // Animate squash/stretch
    const z = player.position.z;
    const progress = Math.min(1, Math.abs(z) / 12);
    const scaleY = 1 + 0.3 * progress;
    const scaleX = 1 - 0.15 * progress;
    const scaleZ = 1 - 0.15 * progress;
    player.children[0].scale.set(scaleX, scaleZ, scaleY);

    // Animate opacity and grow-from-ground on respawn
    if (playerState.respawning) {
      const duration = playerState.respawnDuration || 1200; // ms
      const elapsed = performance.now() - (playerState.respawnStartTime || 0);
      const t = Math.min(1, elapsed / duration);
      const opacity = t;
      const grow = 0.1 + 0.9 * t; // scale from 0.1 to 1
      // Set opacity and scale for all meshes in the group
      player.traverse((obj) => {
        if (obj.material) {
          obj.material.transparent = true;
          obj.material.opacity = opacity;
        }
      });
      player.scale.set(grow, grow, grow);
      if (opacity >= 1) {
        playerState.respawning = false;
        player.scale.set(1, 1, 1);
      }
    } else {
      // Ensure fully visible and normal scale if not respawning
      player.traverse((obj) => {
        if (obj.material) {
          obj.material.transparent = false;
          obj.material.opacity = 1;
        }
      });
      player.scale.set(1, 1, 1);
    }
  });
  return (
    <group ref={group}>
      {/* Body: round, chicken-like */}
      <mesh position={[0, 0, 13]} castShadow receiveShadow>
        <sphereGeometry args={[8, 24, 24]} />
        <meshLambertMaterial color={0xffffff} flatShading />
      </mesh>
      {/* Head: slightly smaller than body */}
      <mesh position={[0, 0, 22.5]} castShadow receiveShadow>
        <sphereGeometry args={[5.5, 24, 24]} />
        <meshLambertMaterial color={0xffffff} flatShading />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 5.5, 25.5]} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <coneGeometry args={[1.2, 2.5, 12]} />
        <meshLambertMaterial color={0xffc300} flatShading />
      </mesh>
      {/* Comb (red crest) */}
      <mesh position={[0, 0.5, 28.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshLambertMaterial color={0xd7263d} flatShading />
      </mesh>
      <mesh position={[-0.9, 0.2, 28]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshLambertMaterial color={0xd7263d} flatShading />
      </mesh>
      <mesh position={[0.9, 0.2, 28]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshLambertMaterial color={0xd7263d} flatShading />
      </mesh>
      {/* Left Eye */}
      <mesh position={[-1.7, 3.5, 26.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshLambertMaterial color={0x222222} />
      </mesh>
      {/* Right Eye */}
      <mesh position={[1.7, 3.5, 26.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshLambertMaterial color={0x222222} />
      </mesh>
      {/* Left Wing */}
      <mesh position={[-6.5, 0, 15]} rotation-z={-0.5} castShadow receiveShadow>
        <sphereGeometry args={[2.2, 12, 12]} />
        <meshLambertMaterial color={0xffffff} flatShading />
      </mesh>
      {/* Right Wing */}
      <mesh position={[6.5, 0, 15]} rotation-z={0.5} castShadow receiveShadow>
        <sphereGeometry args={[2.2, 12, 12]} />
        <meshLambertMaterial color={0xffffff} flatShading />
      </mesh>
      {/* Left Foot */}
      <mesh position={[-1.2, 0, 7]} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 8, 12]} />
        <meshLambertMaterial color={0xffa500} flatShading />
      </mesh>
      {/* Right Foot */}
      <mesh position={[1.2, 0, 7]} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 8, 12]} />
        <meshLambertMaterial color={0xffa500} flatShading />
      </mesh>
    </group>
  );
} 
