// Tile configuration
export const minTileIndex = -8;
export const maxTileIndex = 8;
export const tilesPerRow = maxTileIndex - minTileIndex + 1;
export const tileSize = 42;

// Performance configuration
export const TARGET_FPS = 25;
export const FRAME_INTERVAL = 1000 / TARGET_FPS;

// Map configuration
export const INITIAL_ROWS = 20;
export const MAX_ROWS = 40;
export const NEW_ROWS_BATCH = 20;

// Game state defaults
export const DEFAULT_GAME_STATE = {
  status: 'running',
  score: 0,
  cornCount: 0,
  checkpointRow: 0,
  checkpointTile: 0,
  isPaused: false
};

// Camera configuration
export const CAMERA_CONFIG = {
  up: [0, 0, 1],
  position: [300, -300, 300]
};

// UI configuration
export const UI_CONFIG = {
  MAX_CORN_DISPLAY: 20,
  CORN_SCORE_STYLE: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: '2em',
    color: 'gold',
    zIndex: 10,
    whiteSpace: 'nowrap'
  }
};

// Player configuration
export const PLAYER_CONFIG = {
  RESPAWN_DURATION: 1200,
  ROWS_AHEAD_THRESHOLD: 10 // When to generate new rows
};

export const visibleTilesDistance = 10;
