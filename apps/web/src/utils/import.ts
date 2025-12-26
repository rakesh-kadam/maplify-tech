import type { Board, ExportData } from '../types';
import { generateId } from './helpers';

/**
 * Validate board file format
 */
export function validateBoardFile(data: any): boolean {
  return !!(
    data &&
    data.version &&
    data.board &&
    Array.isArray(data.board.elements) &&
    data.board.appState &&
    data.metadata
  );
}

/**
 * Validate multi-board export file
 */
export function validateMultiBoardFile(data: any): boolean {
  return !!(
    data &&
    data.version &&
    Array.isArray(data.boards) &&
    data.boards.length > 0 &&
    data.metadata
  );
}

/**
 * Parse a board file and return a Board object
 */
export function parseBoardFile(fileContent: string): Board | null {
  try {
    const data: ExportData = JSON.parse(fileContent);

    if (!validateBoardFile(data)) {
      throw new Error('Invalid board file format');
    }

    return {
      id: generateId(), // Generate new ID on import
      name: data.board.name,
      elements: data.board.elements,
      appState: data.board.appState,
      files: data.board.files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.metadata.tags,
    };
  } catch (error) {
    console.error('Failed to parse board file:', error);
    return null;
  }
}

/**
 * Parse a multi-board export file
 */
export function parseMultiBoardFile(fileContent: string): Board[] | null {
  try {
    const data = JSON.parse(fileContent);

    if (!validateMultiBoardFile(data)) {
      throw new Error('Invalid multi-board file format');
    }

    return data.boards.map((boardData: any) => ({
      id: generateId(), // Generate new ID on import
      name: boardData.name,
      elements: boardData.elements,
      appState: boardData.appState,
      files: boardData.files,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: boardData.tags,
    }));
  } catch (error) {
    console.error('Failed to parse multi-board file:', error);
    return null;
  }
}

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

/**
 * Import board from file
 */
export async function importBoardFromFile(file: File): Promise<Board | Board[] | null> {
  try {
    const content = await readFileAsText(file);

    // Try parsing as single board first
    const singleBoard = parseBoardFile(content);
    if (singleBoard) {
      return singleBoard;
    }

    // Try parsing as multi-board export
    const multiBoards = parseMultiBoardFile(content);
    if (multiBoards) {
      return multiBoards;
    }

    throw new Error('Invalid file format');
  } catch (error) {
    console.error('Error importing board:', error);
    return null;
  }
}
