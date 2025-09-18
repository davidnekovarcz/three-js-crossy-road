import { create } from 'zustand';
import { resetPlayerStore } from '@/logic/playerLogic';
import { useMapStore } from '@/store/mapStore';
import { DEFAULT_GAME_STATE } from '@/utils/constants';

export const useGameStore = create(set => ({
  ...DEFAULT_GAME_STATE,
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  updateScore: rowIndex => {
    set(state => ({ score: Math.max(rowIndex, state.score) }));
  },
  incrementCorn: () => set(state => ({ cornCount: state.cornCount + 1 })),
  setCheckpoint: (row, tile) =>
    set(() => ({ checkpointRow: row, checkpointTile: tile })),
  endGame: () => {
    set({ status: 'over' });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set(DEFAULT_GAME_STATE);
  },
}));
