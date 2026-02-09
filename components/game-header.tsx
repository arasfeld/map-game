import type { GameSettings } from "@/lib/game-settings";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "@/components/settings-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import type { GameState } from "@/components/map-game";

interface GameHeaderProps {
  finalTime: number;
  formatTime: (ms: number) => string;
  game: GameState | null;
  isGameOver: boolean;
  onSettingsChange: (settings: GameSettings) => void;
  onSkip: () => void;
  onStartGame: () => void;
  settings: GameSettings;
}

export function GameHeader({
  finalTime,
  formatTime,
  game,
  isGameOver,
  onSettingsChange,
  onSkip,
  onStartGame,
  settings,
}: GameHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b px-4">
      <div className="flex w-40 items-center gap-3">
        {game && (
          <span className="text-muted-foreground rounded-md bg-muted px-2.5 py-1 font-mono text-sm tabular-nums">
            {formatTime(finalTime)}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center gap-3">
        {!game ? (
          <Button onClick={onStartGame} size="lg">
            Start Game
          </Button>
        ) : isGameOver ? (
          <Button onClick={onStartGame} size="lg">
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
              onClick={onSkip}
              variant="outline"
              size="sm"
              disabled={game.remainingStates.length <= 1}
            >
              Skip
            </Button>
          </>
        )}
      </div>
      <div className="flex w-40 items-center justify-end gap-2">
        <SettingsMenu
          settings={settings}
          onSettingsChange={onSettingsChange}
          disabled={game != null && !isGameOver}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
