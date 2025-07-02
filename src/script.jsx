/*

Learn how to code this watch step by step on YouTube:

https://www.youtube.com/watch?v=ccYrSACDNsw

or on:

https://javascriptgametutorials.com/

*/

import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bounds } from "@react-three/drei";
import * as THREE from "three";
import { create } from "zustand";

const minTileIndex = -8;
const maxTileIndex = 8;
const tilesPerRow = maxTileIndex - minTileIndex + 1;
const tileSize = 42;

const playerState = {
  currentRow: 0,
  currentTile: 0,
  movesQueue: [],
  ref: null,
  shake: false,
  shakeStartTime: null
};

function queueMove(direction) {
  if (useGameStore.getState().status === "over") {
    playerState.movesQueue = [];
    return;
  }
  // Only allow one move in the queue at a time
  if (playerState.movesQueue.length > 0) return;
  const isValidMove = endsUpInValidPosition(
    { rowIndex: playerState.currentRow, tileIndex: playerState.currentTile },
    [...playerState.movesQueue, direction]
  );
  if (!isValidMove) return;
  playerState.movesQueue.push(direction);
}

function stepCompleted() {
  const direction = playerState.movesQueue.shift();

  if (direction === "forward") playerState.currentRow += 1;
  if (direction === "backward") playerState.currentRow -= 1;
  if (direction === "left") playerState.currentTile -= 1;
  if (direction === "right") playerState.currentTile += 1;

  // Add new rows if the player is running out of them
  if (playerState.currentRow === useMapStore.getState().rows.length - 10) {
    useMapStore.getState().addRows();
  }

  useGameStore.getState().updateScore(playerState.currentRow);
}

function setPlayerRef(ref) {
  playerState.ref = ref;
}

function resetPlayerStore() {
  playerState.currentRow = 0;
  playerState.currentTile = 0;
  playerState.movesQueue = [];
  playerState.shake = false;
  playerState.shakeStartTime = null;
  if (!playerState.ref) return;
  playerState.ref.position.x = 0;
  playerState.ref.position.y = 0;
  playerState.ref.children[0].rotation.z = 0;
}

const useGameStore = create((set) => ({
  status: "running",
  score: 0,
  updateScore: (rowIndex) => {
    set((state) => ({ score: Math.max(rowIndex, state.score) }));
  },
  endGame: () => {
    set({ status: "over" });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set({ status: "running", score: 0 });
  }
}));

const useMapStore = create((set) => ({
  rows: generateRows(20),
  addRows: () => {
    const newRows = generateRows(20);
    set((state) => ({ rows: [...state.rows, ...newRows] }));
  },
  reset: () => set({ rows: generateRows(20) })
}));

function Game() {
  return (
    <div className="game">
      <Scene>
        <Player />
        <Map />
      </Scene>
      <Score />
      <Controls />
      <Result />
    </div>
  );
}

const Scene = ({ children }) => {
  return (
    <Canvas
      orthographic={true}
      shadows={true}
      camera={{
        up: [0, 0, 1],
        position: [300, -300, 300]
      }}
    >
      <ambientLight />
      {children}
    </Canvas>
  );
};

function Controls() {
  useEventListeners();

  return (
    <div id="controls">
      <div>
        <button onClick={() => queueMove("forward")}>▲</button>
        <button onClick={() => queueMove("left")}>◀</button>
        <button onClick={() => queueMove("backward")}>▼</button>
        <button onClick={() => queueMove("right")}>▶</button>
      </div>
    </div>
  );
}

function Score() {
  const score = useGameStore((state) => state.score);

  return <div id="score">{score}</div>;
}

function Result() {
  const status = useGameStore((state) => state.status);
  const score = useGameStore((state) => state.score);
  const reset = useGameStore((state) => state.reset);

  if (status === "running") return null;

  return (
    <div id="result-container">
      <div id="result">
        <h1>Game Over</h1>
        <p>Your score: {score}</p>
        <button onClick={reset}>Retry</button>
      </div>
    </div>
  );
}

function Player() {
  const player = useRef(null);
  const lightRef = useRef(null);
  const camera = useThree((state) => state.camera);

  usePlayerAnimation(player);

  useEffect(() => {
    if (!player.current) return;
    if (!lightRef.current) return;
    player.current.add(camera);
    lightRef.current.target = player.current;
    setPlayerRef(player.current);
  });

  // Camera shake effect
  useFrame(() => {
    if (!player.current) return;
    if (!playerState.shake) return;
    const shakeDuration = 0.5; // seconds
    const elapsed = (performance.now() - playerState.shakeStartTime) / 1000;
    if (elapsed < shakeDuration) {
      // Apply random shake to camera position
      camera.position.x += (Math.random() - 0.5) * 10;
      camera.position.y += (Math.random() - 0.5) * 10;
      camera.position.z += (Math.random() - 0.5) * 5;
    } else {
      playerState.shake = false;
      playerState.shakeStartTime = null;
    }
  });

  return (
    <Bounds fit clip observe margin={10}>
      <group ref={player}>
        <group>
          <mesh position={[0, 0, 10]} castShadow receiveShadow>
            <boxGeometry args={[15, 15, 20]} />
            <meshLambertMaterial color={0xffffff} flatShading />
          </mesh>
          <mesh position={[0, 0, 21]} castShadow receiveShadow>
            <boxGeometry args={[2, 4, 2]} />
            <meshLambertMaterial color={0xf0619a} flatShading />
          </mesh>
        </group>
        <DirectionalLight ref={lightRef} />
      </group>
    </Bounds>
  );
}

function DirectionalLight({ ref }) {
  return (
    <directionalLight
      ref={ref}
      position={[-100, -100, 200]}
      up={[0, 0, 1]}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-400}
      shadow-camera-right={400}
      shadow-camera-top={400}
      shadow-camera-bottom={-400}
      shadow-camera-near={50}
      shadow-camera-far={400}
    />
  );
}

function Map() {
  const rows = useMapStore((state) => state.rows);

  return (
    <>
      <Grass rowIndex={0} />
      <Grass rowIndex={-1} />
      <Grass rowIndex={-2} />
      <Grass rowIndex={-3} />
      <Grass rowIndex={-4} />
      <Grass rowIndex={-5} />
      <Grass rowIndex={-6} />
      <Grass rowIndex={-7} />
      <Grass rowIndex={-8} />

      {rows.map((rowData, index) => (
        <Row key={index} rowIndex={index + 1} rowData={rowData} />
      ))}
    </>
  );
}

function Row({ rowIndex, rowData }) {
  switch (rowData.type) {
    case "forest": {
      return <Forest rowIndex={rowIndex} rowData={rowData} />;
    }
    case "car": {
      return <CarLane rowIndex={rowIndex} rowData={rowData} />;
    }
    case "truck": {
      return <TruckLane rowIndex={rowIndex} rowData={rowData} />;
    }
  }
}

function Forest({ rowIndex, rowData }) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.trees.map((tree, index) => (
        <Tree key={index} tileIndex={tree.tileIndex} height={tree.height} />
      ))}
    </Grass>
  );
}

function CarLane({ rowIndex, rowData }) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.vehicles.map((vehicle, index) => (
        <Car
          key={index}
          rowIndex={rowIndex}
          initialTileIndex={vehicle.initialTileIndex}
          direction={rowData.direction}
          speed={rowData.speed}
          color={vehicle.color}
        />
      ))}
    </Road>
  );
}

function TruckLane({ rowIndex, rowData }) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.vehicles.map((vehicle, index) => (
        <Truck
          key={index}
          rowIndex={rowIndex}
          color={vehicle.color}
          initialTileIndex={vehicle.initialTileIndex}
          direction={rowData.direction}
          speed={rowData.speed}
        />
      ))}
    </Road>
  );
}

function Grass({ rowIndex, children }) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh receiveShadow>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0xbaf455} flatShading />
      </mesh>
      <mesh receiveShadow position-x={tilesPerRow * tileSize}>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0x99c846} flatShading />
      </mesh>
      <mesh receiveShadow position-x={-tilesPerRow * tileSize}>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0x99c846} flatShading />
      </mesh>
      <GridLines />
      {children}
    </group>
  );
}

function Road({ rowIndex, children }) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh receiveShadow>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x454a59} flatShading />
      </mesh>
      <mesh receiveShadow position-x={tilesPerRow * tileSize}>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x393d49} flatShading />
      </mesh>
      <mesh receiveShadow position-x={-tilesPerRow * tileSize}>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x393d49} flatShading />
      </mesh>
      <GridLines />
      {children}
    </group>
  );
}

function Tree({ tileIndex, height }) {
  return (
    <group position-x={tileIndex * tileSize}>
      <mesh position-z={height / 2 + 20} castShadow receiveShadow>
        <boxGeometry args={[30, 30, height]} />
        <meshLambertMaterial color={0x7aa21d} flatShading />
      </mesh>
      <mesh position-z={10} castShadow receiveShadow>
        <boxGeometry args={[15, 15, 20]} />
        <meshLambertMaterial color={0x4d2926} flatShading />
      </mesh>
    </group>
  );
}

function Car({ rowIndex, initialTileIndex, direction, speed, color }) {
  const car = useRef(null);
  useVehicleAnimation(car, direction, speed);
  useHitDetection(car, rowIndex);

  return (
    <group
      position-x={initialTileIndex * tileSize}
      rotation-z={direction ? 0 : Math.PI}
      ref={car}
    >
      <mesh position={[0, 0, 12]} castShadow receiveShadow>
        <boxGeometry args={[60, 30, 15]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      <mesh position={[-6, 0, 25.5]} castShadow receiveShadow>
        <boxGeometry args={[33, 24, 12]} />
        <meshLambertMaterial color={0xffffff} flatShading />
      </mesh>
      <Wheel x={-18} />
      <Wheel x={18} />
    </group>
  );
}

function Truck({ rowIndex, initialTileIndex, direction, speed, color }) {
  const truck = useRef(null);
  useVehicleAnimation(truck, direction, speed);
  useHitDetection(truck, rowIndex);

  return (
    <group
      position-x={initialTileIndex * tileSize}
      rotation-z={direction ? 0 : Math.PI}
      ref={truck}
    >
      <mesh position={[-15, 0, 25]} castShadow receiveShadow>
        <boxGeometry args={[70, 35, 35]} />
        <meshLambertMaterial color={0xb4c6fc} flatShading />
      </mesh>
      <mesh position={[35, 0, 20]} castShadow receiveShadow>
        <boxGeometry args={[30, 30, 30]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      <Wheel x={-35} />
      <Wheel x={5} />
      <Wheel x={37} />
    </group>
  );
}

function Wheel({ x }) {
  return (
    <mesh position={[x, 0, 6]}>
      <boxGeometry args={[12, 33, 12]} />
      <meshLambertMaterial color={0x333333} flatShading />
    </mesh>
  );
}

function useVehicleAnimation(ref, direction, speed) {
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

function useEventListeners() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        queueMove("forward");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        queueMove("backward");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        queueMove("left");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        queueMove("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

function usePlayerAnimation(ref) {
  const moveClock = new THREE.Clock(false);

  useFrame(() => {
    if (!ref.current) return;
    if (useGameStore.getState().status === "over") {
      playerState.movesQueue = [];
      return;
    }
    if (!playerState.movesQueue.length) return;
    const player = ref.current;

    if (!moveClock.running) moveClock.start();

    const stepTime = 0.2; // Seconds it takes to take a step
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

    setPosition(player, progress);
    setRotation(player, progress);

    // Once a step has ended
    if (progress >= 1) {
      stepCompleted();
      moveClock.stop();
    }
  });
}

function setPosition(player, progress) {
  const startX = playerState.currentTile * tileSize;
  const startY = playerState.currentRow * tileSize;
  let endX = startX;
  let endY = startY;

  if (playerState.movesQueue[0] === "left") endX -= tileSize;
  if (playerState.movesQueue[0] === "right") endX += tileSize;
  if (playerState.movesQueue[0] === "forward") endY += tileSize;
  if (playerState.movesQueue[0] === "backward") endY -= tileSize;

  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  player.children[0].position.z = Math.sin(progress * Math.PI) * 8;
}

function setRotation(player, progress) {
  let endRotation = 0;
  if (playerState.movesQueue[0] == "forward") endRotation = 0;
  if (playerState.movesQueue[0] == "left") endRotation = Math.PI / 2;
  if (playerState.movesQueue[0] == "right") endRotation = -Math.PI / 2;
  if (playerState.movesQueue[0] == "backward") endRotation = Math.PI;

  player.children[0].rotation.z = THREE.MathUtils.lerp(
    player.children[0].rotation.z,
    endRotation,
    progress
  );
}

function calculateFinalPosition(currentPosition, moves) {
  return moves.reduce((position, direction) => {
    if (direction === "forward")
      return {
        rowIndex: position.rowIndex + 1,
        tileIndex: position.tileIndex
      };
    if (direction === "backward")
      return {
        rowIndex: position.rowIndex - 1,
        tileIndex: position.tileIndex
      };
    if (direction === "left")
      return {
        rowIndex: position.rowIndex,
        tileIndex: position.tileIndex - 1
      };
    if (direction === "right")
      return {
        rowIndex: position.rowIndex,
        tileIndex: position.tileIndex + 1
      };
    return position;
  }, currentPosition);
}

function endsUpInValidPosition(currentPosition, moves) {
  // Calculate where the player would end up after the move
  const finalPosition = calculateFinalPosition(currentPosition, moves);

  // Detect if we hit the edge of the board
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    // Invalid move, ignore move command
    return false;
  }

  // Detect if we hit a tree
  const finalRow = useMapStore.getState().rows[finalPosition.rowIndex - 1];
  if (
    finalRow &&
    finalRow.type === "forest" &&
    finalRow.trees.some((tree) => tree.tileIndex === finalPosition.tileIndex)
  ) {
    // Invalid move, ignore move command
    return false;
  }

  return true;
}

function generateRows(amount) {
  const rows = [];
  for (let i = 0; i < amount; i++) {
    const rowData = generateRow();
    rows.push(rowData);
  }
  return rows;
}

function generateRow() {
  const type = randomElement(["car", "truck", "forest"]);
  if (type === "car") return generateCarLaneMetadata();
  if (type === "truck") return generateTruckLaneMetadata();
  return generateForesMetadata();
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateForesMetadata() {
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

  return { type: "forest", trees };
}

function generateCarLaneMetadata() {
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

  return { type: "car", direction, speed, vehicles };
}

function generateTruckLaneMetadata() {
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

  return { type: "truck", direction, speed, vehicles };
}

function useHitDetection(vehicle, rowIndex) {
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

// Subtle grid lines component
function GridLines() {
  const lines = [];
  // Vertical lines
  for (let i = minTileIndex; i <= maxTileIndex + 1; i++) {
    lines.push(
      <mesh key={`v-${i}`} position-x={i * tileSize - tileSize / 2}>
        <boxGeometry args={[0.5, tileSize, 2]} />
        <meshBasicMaterial color={0xcccccc} transparent opacity={0.07} />
      </mesh>
    );
  }
  // Horizontal line (top and bottom of the tile)
  lines.push(
    <mesh key="h-top" position-y={tileSize / 2}>
      <boxGeometry args={[(tilesPerRow + 2) * tileSize, 0.5, 2]} />
      <meshBasicMaterial color={0xcccccc} transparent opacity={0.04} />
    </mesh>
  );
  lines.push(
    <mesh key="h-bottom" position-y={-tileSize / 2}>
      <boxGeometry args={[(tilesPerRow + 2) * tileSize, 0.5, 2]} />
      <meshBasicMaterial color={0xcccccc} transparent opacity={0.04} />
    </mesh>
  );
  return <group>{lines}</group>;
}

export default Game;
