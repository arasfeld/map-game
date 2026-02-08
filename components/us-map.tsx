import { states } from "@/lib/us-states";

export function UsMap() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="52 30 1045 732"
      className="h-auto w-full max-w-5xl"
    >
      {states.map((state) => (
        <path
          key={state.id}
          id={state.id}
          d={state.path}
          className="fill-transparent stroke-muted-foreground transition-colors hover:fill-muted"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}
