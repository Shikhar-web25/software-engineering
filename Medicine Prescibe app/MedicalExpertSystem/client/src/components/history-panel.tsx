import { useState, useEffect } from "react";
import { History, Trash2, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SymptomHistoryItem } from "@shared/schema";

interface HistoryPanelProps {
  onSelectHistory: (id: string) => void;
}

const STORAGE_KEY = "medcheck-history";

export function useSymptomHistory() {
  const [history, setHistory] = useState<SymptomHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (item: SymptomHistoryItem) => {
    setHistory((prev) => {
      const newHistory = [item, ...prev].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return { history, addToHistory, clearHistory, removeFromHistory };
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function HistoryItem({ 
  item, 
  onSelect, 
  onRemove 
}: { 
  item: SymptomHistoryItem; 
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div 
      className="group relative p-3 rounded-md hover-elevate cursor-pointer border"
      onClick={onSelect}
      data-testid={`history-item-${item.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate pr-8">
            {item.symptoms}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(item.timestamp)}
            </span>
            <Badge variant="secondary" className="text-xs">
              {item.conditionCount} condition{item.conditionCount !== 1 ? "s" : ""}
            </Badge>
            {item.hasRedFlags && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Flags
              </Badge>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        data-testid={`button-remove-history-${item.id}`}
      >
        <Trash2 className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  );
}

export function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<SymptomHistoryItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch {
          setHistory([]);
        }
      }
    }
  }, [open]);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const handleSelect = (id: string) => {
    onSelectHistory(id);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
          data-testid="button-history"
        >
          <History className="h-5 w-5" />
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {history.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Symptom History
          </SheetTitle>
          <SheetDescription>
            View your previous symptom checks
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {history.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {history.length} saved check{history.length !== 1 ? "s" : ""}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      data-testid="button-clear-history"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear History?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your saved symptom checks. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearHistory}
                        className="bg-destructive text-destructive-foreground"
                        data-testid="button-confirm-clear"
                      >
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2 pr-4">
                  {history.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      onSelect={() => handleSelect(item.id)}
                      onRemove={() => removeFromHistory(item.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <History className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <CardTitle className="text-base font-medium mb-1">No History Yet</CardTitle>
                <CardDescription>
                  Your symptom checks will appear here after you analyze symptoms.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
