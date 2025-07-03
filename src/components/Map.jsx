import React, { useRef, useState } from 'react';
import { useMapStore } from '@/store/mapStore';
import { useVehicleAnimation } from '@/animation/useVehicleAnimation';
import { useHitDetection } from '@/logic/collisionEffects';
import { tilesPerRow, tileSize, minTileIndex, maxTileIndex } from '@/utils/constants';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/gameStore';

export default function Map() {
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

export function Row({ rowIndex, rowData }) {
  switch (rowData.type) {
    case 'forest':
      return <Forest rowIndex={rowIndex} rowData={rowData} />;
    case 'log':
      return <LogLane rowIndex={rowIndex} rowData={rowData} />;
    case 'animal':
      return <AnimalLane rowIndex={rowIndex} rowData={rowData} />;
    case 'grass':
      return <Grass rowIndex={rowIndex} />;
    default:
      return null;
  }
}

export function Forest({ rowIndex, rowData }) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.trees.map((tree, index) => (
        <Tree key={index} tileIndex={tree.tileIndex} height={tree.height} />
      ))}
      {rowData.corn && rowData.corn.map((tileIndex, idx) => (
        <Corn key={"corn-"+tileIndex} tileIndex={tileIndex} />
      ))}
      {rowData.collectedCorn && rowData.collectedCorn.map((c, idx) => (
        <Corn key={"collected-"+c.tileIndex+"-"+c.start} tileIndex={c.tileIndex} collected start={c.start} rowIndex={rowIndex} />
      ))}
    </Grass>
  );
}

export function LogLane({ rowIndex, rowData }) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.logs.map((log, index) => (
        <Log
          key={index}
          rowIndex={rowIndex}
          logIndex={log.index}
          direction={rowData.direction}
          speed={rowData.speed}
          total={rowData.logs.length}
        />
      ))}
    </Road>
  );
}

export function AnimalLane({ rowIndex, rowData }) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.animals.map((animal, index) => (
        <Animal
          key={index}
          rowIndex={rowIndex}
          animalIndex={animal.index}
          direction={rowData.direction}
          speed={rowData.speed}
          species={animal.species}
          total={rowData.animals.length}
        />
      ))}
    </Road>
  );
}

export function Grass({ rowIndex, children }) {
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
      {children}
      <group position-z={2}>
        <GridLines variant="grass" />
      </group>
    </group>
  );
}

export function Road({ rowIndex, children }) {
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
      {children}
      <group position-z={2}>
        <GridLines variant="road" />
      </group>
    </group>
  );
}

export function Tree({ tileIndex, height }) {
  // Foliage parameters
  const foliageHeights = [height / 2 + 32, height / 2 + 48];
  const foliageOffsets = [0, 6];
  return (
    <group position-x={tileIndex * tileSize}>
      {/* Trunk */}
      <mesh position-z={height / 2} castShadow receiveShadow rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[4, 4, height, 8]} />
        <meshLambertMaterial color={0x8d5524} flatShading />
      </mesh>
      {/* Foliage: two or three stacked/offset spheres */}
      <mesh position-z={height + 14} castShadow receiveShadow>
        <sphereGeometry args={[18, 16, 16]} />
        <meshLambertMaterial color={0x6cbf2c} flatShading />
      </mesh>
      <mesh position={[foliageOffsets[0], 0, height + 28]} castShadow receiveShadow>
        <sphereGeometry args={[13, 16, 16]} />
        <meshLambertMaterial color={0x5ea726} flatShading />
      </mesh>
      <mesh position={[-foliageOffsets[1], 0, height + 20]} castShadow receiveShadow>
        <sphereGeometry args={[10, 16, 16]} />
        <meshLambertMaterial color={0x4e8c1a} flatShading />
      </mesh>
    </group>
  );
}

export function Log({ rowIndex, logIndex, direction, speed, total }) {
  const logRef = useRef(null);
  const rotationRef = useRef(0);
  const wrapLength = (maxTileIndex - minTileIndex + 4) * tileSize; // +4 for 2-tile buffer each side
  const beginningOfRow = (minTileIndex - 2) * tileSize;
  const endOfRow = (maxTileIndex + 2) * tileSize;
  // Evenly space logs along the wrap path
  const offset = (logIndex / total) * wrapLength;
  useVehicleAnimation(logRef, direction, speed, offset, wrapLength, beginningOfRow, endOfRow);
  useHitDetection(logRef, rowIndex);
  const logRadius = tileSize * 0.32;
  const logLength = tileSize * 0.92;
  const logZ = logRadius;
  useFrame((_, delta) => {
    if (!logRef.current) return;
    const rotSpeed = (speed / (tileSize * Math.PI)) * delta;
    rotationRef.current += direction ? rotSpeed : -rotSpeed;
    logRef.current.rotation.y = rotationRef.current;
  });
  return (
    <group ref={logRef} position={[0, 0, logZ]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[logRadius, logRadius, logLength, 16]} />
        <meshLambertMaterial color={0x9c6615} flatShading />
      </mesh>
    </group>
  );
}

export function Animal({ rowIndex, animalIndex, direction, speed, species, total }) {
  const animalRef = useRef(null);
  const rotationRef = useRef(0);
  const wrapLength = (maxTileIndex - minTileIndex + 4) * tileSize;
  const beginningOfRow = (minTileIndex - 2) * tileSize;
  const endOfRow = (maxTileIndex + 2) * tileSize;
  const offset = (animalIndex / total) * wrapLength;
  useVehicleAnimation(animalRef, direction, speed, offset, wrapLength, beginningOfRow, endOfRow);
  useHitDetection(animalRef, rowIndex);
  let color = 0x2196f3; // boar: blue
  let size = tileSize * 0.36;
  let animalZ = size;
  if (species === 'deer') { color = 0xf44336; size = tileSize * 0.44; animalZ = size; }
  if (species === 'bear') { color = 0xff9800; size = tileSize * 0.48; animalZ = size; }
  if (species === 'fox') { color = 0x9c27b0; size = tileSize * 0.36; animalZ = size; }
  useFrame((_, delta) => {
    if (!animalRef.current) return;
    const rotSpeed = (speed / (tileSize * Math.PI)) * delta;
    rotationRef.current += direction ? rotSpeed : -rotSpeed;
    animalRef.current.rotation.y = rotationRef.current;
  });
  return (
    <group ref={animalRef} position={[0, 0, animalZ]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[size, 16, 16]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}

export function Corn({ tileIndex, collected = false, start, rowIndex }) {
  const ref = useRef();
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  useFrame(() => {
    if (!collected || !ref.current || doneRef.current) return;
    const duration = 0.6;
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed >= duration) {
      if (!doneRef.current) {
        doneRef.current = true;
        setDone(prev => {
          if (!prev) return true;
          return prev;
        });
      }
      return;
    }
    const scale = 1 + 2 * Math.sin((elapsed / duration) * Math.PI);
    ref.current.scale.set(scale, scale, scale);
    ref.current.position.z = 30 + 10 * Math.sin((elapsed / duration) * Math.PI);
  });
  if (done) return null;
  return (
    <group ref={ref} position={[tileIndex * tileSize, 0, 6]}>
      {/* Corn cob (yellow) */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[2, 4, 8, 16]} />
        <meshLambertMaterial color={0xffe066} flatShading />
      </mesh>
      {/* Husk (green leaves) */}
      <mesh position={[0, -1.5, -2]} rotation-z={0.3}>
        <cylinderGeometry args={[0.3, 0.7, 3, 8]} />
        <meshLambertMaterial color={0x4caf50} flatShading />
      </mesh>
      <mesh position={[0.7, 0, -2]} rotation-z={-0.7}>
        <cylinderGeometry args={[0.2, 0.5, 2.5, 8]} />
        <meshLambertMaterial color={0x4caf50} flatShading />
      </mesh>
      <mesh position={[-0.7, 0, -2]} rotation-z={0.7}>
        <cylinderGeometry args={[0.2, 0.5, 2.5, 8]} />
        <meshLambertMaterial color={0x4caf50} flatShading />
      </mesh>
    </group>
  );
}

export function GridLines({ variant = "grass" }) {
  const opacity = variant === "road" ? 0.06 : 0.18;
  const lines = [];
  for (let i = minTileIndex; i <= maxTileIndex + 1; i++) {
    lines.push(
      <mesh key={`v-${i}`} position-x={i * tileSize - tileSize / 2}>
        <boxGeometry args={[0.5, tileSize, 2]} />
        <meshBasicMaterial color={0xcccccc} transparent opacity={opacity} />
      </mesh>
    );
  }
  lines.push(
    <mesh key="h-top" position-y={tileSize / 2}>
      <boxGeometry args={[(tilesPerRow + 2) * tileSize, 0.5, 2]} />
      <meshBasicMaterial color={0xcccccc} transparent opacity={opacity * 0.6} />
    </mesh>
  );
  lines.push(
    <mesh key="h-bottom" position-y={-tileSize / 2}>
      <boxGeometry args={[(tilesPerRow + 2) * tileSize, 0.5, 2]} />
      <meshBasicMaterial color={0xcccccc} transparent opacity={opacity * 0.6} />
    </mesh>
  );
  return <group>{lines}</group>;
} 
