import * as THREE from 'three';
import { minTileIndex, maxTileIndex } from '../utils/constants';

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
  const type = randomElement(['car', 'truck', 'forest']);
  if (type === 'car') return generateCarLaneMetadata();
  if (type === 'truck') return generateTruckLaneMetadata();
  return generateForesMetadata();
}

export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
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

export function generateCarLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);
  const occupiedTiles = new Set();
  const vehicles = Array.from({ length: 3 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    const color = randomElement([0xa52523, 0xbdb638, 0x78b14b]);
    return { initialTileIndex, color };
  });
  return { type: 'car', direction, speed, vehicles };
}

export function generateTruckLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);
  const occupiedTiles = new Set();
  const vehicles = Array.from({ length: 2 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 2);
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    occupiedTiles.add(initialTileIndex + 2);
    const color = randomElement([0xa52523, 0xbdb638, 0x78b14b]);
    return { initialTileIndex, color };
  });
  return { type: 'truck', direction, speed, vehicles };
} 
