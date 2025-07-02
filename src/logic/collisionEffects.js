import { useGameStore } from '@/store/gameStore';
import { playerState } from '@/logic/playerLogic';
import { useFrame } from '@react-three/fiber';
import { playHorn } from '@/sound/playHorn';
import { playGameOverSound } from '@/sound/playGameOverSound';
import { useRef } from 'react';
import { boundingBoxesIntersect, isRowNear } from '@/logic/collisionUtils';

export function useHitDetection(vehicle, rowIndex) {
  const endGame = useGameStore((state) => state.endGame);
  const cornCount = useGameStore((state) => state.cornCount);
  const checkpointRow = useGameStore((state) => state.checkpointRow);
  const checkpointTile = useGameStore((state) => state.checkpointTile);
  const status = useGameStore((state) => state.status);
  const decrementCorn = () => useGameStore.setState((state) => ({ cornCount: Math.max(0, state.cornCount - 1) }));

  // Sound flags
  const collisionSoundPlayedRef = useRef(false);
  const gameOverSoundPlayedRef = useRef(false);

  useFrame(() => {
    if (!vehicle.current) return;
    if (!playerState.ref) return;
    if (status === 'over') return;
    if (isRowNear(rowIndex, playerState.currentRow)) {
      if (boundingBoxesIntersect(vehicle.current, playerState.ref)) {
        // Play horn sound only if cornCount > 0 and game is not over
        if (cornCount > 0 && !collisionSoundPlayedRef.current) {
          playHorn();
          collisionSoundPlayedRef.current = true;
        }
        if (!playerState.shake) {
          playerState.shake = true;
          playerState.shakeStartTime = performance.now();
          setTimeout(() => {
            playerState.shake = false;
          }, 600); // shake duration in ms
        }
        if (cornCount > 0) {
          // Reset collision sound flag for next collision
          collisionSoundPlayedRef.current = false;
          decrementCorn();
          // Play horn sound on respawn only if game is not over
          if (status !== 'over') {
            playHorn();
          }
          playerState.currentRow = checkpointRow;
          playerState.currentTile = checkpointTile;
          playerState.movesQueue = [];
          if (playerState.ref) {
            playerState.ref.position.x = checkpointTile * (window.tileSize || 42);
            playerState.ref.position.y = checkpointRow * (window.tileSize || 42);
            playerState.ref.position.z = 0;
            if (playerState.ref.children && playerState.ref.children[0]) {
              playerState.ref.children[0].scale.set(1, 1, 1);
              playerState.ref.children[0].position.z = 0;
            }
          }
          playerState.respawning = true;
          playerState.respawnStartTime = performance.now();
          playerState.respawnDuration = 1200; // ms
          return;
        }
        // Play game over sound once
        if (!gameOverSoundPlayedRef.current) {
          playGameOverSound();
          gameOverSoundPlayedRef.current = true;
        }
        endGame();
      } else {
        // Reset sound flags if not colliding
        collisionSoundPlayedRef.current = false;
        gameOverSoundPlayedRef.current = false;
      }
    } else {
      // Reset sound flags if not colliding
      collisionSoundPlayedRef.current = false;
      gameOverSoundPlayedRef.current = false;
    }
  });
}
