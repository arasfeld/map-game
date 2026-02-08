"use client";

import { states } from "@/lib/us-states";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsMapProps {
  showTooltips?: boolean;
  onStateClick?: (stateId: string) => void;
}

export function UsMap({ showTooltips = true, onStateClick }: UsMapProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="52 30 1045 732"
      className="h-auto w-full max-w-5xl"
    >
      {states.map((state) => {
        const pathElement = (
          <path
            id={state.id}
            d={state.path}
            className="fill-transparent stroke-muted-foreground transition-colors hover:fill-muted"
            strokeWidth={0.75}
            onClick={() => onStateClick?.(state.id)}
            style={onStateClick ? { cursor: "pointer" } : undefined}
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
