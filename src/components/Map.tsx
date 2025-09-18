import React from 'react';
import { useMapStore } from '@/store/mapStore';
import BallLane from './BallLane';
import Corn from './Corn';
import Grass from './Grass';
import LogLane from './LogLane';
import Tree from './Tree';
import { playerState } from '@/logic/playerLogic';
import { visibleTilesDistance } from '@/utils/constants';
import { RowProps, ForestProps, RowData, ForestRow } from '@/types';

export default function Map() {
  const rows = useMapStore(state => state.rows);
  // Only render rows within [-visibleTilesDistance, +visibleTilesDistance] of the player's current row
  const minVisible = Math.max(0, playerState.currentRow - visibleTilesDistance);
  const maxVisible = Math.min(
    rows.length - 1,
    playerState.currentRow + visibleTilesDistance
  );
  const visibleRows = rows
    .slice(minVisible, maxVisible + 1)
    .map((rowData, idx) => ({ rowData, index: minVisible + idx }));
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
      {visibleRows.map(({ rowData, index }) => (
        <Row key={index} rowIndex={index + 1} rowData={rowData} />
      ))}
    </>
  );
}

export function Row({ rowIndex, rowData }: RowProps) {
  switch (rowData.type) {
    case 'forest':
      return <Forest rowIndex={rowIndex} rowData={rowData} />;
    case 'log':
      return <LogLane rowIndex={rowIndex} rowData={rowData} />;
    case 'animal':
      return <BallLane rowIndex={rowIndex} rowData={rowData} />;
    case 'grass':
      return <Grass rowIndex={rowIndex} />;
    default:
      return null;
  }
}

export function Forest({ rowIndex, rowData }: ForestProps) {
  return (
    <Grass rowIndex={rowIndex}>
      {rowData.trees.map((tree, index) => (
        <Tree key={index} tileIndex={tree.tileIndex} height={tree.height} />
      ))}
      {rowData.corn &&
        rowData.corn.map(tileIndex => (
          <Corn key={'corn-' + tileIndex} tileIndex={tileIndex} />
        ))}
      {rowData.collectedCorn &&
        rowData.collectedCorn.map(c => (
          <Corn
            key={'collected-' + c.tileIndex + '-' + c.start}
            tileIndex={c.tileIndex}
            collected
            start={c.start}
            rowIndex={rowIndex}
          />
        ))}
    </Grass>
  );
}
