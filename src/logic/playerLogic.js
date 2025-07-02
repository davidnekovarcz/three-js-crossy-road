import { useGameStore } from '@/store/gameStore';
import { useMapStore } from '@/store/mapStore';
import { minTileIndex, maxTileIndex, tileSize } from '@/utils/constants';
import { playCornSound } from '@/sound/playCornSound';

export const playerState = {
  currentRow: 0,
  currentTile: 0,
  movesQueue: [],
  ref: null,
  shake: false,
  shakeStartTime: null,
  respawning: false,
  respawnStartTime: null,
  respawnDuration: 1200
};

export function queueMove(direction) {
  if (useGameStore.getState().status === 'over') {
    playerState.movesQueue = [];
    return;
  }
  if (playerState.respawning) return;
  if (playerState.movesQueue.length > 0) return;
  const isValidMove = endsUpInValidPosition(
    { rowIndex: playerState.currentRow, tileIndex: playerState.currentTile },
    [...playerState.movesQueue, direction]
  );
  if (!isValidMove) return;
  playerState.movesQueue.push(direction);
}

export function stepCompleted() {
  const direction = playerState.movesQueue.shift();
  if (direction === 'forward') playerState.currentRow += 1;
  if (direction === 'backward') playerState.currentRow -= 1;
  if (direction === 'left') playerState.currentTile -= 1;
  if (direction === 'right') playerState.currentTile += 1;

  // Corn collection logic
  const mapStore = useMapStore.getState();
  const gameStore = useGameStore.getState();
  const rowIdx = playerState.currentRow - 1;
  const tileIdx = playerState.currentTile;
  const rows = mapStore.rows;
  if (rows[rowIdx] && rows[rowIdx].type === 'forest' && rows[rowIdx].corn) {
    const cornIdx = rows[rowIdx].corn.indexOf(tileIdx);
    if (cornIdx !== -1) {
      // Mark corn as collected with timestamp
      if (!rows[rowIdx].collectedCorn) rows[rowIdx].collectedCorn = [];
      rows[rowIdx].collectedCorn.push({ tileIndex: tileIdx, start: performance.now() });
      rows[rowIdx].corn.splice(cornIdx, 1);
      useMapStore.setState({ rows: [...rows] });
      playCornSound();
      useGameStore.getState().incrementCorn();
      useGameStore.getState().setCheckpoint(playerState.currentRow, playerState.currentTile);
    }
  }

  if (playerState.currentRow === mapStore.rows.length - 10) {
    mapStore.addRows();
  }
  gameStore.updateScore(playerState.currentRow);
}

export function setPlayerRef(ref) {
  playerState.ref = ref;
}

export function resetPlayerStore() {
  playerState.currentRow = 0;
  playerState.currentTile = 0;
  playerState.movesQueue = [];
  playerState.shake = false;
  playerState.shakeStartTime = null;
  playerState.respawning = false;
  playerState.respawnStartTime = null;
  playerState.respawnDuration = 1200;
  if (!playerState.ref) return;
  playerState.ref.position.x = 0;
  playerState.ref.position.y = 0;
  playerState.ref.children[0].rotation.z = 0;
}

export function calculateFinalPosition(currentPosition, moves) {
  return moves.reduce((position, direction) => {
    if (direction === 'forward')
      return { rowIndex: position.rowIndex + 1, tileIndex: position.tileIndex };
    if (direction === 'backward')
      return { rowIndex: position.rowIndex - 1, tileIndex: position.tileIndex };
    if (direction === 'left')
      return { rowIndex: position.rowIndex, tileIndex: position.tileIndex - 1 };
    if (direction === 'right')
      return { rowIndex: position.rowIndex, tileIndex: position.tileIndex + 1 };
    return position;
  }, currentPosition);
}

export function endsUpInValidPosition(currentPosition, moves) {
  const finalPosition = calculateFinalPosition(currentPosition, moves);
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    return false;
  }
  const finalRow = useMapStore.getState().rows[finalPosition.rowIndex - 1];
  if (
    finalRow &&
    finalRow.type === 'forest' &&
    finalRow.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
  ) {
    return false;
  }
  return true;
} 
