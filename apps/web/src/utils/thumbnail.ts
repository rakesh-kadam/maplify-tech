import { exportToBlob } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '../types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';

/**
 * Generate a thumbnail preview for a board
 * Returns a base64 encoded image string
 */
export async function generateThumbnail(
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files?: BinaryFiles
): Promise<string | undefined> {
  try {
    // Don't generate thumbnail for empty boards
    if (!elements || elements.length === 0) {
      return undefined;
    }

    const blob = await exportToBlob({
      elements,
      appState: {
        ...appState,
        exportBackground: true,
        exportWithDarkMode: false,
      },
      files: files as any,
      maxWidthOrHeight: 200, // Small thumbnail size
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return undefined;
  }
}

/**
 * Generate thumbnail with debouncing to avoid excessive generation
 */
export function debouncedGenerateThumbnail(
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files?: BinaryFiles,
  delay: number = 2000
): Promise<string | undefined> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const thumbnail = await generateThumbnail(elements, appState, files);
      resolve(thumbnail);
    }, delay);
  });
}
