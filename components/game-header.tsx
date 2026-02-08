import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { GameState } from "@/components/map-game";

interface GameHeaderProps {
  game: GameState | null;
  elapsed: number;
  isGameOver: boolean;
  finalTime: number;
  startGame: () => void;
  handleSkip: () => void;
  formatTime: (ms: number) => string;
}

function getMissesColor(misses: number) {
  if (misses === 0) return "text-green-500";
  if (misses <= 5) return "text-yellow-500";
  if (misses <= 15) return "text-orange-500";
  return "text-red-500";
}

export function GameHeader({
  game,
  isGameOver,
  finalTime,
  startGame,
  handleSkip,
  formatTime,
}: GameHeaderProps) {
  const totalAttempts = game
    ? Object.values(game.attempts).reduce((sum, n) => sum + n, 0)
    : 0;
  const misses = totalAttempts - (game?.guessedStates.size ?? 0);

  return (
    <header className="flex h-14 shrink-0 items-center border-b px-4">
      <div className="flex w-40 items-center gap-3">
        {game && (
          <>
            <span className="text-muted-foreground rounded-md bg-muted px-2.5 py-1 font-mono text-sm tabular-nums">
              {formatTime(finalTime)}
            </span>
            <span
              className={`font-mono text-sm tabular-nums ${getMissesColor(misses)}`}
            >
              {misses} {misses === 1 ? "miss" : "misses"}
            </span>
          </>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center gap-3">
        {!game ? (
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        ) : isGameOver ? (
          <Button onClick={startGame} size="lg">
            Play Again
          </Button>
        ) : (
          <>
            <span className="text-muted-foreground text-sm tracking-wide uppercase">
              Find
            </span>
            <span className="text-lg font-semibold tracking-tight">
              {game.currentTarget.name}
            </span>
            <Button
              onClick={handleSkip}
              variant="outline"
              size="sm"
              disabled={game.remainingStates.length <= 1}
            >
              Skip
            </Button>
          </>
        )}
      </div>
      <div className="flex w-40 items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
