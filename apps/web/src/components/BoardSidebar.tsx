import { useBoardsStore } from '../hooks/useBoards';
import { Search, Plus, MoreVertical, Download, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { formatDate } from '../utils/helpers';
import { exportAllBoardsAsJSON } from '../utils/export';
import { importBoardFromFile } from '../utils/import';
import { exportAllBoards } from '../utils/storage';

export function BoardSidebar() {
  const {
    boards,
    currentBoardId,
    createBoard,
    selectBoard,
    renameBoard,
    duplicateBoard,
    removeBoard,
    importBoard,
    importBoards,
  } = useBoardsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced search: filter by name and tags
  const filteredBoards = boards.filter((board) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = board.name.toLowerCase().includes(query);
    const tagsMatch = board.tags?.some((tag) => tag.toLowerCase().includes(query));
    return nameMatch || tagsMatch;
  });

  const handleExportAll = () => {
    const allBoards = exportAllBoards();
    if (allBoards.length > 0) {
      exportAllBoardsAsJSON(allBoards);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await importBoardFromFile(file);
      if (result) {
        if (Array.isArray(result)) {
          importBoards(result);
          alert(`Successfully imported ${result.length} boards!`);
        } else {
          importBoard(result);
          alert('Board imported successfully!');
        }
      } else {
        alert('Failed to import board. Invalid file format.');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing board. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-60 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
        <button
          onClick={() => createBoard('Untitled Board')}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Board
        </button>
      </div>

      {/* Board List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredBoards.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            {searchQuery ? 'No boards found' : 'No boards yet'}
          </div>
        ) : (
          filteredBoards.map((board) => (
            <div
              key={board.id}
              className={`group relative p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                currentBoardId === board.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'border border-transparent'
              }`}
              onClick={() => selectBoard(board.id)}
            >
              <div className="flex gap-2">
                {/* Thumbnail Preview */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {board.thumbnail ? (
                    <img
                      src={board.thumbnail}
                      alt={board.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Board Info */}
                <div className="flex-1 min-w-0 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {board.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(board.updatedAt)}
                    </p>
                    {board.tags && board.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {board.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {board.tags.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{board.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 min-w-[150px] z-50"
                        sideOffset={5}
                      >
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded outline-none text-gray-900 dark:text-gray-100"
                          onSelect={() => {
                            const newName = prompt('Enter new name:', board.name);
                            if (newName && newName.trim()) {
                              renameBoard(board.id, newName.trim());
                            }
                          }}
                        >
                          Rename
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded outline-none text-gray-900 dark:text-gray-100"
                          onSelect={() => duplicateBoard(board.id)}
                        >
                          Duplicate
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded outline-none"
                          onSelect={() => {
                            if (confirm(`Delete "${board.name}"?`)) {
                              removeBoard(board.id);
                            }
                          }}
                        >
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={handleExportAll}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          <Upload className="w-4 h-4" />
          Import Board
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".drawboard,.json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </div>
  );
}
