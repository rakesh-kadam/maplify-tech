import * as Dialog from '@radix-ui/react-dialog';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { getStorageUsage, clearAllData } from '../utils/storage';
import { formatBytes } from '../utils/helpers';
import { useState, useEffect } from 'react';
import { useThemeStore } from '../hooks/useTheme';
import { useBoardsStore } from '../hooks/useBoards';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useThemeStore();
  const { loadBoards } = useBoardsStore();
  const [storageInfo, setStorageInfo] = useState(getStorageUsage());

  useEffect(() => {
    if (open) {
      setStorageInfo(getStorageUsage());
    }
  }, [open]);

  const handleClearAll = () => {
    const confirmed = confirm(
      'Are you sure you want to delete all boards and data? This action cannot be undone.\n\nMake sure to export your boards first!'
    );

    if (confirmed) {
      const doubleCheck = confirm(
        'This will permanently delete everything. Are you absolutely sure?'
      );

      if (doubleCheck) {
        clearAllData();
        onOpenChange(false);
        // Reload boards (will create a new default board)
        loadBoards();
      }
    }
  };

  const isStorageWarning = storageInfo.percentUsed > 80;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              Settings
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Theme
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 px-3 py-2 text-sm rounded border transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-3 py-2 text-sm rounded border transition-colors ${
                    theme === 'dark'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme('auto')}
                  className={`flex-1 px-3 py-2 text-sm rounded border transition-colors ${
                    theme === 'auto'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Storage Usage */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Storage Usage
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Used</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatBytes(storageInfo.used)} ({storageInfo.percentUsed.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isStorageWarning ? 'bg-orange-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(storageInfo.percentUsed, 100)}%` }}
                  />
                </div>
                {isStorageWarning && (
                  <div className="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Storage is almost full. Consider exporting and deleting old boards.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                Danger Zone
              </h3>
              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This will permanently delete all boards and settings. Export your boards before
                clearing.
              </p>
            </div>

            {/* About */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">About</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maplify Tech v1.0 - Self-hosted collaborative whiteboard
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Open source whiteboard application with secure authentication and real-time collaboration.
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
