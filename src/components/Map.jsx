import React, { useRef, useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { useVehicleAnimation } from '../logic/vehicleAnimation';
import { useHitDetection } from '../logic/collision';
import { tilesPerRow, tileSize, minTileIndex, maxTileIndex } from '../utils/constants';
import { useFrame } from '@react-three/fiber';

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
    case 'car':
      return <CarLane rowIndex={rowIndex} rowData={rowData} />;
    case 'truck':
      return <TruckLane rowIndex={rowIndex} rowData={rowData} />;
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

export function CarLane({ rowIndex, rowData }) {
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

export function TruckLane({ rowIndex, rowData }) {
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
      <GridLines />
      {children}
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
      <GridLines />
      {children}
    </group>
  );
}

export function Tree({ tileIndex, height }) {
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

export function Car({ rowIndex, initialTileIndex, direction, speed, color }) {
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

export function Truck({ rowIndex, initialTileIndex, direction, speed, color }) {
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

export function Wheel({ x }) {
  return (
    <mesh position={[x, 0, 6]}>
      <boxGeometry args={[12, 33, 12]} />
      <meshLambertMaterial color={0x333333} flatShading />
    </mesh>
  );
}

export function Corn({ tileIndex, collected = false, start, rowIndex }) {
  const ref = useRef();
  const [done, setDone] = useState(false);
  // Animation: pulsate and grow if collected
  useFrame(() => {
    if (!collected || !ref.current) return;
    const duration = 0.6;
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed >= duration) {
      setDone(true);
      return;
    }
    // Pulsate and grow
    const scale = 1 + 2 * Math.sin((elapsed / duration) * Math.PI);
    ref.current.scale.set(scale, scale, scale);
    // Keep it above the chicken
    ref.current.position.z = 30 + 10 * Math.sin((elapsed / duration) * Math.PI);
  });
  if (done) return null;
  return (
    <group ref={ref} position={[tileIndex * tileSize, 0, 16]}>
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

export function GridLines() {
  const lines = [];
  for (let i = minTileIndex; i <= maxTileIndex + 1; i++) {
    lines.push(
      <mesh key={`v-${i}`} position-x={i * tileSize - tileSize / 2}>
        <boxGeometry args={[0.5, tileSize, 2]} />
        <meshBasicMaterial color={0xcccccc} transparent opacity={0.07} />
      </mesh>
    );
  }
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
