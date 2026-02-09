"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Scan } from "lucide-react";
import { getAttemptColors } from "@/lib/game-colors";
import { getActiveStates, type GameSettings } from "@/lib/game-settings";
import {
  DIVIDER_PATH_ASSOCIATED_STATES,
  DIVIDER_PATH_HAWAII,
  DIVIDER_PATH_TERRITORIES,
} from "@/lib/us-states";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DIVIDER_PATH_CLASS = "fill-none stroke-muted-foreground";
const STROKE_WIDTH = 0.5;
const VIEWBOX_FULL = "435 428 665 432";
const VIEWBOX_STATES = "435 428 572 432";

interface UsMapProps {
  guessedStates?: Set<string>;
  onStateClick?: (stateId: string) => void;
  settings: GameSettings;
  showTooltips?: boolean;
  stateAttempts?: Record<string, number>;
  wrongGuess?: string | null;
}

export function UsMap({
  guessedStates,
  onStateClick,
  settings,
  showTooltips = true,
  stateAttempts,
  wrongGuess,
}: UsMapProps) {
  const [zoomed, setZoomed] = useState(false);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleStateClick = useCallback(
    (stateId: string, e: React.MouseEvent) => {
      const down = pointerDownRef.current;
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) {
        return; // User was panning/dragging, not clicking
      }
      onStateClick?.(stateId);
    },
    [onStateClick],
  );

  const visibleStates = useMemo(() => getActiveStates(settings), [settings]);

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
              viewBox={
                settings.includeAssociatedStates ? VIEWBOX_FULL : VIEWBOX_STATES
              }
              className="h-auto max-h-full w-auto max-w-full"
              onPointerDown={handlePointerDown}
            >
              <path
                d={DIVIDER_PATH_HAWAII}
                className={DIVIDER_PATH_CLASS}
                strokeWidth={STROKE_WIDTH}
              />
              {settings.includeTerritories && (
                <path
                  d={DIVIDER_PATH_TERRITORIES}
                  className={DIVIDER_PATH_CLASS}
                  strokeWidth={STROKE_WIDTH}
                />
              )}
              {settings.includeAssociatedStates && (
                <path
                  d={DIVIDER_PATH_ASSOCIATED_STATES}
                  className={DIVIDER_PATH_CLASS}
                  strokeWidth={STROKE_WIDTH}
                />
              )}
              {visibleStates.map((state) => {
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
                      isClickable
                        ? (e) => handleStateClick(state.id, e)
                        : undefined
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
