import { create } from 'zustand';
import { resetPlayerStore } from '@/logic/playerLogic';
import { useMapStore } from '@/store/mapStore';
import { DEFAULT_GAME_STATE } from '@/utils/constants';
import { GameStore } from '@/types';

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_GAME_STATE,
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  updateScore: (rowIndex: number) => {
    set(state => ({ score: Math.max(rowIndex, state.score) }));
  },
  incrementCorn: () => set(state => ({ cornCount: state.cornCount + 1 })),
  setCheckpoint: (row: number, tile: number) =>
    set(() => ({ checkpointRow: row, checkpointTile: tile })),
  setStatus: (status: 'running' | 'over' | 'paused') => set({ status }),
  setPaused: (paused: boolean) => set({ isPaused: paused }),
  endGame: () => {
    set({ status: 'over' });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set(DEFAULT_GAME_STATE);
  },
}));
