import { useFrame } from '@react-three/fiber';
import { minTileIndex, maxTileIndex, tileSize } from '@/utils/constants';
import { useGameStore } from '@/store/gameStore';

// This hook is used for both logs and animals (and previously vehicles)
export function useVehicleAnimation(
  ref,
  direction,
  speed,
  offset = 0,
  wrapLength,
  beginningOfRow,
  endOfRow
) {
  const isPaused = useGameStore(state => state.isPaused);
  useFrame((state, delta) => {
    if (!ref.current) return;
    if (isPaused) return;
    const vehicle = ref.current;
    // Calculate position along the wrap path
    if (wrapLength && beginningOfRow !== undefined && endOfRow !== undefined) {
      // Use time-based animation for smooth, even spacing
      const t = performance.now() / 1000;
      let pos;
      if (direction) {
        pos = beginningOfRow + ((speed * t + offset) % wrapLength);
        if (pos > endOfRow) pos = beginningOfRow + (pos - endOfRow);
      } else {
        pos = endOfRow - ((speed * t + offset) % wrapLength);
        if (pos < beginningOfRow) pos = endOfRow - (beginningOfRow - pos);
      }
      vehicle.position.x = pos;
    } else {
      // Fallback: legacy logic
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
    }
  });
}
