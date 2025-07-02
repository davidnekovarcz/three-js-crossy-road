import { useGameStore } from '../store/gameStore';
import { playerState } from './playerLogic';
import * as THREE from 'three';

export function useHitDetection(vehicle, rowIndex) {
  const endGame = useGameStore((state) => state.endGame);
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
        }
        endGame();
      }
    }
  });
}
import { useFrame } from '@react-three/fiber'; 
