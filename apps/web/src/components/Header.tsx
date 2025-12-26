import { useBoardsStore } from '../hooks/useBoards';
import { useAuthStore } from '../hooks/useAuth';
import { useThemeStore } from '../hooks/useTheme';
import { Sun, Moon, Download, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { exportBoardAsPNG, exportBoardAsSVG, exportBoardAsJSON } from '../utils/export';
import { formatDate } from '../utils/helpers';
import { SettingsDialog } from './SettingsDialog';

export function Header() {
  const { currentBoard, lastSavedAt } = useBoardsStore();
  const { user, logout } = useAuthStore();
  const { theme, effectiveTheme, setTheme } = useThemeStore();
  const [isExporting, setIsExporting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await logout();
    }
  };

  const handleExport = async (format: 'png' | 'svg' | 'json') => {
    if (!currentBoard) return;

    setIsExporting(true);
    try {
      switch (format) {
        case 'png':
          await exportBoardAsPNG(
            currentBoard.elements,
            currentBoard.appState,
            currentBoard.files || null,
            currentBoard.name
          );
          break;
        case 'svg':
          await exportBoardAsSVG(
            currentBoard.elements,
            currentBoard.appState,
            currentBoard.files || null,
            currentBoard.name
          );
          break;
        case 'json':
          exportBoardAsJSON(currentBoard);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export board. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('auto');
    else setTheme('light');
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Maplify Tech</h1>
        </div>
        {currentBoard && (
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">
              {currentBoard.name}
            </span>
            {lastSavedAt && (
              <span className="text-xs">
                • Saved {formatDate(lastSavedAt.toISOString())}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Export Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              disabled={!currentBoard || isExporting}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 min-w-[160px] z-50"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded outline-none text-gray-900 dark:text-gray-100"
                onSelect={() => handleExport('png')}
              >
                Export as PNG
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded outline-none text-gray-900 dark:text-gray-100"
                onSelect={() => handleExport('svg')}
              >
                Export as SVG
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              <DropdownMenu.Item
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded outline-none text-gray-900 dark:text-gray-100"
                onSelect={() => handleExport('json')}
              >
                Export as JSON
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Settings Button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title={`Theme: ${theme}`}
        >
          {effectiveTheme === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{user?.name || user?.email}</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 min-w-[200px] z-50"
              sideOffset={5}
              align="end"
            >
              <div className="px-3 py-2 text-sm border-b border-gray-200 dark:border-gray-700">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
              <DropdownMenu.Item
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded outline-none text-red-600 dark:text-red-400 flex items-center gap-2"
                onSelect={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
}
