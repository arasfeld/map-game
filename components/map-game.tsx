"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type USState, states } from "@/lib/us-states";
import { ResultsDialog } from "@/components/results-dialog";
import { UsMap } from "@/components/us-map";
import { Button } from "@/components/ui/button";

interface GameState {
  remainingStates: USState[];
  currentTarget: USState;
  attempts: Record<string, number>;
  guessedStates: Set<string>;
  startTime: number;
  endTime: number | null;
}

function pickRandom(arr: USState[]): USState {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function MapGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const wrongGuessTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Live timer — ticks every second while the game is active
  const gameStartTime = game?.startTime;
  const gameEndTime = game?.endTime;
  useEffect(() => {
    if (!gameStartTime || gameEndTime) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - gameStartTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStartTime, gameEndTime]);

  const startGame = useCallback(() => {
    const remaining = [...states];
    setElapsed(0);
    setGame({
      remainingStates: remaining,
      currentTarget: pickRandom(remaining),
      attempts: {},
      guessedStates: new Set(),
      startTime: Date.now(),
      endTime: null,
    });
  }, []);

  const handleGuess = useCallback(
    (stateId: string) => {
      if (!game || game.endTime) return;

      const targetId = game.currentTarget.id;
      const newAttempts = {
        ...game.attempts,
        [targetId]: (game.attempts[targetId] ?? 0) + 1,
      };

      if (stateId === targetId) {
        // Correct guess
        const newGuessed = new Set(game.guessedStates).add(stateId);
        const newRemaining = game.remainingStates.filter(
          (s) => s.id !== stateId,
        );

        // Clear any active wrong-guess flash
        if (wrongGuessTimer.current) clearTimeout(wrongGuessTimer.current);
        setWrongGuess(null);

        if (newRemaining.length === 0) {
          setGame({
            ...game,
            remainingStates: newRemaining,
            attempts: newAttempts,
            guessedStates: newGuessed,
            endTime: Date.now(),
          } as GameState);
        } else {
          setGame({
            ...game,
            remainingStates: newRemaining,
            currentTarget: pickRandom(newRemaining),
            attempts: newAttempts,
            guessedStates: newGuessed,
          });
        }
      } else {
        // Wrong guess — flash the clicked state red briefly
        setGame({ ...game, attempts: newAttempts });
        if (wrongGuessTimer.current) clearTimeout(wrongGuessTimer.current);
        setWrongGuess(stateId);
        wrongGuessTimer.current = setTimeout(() => setWrongGuess(null), 600);
      }
    },
    [game],
  );

  const handleSkip = useCallback(() => {
    if (!game || game.endTime || game.remainingStates.length <= 1) return;

    const otherStates = game.remainingStates.filter(
      (s) => s.id !== game.currentTarget.id,
    );

    if (wrongGuessTimer.current) clearTimeout(wrongGuessTimer.current);
    setWrongGuess(null);

    setGame({
      ...game,
      remainingStates: [...otherStates, game.currentTarget],
      currentTarget: pickRandom(otherStates),
    });
  }, [game]);

  const isGameOver = game?.endTime != null;
  const finalTime = game?.endTime ? game.endTime - game.startTime : elapsed;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex min-h-10 items-center gap-4">
        {!game ? (
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        ) : (
          <>
            {!isGameOver && (
              <>
                <p className="text-xl font-medium">
                  Find:{" "}
                  <span className="font-bold">{game.currentTarget.name}</span>
                </p>
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="sm"
                  disabled={game.remainingStates.length <= 1}
                >
                  Skip
                </Button>
              </>
            )}
            <p className="text-muted-foreground tabular-nums">
              {formatTime(finalTime)}
            </p>
          </>
        )}
      </div>
      <UsMap
        showTooltips={!game}
        onStateClick={game && !isGameOver ? handleGuess : undefined}
        guessedStates={game?.guessedStates}
        stateAttempts={game?.attempts}
        wrongGuess={wrongGuess}
      />

      <ResultsDialog
        open={isGameOver}
        attempts={game?.attempts ?? {}}
        time={formatTime(finalTime)}
        onPlayAgain={startGame}
      />
    </div>
  );
}
