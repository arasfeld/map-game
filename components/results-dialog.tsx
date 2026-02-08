import { getAttemptColors } from "@/lib/game-colors";
import { states } from "@/lib/us-states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const sortedStates = [...states].sort((a, b) =>
  a.name.localeCompare(b.name),
);

interface ResultsDialogProps {
  open: boolean;
  attempts: Record<string, number>;
  time: string;
  onPlayAgain: () => void;
}

export function ResultsDialog({
  open,
  attempts,
  time,
  onPlayAgain,
}: ResultsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto sm:max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>All states found!</DialogTitle>
          <DialogDescription>Completed in {time}</DialogDescription>
        </DialogHeader>
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
