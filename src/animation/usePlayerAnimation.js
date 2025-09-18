import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerState, stepCompleted } from '@/logic/playerLogic';
import { tileSize } from '@/utils/constants';
import { useGameStore } from '@/store/gameStore';
import { useRef } from 'react';

export function usePlayerAnimation(ref) {
  const moveClock = useRef(new THREE.Clock(false));
  const isPaused = useGameStore(state => state.isPaused);
  // Track if we just finished respawning
  const justRespawned = useRef(false);

  useFrame(() => {
    if (!ref.current) return;
    if (isPaused || playerState.shake || playerState.respawning) {
      // If respawning just ended, set flag
      if (!playerState.respawning && justRespawned.current) {
        justRespawned.current = false;
      }
      // If currently respawning, set flag
      if (playerState.respawning) {
        justRespawned.current = true;
        moveClock.current.stop();
        moveClock.current.elapsedTime = 0;
      }
      return;
    }
    if (
      window.useGameStore &&
      window.useGameStore.getState().status === 'over'
    ) {
      playerState.movesQueue = [];
      return;
    }
    if (!playerState.movesQueue.length) return;
    // If we just respawned, reset the clock for the first move
    if (justRespawned.current) {
      moveClock.current.stop();
      moveClock.current.start();
      justRespawned.current = false;
    }
    const player = ref.current;
    if (!moveClock.current.running) moveClock.current.start();
    const stepTime = 0.2;
    const progress = Math.min(1, moveClock.current.getElapsedTime() / stepTime);
    setPosition(player, progress);
    setRotation(player, progress);
    if (progress >= 1) {
      stepCompleted();
      moveClock.current.stop();
    }
  });
}

export function setPosition(player, progress) {
  const startX = playerState.currentTile * tileSize;
  const startY = playerState.currentRow * tileSize;
  let endX = startX;
  let endY = startY;
  if (playerState.movesQueue[0] === 'left') endX -= tileSize;
  if (playerState.movesQueue[0] === 'right') endX += tileSize;
  if (playerState.movesQueue[0] === 'forward') endY += tileSize;
  if (playerState.movesQueue[0] === 'backward') endY -= tileSize;
  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  player.children[0].position.z = Math.sin(progress * Math.PI) * 12;
}

export function setRotation(player, progress) {
  let endRotation = 0;
  if (playerState.movesQueue[0] === 'forward') endRotation = 0;
  if (playerState.movesQueue[0] === 'left') endRotation = Math.PI / 2;
  if (playerState.movesQueue[0] === 'right') endRotation = -Math.PI / 2;
  if (playerState.movesQueue[0] === 'backward') endRotation = Math.PI;
  player.children[0].rotation.z = THREE.MathUtils.lerp(
    player.children[0].rotation.z,
    endRotation,
    progress
  );
}
