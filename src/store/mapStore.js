import { create } from 'zustand';
import { generateRows } from '../logic/mapLogic';

export const useMapStore = create((set) => ({
  rows: generateRows(20),
  addRows: () => {
    const newRows = generateRows(20);
    set((state) => ({ rows: [...state.rows, ...newRows] }));
  },
  reset: () => set({ rows: generateRows(20) })
})); 
