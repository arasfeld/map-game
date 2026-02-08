"use client";

import { states } from "@/lib/us-states";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsMapProps {
  showTooltips?: boolean;
  onStateClick?: (stateId: string) => void;
  guessedStates?: Set<string>;
  wrongGuess?: string | null;
}

export function UsMap({
  showTooltips = true,
  onStateClick,
  guessedStates,
  wrongGuess,
}: UsMapProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="52 30 1045 732"
      className="h-auto w-full max-w-5xl"
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
                ? "fill-primary/40"
                : isWrong
                  ? "fill-destructive/60"
                  : "fill-transparent hover:fill-muted",
            )}
            strokeWidth={0.75}
            onClick={isClickable ? () => onStateClick(state.id) : undefined}
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
  );
}
