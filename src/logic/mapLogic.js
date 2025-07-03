import * as THREE from 'three';
import { minTileIndex, maxTileIndex, tileSize } from '@/utils/constants';

export function generateRows(amount) {
  const rows = [];
  for (let i = 0; i < amount; i++) {
    if (i === 0) {
      rows.push({ type: 'grass' });
    } else if (i === 1) {
      rows.push(generateForesMetadata());
    } else {
      const rowData = generateRow();
      rows.push(rowData);
    }
  }
  return rows;
}

export function generateRow() {
  const type = randomElement(['log', 'animal', 'forest']);
  if (type === 'log') return generateLogLaneMetadata();
  if (type === 'animal') return generateAnimalLaneMetadata();
  return generateForesMetadata();
}

export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffled(array) {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateForesMetadata() {
  const occupiedTiles = new Set();
  const trees = Array.from({ length: 4 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);
    const height = randomElement([20, 45, 60]);
    return { tileIndex, height };
  });
  // Corn: randomly place on tree-free tiles
  const treeTiles = new Set(trees.map(t => t.tileIndex));
  const possibleCornTiles = [];
  for (let i = minTileIndex; i <= maxTileIndex; i++) {
    if (!treeTiles.has(i)) possibleCornTiles.push(i);
  }
  // Place 0-2 corn per row
  const corn = [];
  const cornCount = THREE.MathUtils.randInt(0, Math.min(2, possibleCornTiles.length));
  for (let i = 0; i < cornCount; i++) {
    if (possibleCornTiles.length === 0) break;
    const idx = THREE.MathUtils.randInt(0, possibleCornTiles.length - 1);
    corn.push(possibleCornTiles[idx]);
    possibleCornTiles.splice(idx, 1);
  }
  return { type: 'forest', trees, corn };
}

export function generateLogLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([110, 140, 170]);
  // For logs, just store N logs; position will be calculated in animation
  const logs = Array.from({ length: 3 }, (_, i) => ({ index: i }));
  return { type: 'log', direction, speed, logs };
}

export function generateAnimalLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([120, 150, 180]);
  const animals = Array.from({ length: 2 }, (_, i) => {
    const species = randomElement(['boar', 'deer', 'bear']);
    return { index: i, species };
  });
  return { type: 'animal', direction, speed, animals };
} 
