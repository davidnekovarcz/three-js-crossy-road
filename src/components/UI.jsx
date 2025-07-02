import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { queueMove } from '@/logic/playerLogic';

export function Score() {
  const score = useGameStore((state) => state.score);
  return <div id="score">{score}</div>;
}

export function Controls() {
  useEventListeners();
  return (
    <div id="controls">
      <div>
        <button onClick={() => queueMove('forward')}>▲</button>
        <button onClick={() => queueMove('left')}>◀</button>
        <button onClick={() => queueMove('backward')}>▼</button>
        <button onClick={() => queueMove('right')}>▶</button>
      </div>
    </div>
  );
}

export function Result() {
  const status = useGameStore((state) => state.status);
  const score = useGameStore((state) => state.score);
  const reset = useGameStore((state) => state.reset);
  if (status === 'running') return null;
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

export function CornScore() {
  const cornCount = useGameStore((state) => state.cornCount);
  // Show up to 20 corns, then show + if more
  const maxCorns = 20;
  let corns = '';
  if (cornCount <= maxCorns) {
    corns = '🌽'.repeat(cornCount);
  } else {
    corns = '🌽'.repeat(maxCorns) + ` +${cornCount - maxCorns}`;
  }
  return <div id="corn-score" style={{position: 'absolute', top: 20, right: 20, fontSize: '2em', color: 'gold', zIndex: 10, whiteSpace: 'nowrap'}}>{corns}</div>;
}

export function useEventListeners() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        queueMove('forward');
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        queueMove('backward');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        queueMove('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        queueMove('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
} 
