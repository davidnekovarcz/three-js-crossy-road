import { create } from 'zustand';
import { generateRows } from '@/logic/mapLogic';
import { INITIAL_ROWS, NEW_ROWS_BATCH } from '@/utils/constants';

export const useMapStore = create(set => ({
  rows: generateRows(INITIAL_ROWS),
  addRows: () => {
    const newRows = generateRows(NEW_ROWS_BATCH);
    set(state => ({
      rows: [...state.rows, ...newRows],
    }));
  },
  reset: () => set({ rows: generateRows(INITIAL_ROWS) }),
}));

// NOTE: Do not mutate rows or row objects directly. Always use setState and create new arrays/objects for updates.
