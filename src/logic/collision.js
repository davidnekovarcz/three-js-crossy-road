import { useGameStore } from '../store/gameStore';
import { playerState, resetPlayerStore } from './playerLogic';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function useHitDetection(vehicle, rowIndex) {
  const endGame = useGameStore((state) => state.endGame);
  const cornCount = useGameStore((state) => state.cornCount);
  const checkpointRow = useGameStore((state) => state.checkpointRow);
  const checkpointTile = useGameStore((state) => state.checkpointTile);
  const pause = useGameStore((state) => state.pause);
  const resume = useGameStore((state) => state.resume);
  const decrementCorn = () => useGameStore.setState((state) => ({ cornCount: Math.max(0, state.cornCount - 1) }));

  useFrame(() => {
    if (!vehicle.current) return;
    if (!playerState.ref) return;
    if (
      rowIndex === playerState.currentRow ||
      rowIndex === playerState.currentRow + 1 ||
      rowIndex === playerState.currentRow - 1
    ) {
      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(vehicle.current);
      const playerBoundingBox = new THREE.Box3();
      playerBoundingBox.setFromObject(playerState.ref);
      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        if (!playerState.shake) {
          playerState.shake = true;
          playerState.shakeStartTime = performance.now();
          setTimeout(() => {
            playerState.shake = false;
          }, 600); // shake duration in ms
        }
        if (cornCount > 0) {
          decrementCorn();
          // Respawn to checkpoint
          playerState.currentRow = checkpointRow;
          playerState.currentTile = checkpointTile;
          playerState.movesQueue = [];
          if (playerState.ref) {
            playerState.ref.position.x = checkpointTile * (window.tileSize || 42);
            playerState.ref.position.y = checkpointRow * (window.tileSize || 42);
            playerState.ref.position.z = 0;
            // Reset squash/stretch
            if (playerState.ref.children && playerState.ref.children[0]) {
              playerState.ref.children[0].scale.set(1, 1, 1);
              playerState.ref.children[0].position.z = 0;
            }
          }
          // Start respawn animation
          playerState.respawning = true;
          playerState.respawnStartTime = performance.now();
          return;
        }
        endGame();
      }
    }
  });
} 
