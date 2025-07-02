import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerState, stepCompleted } from '@/logic/playerLogic';
import { tileSize } from '@/utils/constants';
import { useGameStore } from '@/store/gameStore';

export function usePlayerAnimation(ref) {
  const moveClock = new THREE.Clock(false);
  const isPaused = useGameStore((state) => state.isPaused);
  useFrame(() => {
    if (!ref.current) return;
    if (isPaused || playerState.shake || playerState.respawning) return;
    if (window.useGameStore && window.useGameStore.getState().status === 'over') {
      playerState.movesQueue = [];
      return;
    }
    if (!playerState.movesQueue.length) return;
    const player = ref.current;
    if (!moveClock.running) moveClock.start();
    const stepTime = 0.2;
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);
    setPosition(player, progress);
    setRotation(player, progress);
    if (progress >= 1) {
      stepCompleted();
      moveClock.stop();
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
