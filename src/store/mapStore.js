import { create } from 'zustand';
import { generateRows } from '@/logic/mapLogic';

export const useMapStore = create((set) => ({
  rows: generateRows(20),
  addRows: () => {
    const newRows = generateRows(20);
    set((state) => {
      // Only keep the last 40 rows for performance
      const rows = [...state.rows, ...newRows].slice(-40);
      return { rows };
    });
  },
  reset: () => set({ rows: generateRows(20) })
}));
// NOTE: Do not mutate rows or row objects directly. Always use setState and create new arrays/objects for updates. 
