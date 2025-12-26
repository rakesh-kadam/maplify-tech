import { Excalidraw } from '@excalidraw/excalidraw';
import { useBoardsStore } from '../hooks/useBoards';
import { useAutoSave } from '../hooks/useAutoSave';
import { useThemeStore } from '../hooks/useTheme';

export function WhiteboardCanvas() {
  const { currentBoard, updateCurrentBoard } = useBoardsStore();
  const effectiveTheme = useThemeStore((state) => state.effectiveTheme);

  // Auto-save with debouncing
  const handleSave = useAutoSave({
    onSave: (elements, appState, files) => {
      updateCurrentBoard(elements, appState, files);
    },
    interval: 5000,
  });

  const handleChange = (elements: any, appState: any, files: any) => {
    handleSave(elements, appState, files);
  };

  if (!currentBoard) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading board...</div>
      </div>
    );
  }

  // Ensure elements is always an array for Excalidraw
  const elements = Array.isArray(currentBoard.elements) ? currentBoard.elements : [];

  // Clean appState - only pass safe properties that won't cause issues
  const rawAppState = currentBoard.appState || {};
  const appState = {
    viewBackgroundColor: rawAppState.viewBackgroundColor || '#ffffff',
    currentItemFontFamily: rawAppState.currentItemFontFamily || 1,
    theme: rawAppState.theme,
    zoom: rawAppState.zoom,
    scrollX: rawAppState.scrollX,
    scrollY: rawAppState.scrollY,
  };

  // Files should be undefined or a proper BinaryFiles object
  const files = currentBoard.files && Object.keys(currentBoard.files).length > 0
    ? currentBoard.files
    : undefined;

  return (
    <div className="h-full w-full">
      <Excalidraw
        initialData={{
          elements: elements as any,
          appState: appState,
          files: files,
          scrollToContent: true,
        }}
        onChange={handleChange}
        theme={effectiveTheme}
      />
    </div>
  );
}
