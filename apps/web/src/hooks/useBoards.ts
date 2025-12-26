import { create } from 'zustand';
import { api } from '../lib/api';
import type { BoardMetadata } from '@maplify-tech/shared';
import type { Board, ExcalidrawElement } from '../types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { generateThumbnail } from '../utils/thumbnail';

// Helper function to transform API board data to frontend Board format
function transformBoardData(board: any): Board {
  return {
    ...board,
    elements: Array.isArray(board.data?.elements) ? board.data.elements : [],
    appState: board.data?.appState || {},
    files: board.data?.files || {},
  } as Board;
}

interface BoardsState {
  boards: BoardMetadata[];
  currentBoardId: string | null;
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  lastSavedAt: Date | null;

  // Actions
  loadBoards: () => Promise<void>;
  createBoard: (name: string) => Promise<void>;
  selectBoard: (id: string) => Promise<void>;
  updateCurrentBoard: (
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
    files?: BinaryFiles
  ) => Promise<void>;
  renameBoard: (id: string, name: string) => Promise<void>;
  duplicateBoard: (id: string) => Promise<void>;
  removeBoard: (id: string) => Promise<void>;
  importBoard: (board: Board) => Promise<void>;
  importBoards: (boards: Board[]) => Promise<void>;
  clearError: () => void;
}

export const useBoardsStore = create<BoardsState>((set, get) => ({
  boards: [],
  currentBoardId: null,
  currentBoard: null,
  isLoading: true,
  error: null,
  lastSavedAt: null,

  loadBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const { boards } = await api.getBoards();
      set({ boards, isLoading: false });

      // Load last board or create new one
      if (boards.length > 0) {
        const lastBoardId = localStorage.getItem('last_board_id');
        const boardId = lastBoardId && boards.find((b) => b.id === lastBoardId)
          ? lastBoardId
          : boards[0].id;
        await get().selectBoard(boardId);
      } else {
        await get().createBoard('Untitled Board');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load boards',
        isLoading: false,
      });
    }
  },

  createBoard: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const { board } = await api.createBoard({
        name,
        data: {
          elements: [],
          appState: {
            viewBackgroundColor: '#ffffff',
            currentItemFontFamily: 1,
          },
        },
      });

      // Transform the board data structure for compatibility
      const transformedBoard = transformBoardData(board);

      const { boards } = await api.getBoards();
      set({
        boards,
        currentBoardId: board.id,
        currentBoard: transformedBoard,
        isLoading: false,
      });
      localStorage.setItem('last_board_id', board.id);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create board',
        isLoading: false,
      });
    }
  },

  selectBoard: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { board } = await api.getBoard(id);
      // Transform the board data structure for compatibility
      const transformedBoard = transformBoardData(board);
      set({ currentBoardId: id, currentBoard: transformedBoard, isLoading: false });
      localStorage.setItem('last_board_id', id);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load board',
        isLoading: false,
      });
    }
  },

  updateCurrentBoard: async (elements, appState, files) => {
    const { currentBoard } = get();
    if (!currentBoard) return;

    try {
      // Generate thumbnail asynchronously
      const thumbnail = await generateThumbnail(elements, appState, files);

      const { board } = await api.updateBoard(currentBoard.id, {
        data: {
          elements: elements as any[],
          appState,
          files,
        },
        thumbnail,
      });

      // Transform the board data structure for compatibility
      const transformedBoard = transformBoardData(board);

      set({ currentBoard: transformedBoard, lastSavedAt: new Date() });

      // Update metadata in list
      const { boards } = await api.getBoards();
      set({ boards });
    } catch (error) {
      console.error('Failed to save board:', error);
      // Don't set error state to avoid disrupting user
    }
  },

  renameBoard: async (id: string, name: string) => {
    try {
      await api.updateBoard(id, { name });
      const { boards } = await api.getBoards();
      set({ boards });

      if (get().currentBoardId === id) {
        const { board } = await api.getBoard(id);
        const transformedBoard = transformBoardData(board);
        set({ currentBoard: transformedBoard });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to rename board' });
    }
  },

  duplicateBoard: async (id: string) => {
    try {
      await api.duplicateBoard(id);
      const { boards } = await api.getBoards();
      set({ boards });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to duplicate board' });
    }
  },

  removeBoard: async (id: string) => {
    try {
      await api.deleteBoard(id);
      const { boards } = await api.getBoards();
      set({ boards });

      if (get().currentBoardId === id) {
        if (boards.length > 0) {
          await get().selectBoard(boards[0].id);
        } else {
          await get().createBoard('Untitled Board');
        }
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete board' });
    }
  },

  importBoard: async (board: Board) => {
    try {
      const { board: createdBoard } = await api.createBoard({
        name: board.name,
        data: {
          elements: Array.from(board.elements || []),
          appState: board.appState || {},
          files: board.files,
        },
        thumbnail: board.thumbnail,
        tags: board.tags,
      });

      const transformedBoard = transformBoardData(createdBoard);

      const { boards } = await api.getBoards();
      set({ boards, currentBoardId: createdBoard.id, currentBoard: transformedBoard });
      localStorage.setItem('last_board_id', createdBoard.id);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to import board' });
    }
  },

  importBoards: async (boardsToImport: Board[]) => {
    try {
      for (const board of boardsToImport) {
        await api.createBoard({
          name: board.name,
          data: {
            elements: Array.from(board.elements || []),
            appState: board.appState || {},
            files: board.files,
          },
          thumbnail: board.thumbnail,
          tags: board.tags,
        });
      }

      const { boards } = await api.getBoards();
      set({ boards });

      // Select the first imported board
      if (boards.length > 0) {
        await get().selectBoard(boards[0].id);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to import boards' });
    }
  },

  clearError: () => set({ error: null }),
}));
