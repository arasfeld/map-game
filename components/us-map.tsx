"use client";

import { useState } from "react";
import {
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { Scan } from "lucide-react";
import { getAttemptColors } from "@/lib/game-colors";
import { states } from "@/lib/us-states";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsMapProps {
  showTooltips?: boolean;
  onStateClick?: (stateId: string) => void;
  guessedStates?: Set<string>;
  stateAttempts?: Record<string, number>;
  wrongGuess?: string | null;
}

export function UsMap({
  showTooltips = true,
  onStateClick,
  guessedStates,
  stateAttempts,
  wrongGuess,
}: UsMapProps) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={6}
      wheel={{ step: 0.15 }}
      doubleClick={{ disabled: true }}
      onTransformed={(_ref, state) => setZoomed(state.scale > 1)}
    >
      {({ resetTransform }) => (
        <div className="relative h-full w-full">
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="52 30 1045 732"
              className="h-auto max-h-full w-auto max-w-full"
            >
              {states.map((state) => {
                const isGuessed = guessedStates?.has(state.id);
                const isWrong = wrongGuess === state.id;
                const isClickable = onStateClick && !isGuessed;

                const pathElement = (
                  <path
                    id={state.id}
                    d={state.path}
                    className={cn(
                      "stroke-muted-foreground transition-colors",
                      isGuessed
                        ? getAttemptColors(stateAttempts?.[state.id] ?? 1).fill
                        : isWrong
                          ? "fill-destructive/60"
                          : "fill-transparent hover:fill-muted",
                    )}
                    strokeWidth={0.75}
                    onClick={
                      isClickable ? () => onStateClick(state.id) : undefined
                    }
                    style={isClickable ? { cursor: "pointer" } : undefined}
                  />
                );

                if (!showTooltips) {
                  return <g key={state.id}>{pathElement}</g>;
                }

                return (
                  <Tooltip key={state.id}>
                    <TooltipTrigger asChild>{pathElement}</TooltipTrigger>
                    <TooltipContent>{state.name}</TooltipContent>
                  </Tooltip>
                );
              })}
            </svg>
          </TransformComponent>
          {zoomed && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 bg-background/80 backdrop-blur-sm"
              onClick={() => resetTransform()}
            >
              <Scan className="size-4" />
              <span className="sr-only">Reset zoom</span>
            </Button>
          )}
        </div>
      )}
    </TransformWrapper>
  );
}
