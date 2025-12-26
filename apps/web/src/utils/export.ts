import { exportToBlob, exportToSvg } from '@excalidraw/excalidraw';
import { saveAs } from 'file-saver';
import type { Board, ExportData, ExcalidrawElement } from '../types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

/**
 * Export board as PNG image
 */
export async function exportBoardAsPNG(
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles | null,
  fileName: string
): Promise<void> {
  try {
    const blob = await exportToBlob({
      elements,
      appState: { ...appState, exportBackground: true },
      files: (files || undefined) as any,
    });
    saveAs(blob, `${fileName}.png`);
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw new Error('Failed to export PNG');
  }
}

/**
 * Export board as SVG image
 */
export async function exportBoardAsSVG(
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles | null,
  fileName: string
): Promise<void> {
  try {
    const svg = await exportToSvg({
      elements,
      appState: { ...appState, exportBackground: true },
      files: (files || undefined) as any,
    });
    const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    saveAs(svgBlob, `${fileName}.svg`);
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw new Error('Failed to export SVG');
  }
}

/**
 * Export board as JSON file
 */
export function exportBoardAsJSON(board: Board): void {
  try {
    const exportData: ExportData = {
      version: '1.0',
      board: {
        id: board.id,
        name: board.name,
        elements: board.elements,
        appState: board.appState,
        files: board.files,
      },
      metadata: {
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        creator: 'Maplify Tech v1.0',
        tags: board.tags,
      },
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${board.name}.json`);
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw new Error('Failed to export JSON');
  }
}

/**
 * Export all boards as a single JSON file
 */
export function exportAllBoardsAsJSON(boards: Board[]): void {
  try {
    const exportData = {
      version: '1.0',
      boards: boards.map((board) => ({
        id: board.id,
        name: board.name,
        elements: board.elements,
        appState: board.appState,
        files: board.files,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        tags: board.tags,
      })),
      metadata: {
        exportedAt: new Date().toISOString(),
        creator: 'Maplify Tech v1.0',
        totalBoards: boards.length,
      },
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `maplify-backup-${new Date().toISOString().split('T')[0]}.json`);
  } catch (error) {
    console.error('Error exporting all boards:', error);
    throw new Error('Failed to export all boards');
  }
}
