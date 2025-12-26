// Shared types between frontend and backend

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  data: BoardData;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  elements: ExcalidrawElement[];
  appState: Record<string, any>;
  files?: Record<string, any>;
}

export interface BoardMetadata {
  id: string;
  name: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Using any for Excalidraw elements to avoid type export issues
export type ExcalidrawElement = any;

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface CreateBoardRequest {
  name: string;
  data: BoardData;
  thumbnail?: string;
  tags?: string[];
}

export interface UpdateBoardRequest {
  name?: string;
  data?: BoardData;
  thumbnail?: string;
  tags?: string[];
}

export interface ApiError {
  error: string;
  details?: any;
}
