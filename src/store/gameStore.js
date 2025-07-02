import { create } from 'zustand';
import { resetPlayerStore } from '../logic/playerLogic';
import { useMapStore } from './mapStore';

export const useGameStore = create((set) => ({
  status: 'running',
  score: 0,
  cornCount: 0,
  updateScore: (rowIndex) => {
    set((state) => ({ score: Math.max(rowIndex, state.score) }));
  },
  incrementCorn: () => set((state) => ({ cornCount: state.cornCount + 1 })),
  endGame: () => {
    set({ status: 'over' });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set({ status: 'running', score: 0, cornCount: 0 });
  }
})); 
