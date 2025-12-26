import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import type {
  BoardMetadata as SharedBoardMetadata,
  User,
  AuthResponse,
} from '@maplify-tech/shared';

// Re-export shared types
export type { User, AuthResponse };
export type BoardMetadata = SharedBoardMetadata;

// Use any to avoid type export issues with Excalidraw
export type ExcalidrawElement = any;

// Extended Board interface for frontend (includes flattened elements/appState/files)
// This is what components expect after transformation from API
export interface Board {
  id: string;
  name: string;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files?: BinaryFiles;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  tags?: string[];
}

export interface BoardsListData {
  boards: BoardMetadata[];
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  autoSaveInterval: number;
  gridEnabled: boolean;
}

export interface ExportData {
  version: string;
  board: {
    id: string;
    name: string;
    elements: readonly ExcalidrawElement[];
    appState: Partial<AppState>;
    files?: BinaryFiles;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    creator: string;
    tags?: string[];
  };
}

export type ExportFormat = 'png' | 'svg' | 'json' | 'pdf';
