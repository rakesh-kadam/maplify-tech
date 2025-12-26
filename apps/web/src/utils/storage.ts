import type { Board, BoardMetadata, BoardsListData, Settings } from '../types';

const STORAGE_KEYS = {
  BOARDS_LIST: 'drawboard_boards',
  BOARD_PREFIX: 'drawboard_board_',
  SETTINGS: 'drawboard_settings',
  LAST_BOARD_ID: 'drawboard_last_board_id',
} as const;

// Default settings
const DEFAULT_SETTINGS: Settings = {
  theme: 'auto',
  autoSaveInterval: 5000,
  gridEnabled: true,
};

/**
 * Get all board metadata
 */
export function getBoardsList(): BoardMetadata[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOARDS_LIST);
    if (!data) return [];
    const parsed: BoardsListData = JSON.parse(data);
    return parsed.boards || [];
  } catch (error) {
    console.error('Error loading boards list:', error);
    return [];
  }
}

/**
 * Save board metadata list
 */
export function saveBoardMetadata(boards: BoardMetadata[]): void {
  try {
    const data: BoardsListData = { boards };
    localStorage.setItem(STORAGE_KEYS.BOARDS_LIST, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving boards metadata:', error);
    handleStorageQuotaError(error);
  }
}

/**
 * Get a specific board by ID
 */
export function getBoard(id: string): Board | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEYS.BOARD_PREFIX}${id}`);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading board ${id}:`, error);
    return null;
  }
}

/**
 * Save a board
 */
export function saveBoard(board: Board): void {
  try {
    // Save the board data
    localStorage.setItem(
      `${STORAGE_KEYS.BOARD_PREFIX}${board.id}`,
      JSON.stringify(board)
    );

    // Update metadata
    const boards = getBoardsList();
    const index = boards.findIndex((b) => b.id === board.id);
    const metadata: BoardMetadata = {
      id: board.id,
      name: board.name,
      thumbnail: board.thumbnail,
      createdAt: board.createdAt,
      updatedAt: new Date().toISOString(),
      tags: board.tags || [],
    };

    if (index >= 0) {
      boards[index] = metadata;
    } else {
      boards.push(metadata);
    }

    saveBoardMetadata(boards);
  } catch (error) {
    console.error('Error saving board:', error);
    handleStorageQuotaError(error);
  }
}

/**
 * Delete a board
 */
export function deleteBoard(id: string): void {
  try {
    localStorage.removeItem(`${STORAGE_KEYS.BOARD_PREFIX}${id}`);
    const boards = getBoardsList().filter((b) => b.id !== id);
    saveBoardMetadata(boards);
  } catch (error) {
    console.error('Error deleting board:', error);
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): { used: number; percentUsed: number; usedMB: number } {
  let total = 0;

  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating storage usage:', error);
  }

  // Most browsers have a 5-10MB quota for localStorage
  const quota = 5 * 1024 * 1024; // 5MB
  const usedMB = total / (1024 * 1024);

  return {
    used: total,
    percentUsed: (total / quota) * 100,
    usedMB: parseFloat(usedMB.toFixed(2)),
  };
}

/**
 * Get user settings
 */
export function getSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings
 */
export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/**
 * Get last opened board ID
 */
export function getLastBoardId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_BOARD_ID);
}

/**
 * Save last opened board ID
 */
export function saveLastBoardId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.LAST_BOARD_ID, id);
}

/**
 * Clear all DrawBoard data
 */
export function clearAllData(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('drawboard_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

/**
 * Handle storage quota exceeded error
 */
function handleStorageQuotaError(error: unknown): void {
  if (
    error instanceof Error &&
    (error.name === 'QuotaExceededError' || error.message.includes('quota'))
  ) {
    alert(
      'Storage quota exceeded! Please export your boards and delete some old ones to free up space.'
    );
  }
}

/**
 * Export all boards as JSON
 */
export function exportAllBoards(): Board[] {
  const boards = getBoardsList();
  return boards
    .map((metadata) => getBoard(metadata.id))
    .filter((board): board is Board => board !== null);
}
