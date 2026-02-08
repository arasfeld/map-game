"use client";

import { useCallback, useState } from "react";
import { type USState, states } from "@/lib/us-states";
import { UsMap } from "@/components/us-map";
import { Button } from "@/components/ui/button";

interface GameState {
  remainingStates: USState[];
  currentTarget: USState;
  attempts: Record<string, number>;
  startTime: number;
}

function pickRandom(arr: USState[]): USState {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function MapGame() {
  const [game, setGame] = useState<GameState | null>(null);

  const startGame = useCallback(() => {
    const remaining = [...states];
    setGame({
      remainingStates: remaining,
      currentTarget: pickRandom(remaining),
      attempts: {},
      startTime: Date.now(),
    });
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex min-h-10 items-center gap-4">
        {game ? (
          <p className="text-xl font-medium">
            Find: <span className="font-bold">{game.currentTarget.name}</span>
          </p>
        ) : (
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        )}
      </div>
      <UsMap showTooltips={!game} />
    </div>
  );
}
