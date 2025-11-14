import { create } from 'zustand';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from './config/firebase';

// Types
interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
}

interface LeaderboardStore {
  loading: boolean;
  error: string | null;
  addEntry: (entry: LeaderboardEntry) => Promise<void>;
}

// Firebase save function
async function saveLeaderboardScore(entry: LeaderboardEntry): Promise<void> {
  const col = collection(firestore, 'leaderboards', 'crossy-road', 'scores');

  const dataToSave = {
    id: entry.id,
    name: entry.name,
    score: entry.score,
    createdAt: Timestamp.now(),
  };

  try {
    await addDoc(col, dataToSave);
    console.log('✅ Score saved to Firestore');
  } catch (error) {
    console.error('❌ Error saving to Firestore:', error);
    throw error;
  }
}

// Zustand store
export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  loading: false,
  error: null,

  addEntry: async (entry: LeaderboardEntry) => {
    set({ loading: true, error: null });
    try {
      await saveLeaderboardScore(entry);
      set({ loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save score';
      set({ error: errorMessage, loading: false });
    }
  },
}));