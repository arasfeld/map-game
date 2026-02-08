"use client";

import { states } from "@/lib/us-states";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UsMap() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="52 30 1045 732"
      className="h-auto w-full max-w-5xl"
    >
      {states.map((state) => (
        <Tooltip key={state.id}>
          <TooltipTrigger asChild>
            <path
              id={state.id}
              d={state.path}
              className="fill-transparent stroke-muted-foreground transition-colors hover:fill-muted"
              strokeWidth={0.75}
            />
          </TooltipTrigger>
          <TooltipContent>{state.name}</TooltipContent>
        </Tooltip>
      ))}
    </svg>
  );
}
