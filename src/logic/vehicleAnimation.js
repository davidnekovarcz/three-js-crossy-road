import { useFrame } from '@react-three/fiber';
import { minTileIndex, maxTileIndex, tileSize } from '../utils/constants';

export function useVehicleAnimation(ref, direction, speed) {
  useFrame((state, delta) => {
    if (!ref.current) return;
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
