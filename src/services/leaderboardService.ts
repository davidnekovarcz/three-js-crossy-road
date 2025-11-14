import { LeaderboardEntry } from '@/types';
import { saveLeaderboardScore } from '@/utils/leaderboard';

/**
 * Save a game result to Firestore
 * Path: leaderboards/crossy-road/scores/[docId]
 */
export async function saveScore(
  entry: Omit<LeaderboardEntry, 'timestamp'>
): Promise<void> {
  console.log('🎮 saveScore called with entry:', entry);
  try {
    console.log('📤 Calling saveLeaderboardScore...');
    await saveLeaderboardScore({
      id: entry.id,
      name: entry.name,
      score: entry.score,
    });
    console.log('✅ Score saved successfully:', entry);
  } catch (error) {
    console.error('❌ Error saving score to Firestore:', error);
    throw error;
  }
}
