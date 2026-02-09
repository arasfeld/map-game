import { useMemo } from "react";
import { getAttemptColors } from "@/lib/game-colors";
import type { Region } from "@/lib/us-states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResultsDialogProps {
  activeStates: Region[];
  attempts: Record<string, number>;
  onClose: () => void;
  onPlayAgain: () => void;
  open: boolean;
  time: string;
}

export function ResultsDialog({
  activeStates,
  attempts,
  onClose,
  onPlayAgain,
  open,
  time,
}: ResultsDialogProps) {
  const sortedStates = useMemo(
    () => [...activeStates].sort((a, b) => a.name.localeCompare(b.name)),
    [activeStates],
  );

  const counts = Object.values(attempts);
  const totalGuesses = counts.reduce((sum, n) => sum + n, 0);
  const misses = totalGuesses - counts.length;
  const perfect = counts.filter((n) => n === 1).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto sm:max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>All states found!</DialogTitle>
          <DialogDescription>Completed in {time}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-green-500" />
            <span>{perfect} perfect</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500" />
            <span>
              {misses} {misses === 1 ? "miss" : "misses"}
            </span>
          </div>
          <div className="text-muted-foreground">
            {totalGuesses} total guesses
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
          {sortedStates.map((state) => {
            const count = attempts[state.id] ?? 1;
            const { bg } = getAttemptColors(count);
            return (
              <div key={state.id} className="flex items-center gap-2 py-0.5">
                <span className={`size-2.5 shrink-0 rounded-full ${bg}`} />
                <span className="truncate">{state.name}</span>
                <span className="text-muted-foreground ml-auto">{count}</span>
              </div>
            );
          })}
        </div>
        <Button onClick={onPlayAgain} className="mt-2 w-full">
          Play Again
        </Button>
      </DialogContent>
    </Dialog>
  );
}
