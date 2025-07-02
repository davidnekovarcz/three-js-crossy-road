import { create } from 'zustand';
import { resetPlayerStore } from '@/logic/playerLogic';
import { useMapStore } from '@/store/mapStore';

export const useGameStore = create((set) => ({
  status: 'running',
  score: 0,
  cornCount: 0,
  checkpointRow: 0,
  checkpointTile: 0,
  isPaused: false,
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  updateScore: (rowIndex) => {
    set((state) => ({ score: Math.max(rowIndex, state.score) }));
  },
  incrementCorn: () => set((state) => ({ cornCount: state.cornCount + 1 })),
  setCheckpoint: (row, tile) => set(() => ({ checkpointRow: row, checkpointTile: tile })),
  endGame: () => {
    set({ status: 'over' });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set({ status: 'running', score: 0, cornCount: 0, checkpointRow: 0, checkpointTile: 0 });
  }
})); 
