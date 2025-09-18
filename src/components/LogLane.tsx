import React from 'react';
import Road from './Road';
import Log from './Log';

export default function LogLane({ rowIndex, rowData }) {
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
