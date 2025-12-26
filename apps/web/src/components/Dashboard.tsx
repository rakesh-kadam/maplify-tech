import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { 
  Plus, 
  FileText, 
  Clock,
  Search,
  Grid3x3,
  List
} from "lucide-react";
import { useBoardsStore } from "../hooks/useBoards";
import { useAuthStore } from "../hooks/useAuth";
import { formatDate } from "../utils/helpers";

interface DashboardProps {
  onBoardSelect: (boardId: string) => void;
}

export function Dashboard({ onBoardSelect }: DashboardProps) {
  const { boards, createBoard, isLoading } = useBoardsStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCreateBoard = async () => {
    const name = prompt("Enter board name:", "Untitled Board");
    if (name) {
      await createBoard(name);
      // After creating, the board will be automatically selected by the store
      // and we can get it from the store state
      const newBoard = useBoardsStore.getState().currentBoard;
      if (newBoard) {
        onBoardSelect(newBoard.id);
      }
    }
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <h1 className="text-xl font-bold">Maplify Tech</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Whiteboards</h2>
            <p className="text-muted-foreground">
              {boards.length} {boards.length === 1 ? 'board' : 'boards'} total
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={handleCreateBoard} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              New Board
            </Button>
          </div>
        </div>

        {/* Boards Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading boards...</p>
          </div>
        ) : filteredBoards.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">
                {searchQuery ? "No boards found" : "No boards yet"}
              </CardTitle>
              <CardDescription className="mb-6">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first whiteboard to get started"}
              </CardDescription>
              {!searchQuery && (
                <Button onClick={handleCreateBoard}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Board
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBoards.map((board) => (
              <Card 
                key={board.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => onBoardSelect(board.id)}
              >
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-md mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-12 h-12 text-blue-500" />
                  </div>
                  <CardTitle className="truncate">{board.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {formatDate(board.updatedAt)}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredBoards.map((board) => (
              <Card 
                key={board.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onBoardSelect(board.id)}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-md flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="truncate text-base">{board.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3" />
                        Updated {formatDate(board.updatedAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
