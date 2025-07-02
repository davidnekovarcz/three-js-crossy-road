import { useFrame } from '@react-three/fiber';
import { minTileIndex, maxTileIndex, tileSize } from '../utils/constants';
import { useGameStore } from '../store/gameStore';
import { playerState } from '../logic/playerLogic';
import { useRef } from 'react';

export function useVehicleAnimation(ref, direction, speed) {
  const isPaused = useGameStore((state) => state.isPaused);
  useFrame((state, delta) => {
    if (!ref.current) return;
    if (isPaused) return;
    const vehicle = ref.current;
    const beginningOfRow = (minTileIndex - 2) * tileSize;
    const endOfRow = (maxTileIndex + 2) * tileSize;
    if (direction) {
      vehicle.position.x =
        vehicle.position.x > endOfRow
          ? beginningOfRow
          : vehicle.position.x + speed * delta;
    } else {
      vehicle.position.x =
        vehicle.position.x < beginningOfRow
          ? endOfRow
          : vehicle.position.x - speed * delta;
    }
  });
} 
