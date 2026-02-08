"use client";

import { useCallback, useRef, useState } from "react";
import { type USState, states } from "@/lib/us-states";
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

export function MapGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const [wrongGuess, setWrongGuess] = useState<string | null>(null);
  const wrongGuessTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const startGame = useCallback(() => {
    const remaining = [...states];
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

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex min-h-10 items-center gap-4">
        {!game ? (
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        ) : isGameOver ? (
          <div className="flex items-center gap-4">
            <p className="text-xl font-medium">All states found!</p>
            <Button onClick={startGame} variant="outline">
              Play Again
            </Button>
          </div>
        ) : (
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
      </div>
      <UsMap
        showTooltips={!game}
        onStateClick={game && !isGameOver ? handleGuess : undefined}
        guessedStates={game?.guessedStates}
        stateAttempts={game?.attempts}
        wrongGuess={wrongGuess}
      />
    </div>
  );
}
