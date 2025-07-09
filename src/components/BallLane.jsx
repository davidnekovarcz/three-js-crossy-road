import React from 'react';
import Road from './Road';
import Ball from './Ball';

const speciesToColor = {
  boar: 0x2196f3, // blue
  deer: 0xf44336, // red
  bear: 0xff9800, // orange
  fox: 0x9c27b0, // purple
};

export default function BallLane({ rowIndex, rowData }) {
  return (
    <Road rowIndex={rowIndex}>
      {rowData.animals.map((animal, index) => (
        <Ball
          key={index}
          rowIndex={rowIndex}
          ballIndex={animal.index}
          direction={rowData.direction}
          speed={rowData.speed}
          color={speciesToColor[animal.species] || 0x2196f3}
          total={rowData.animals.length}
        />
      ))}
    </Road>
  );
}
