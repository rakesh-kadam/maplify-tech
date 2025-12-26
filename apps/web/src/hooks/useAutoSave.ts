import { useEffect, useRef, useCallback } from 'react';
import type { ExcalidrawElement } from '../types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { debounce } from '../utils/helpers';

interface UseAutoSaveOptions {
  onSave: (
    elements: readonly ExcalidrawElement[],
    appState: Partial<AppState>,
    files?: BinaryFiles
  ) => void;
  interval?: number;
}

/**
 * Custom hook for auto-saving board changes
 */
export function useAutoSave({ onSave, interval = 5000 }: UseAutoSaveOptions) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(
      (
        elements: readonly ExcalidrawElement[],
        appState: Partial<AppState>,
        files?: BinaryFiles
      ) => {
        onSave(elements, appState, files);
      },
      interval
    ),
    [onSave, interval]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
}
