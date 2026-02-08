/** Returns Tailwind color classes based on the number of guessing attempts. */
export function getAttemptColors(attempts: number) {
  if (attempts <= 1) return { fill: "fill-green-500/50", bg: "bg-green-500" };
  if (attempts <= 3)
    return { fill: "fill-yellow-500/50", bg: "bg-yellow-500" };
  if (attempts <= 5)
    return { fill: "fill-orange-500/50", bg: "bg-orange-500" };
  return { fill: "fill-red-500/50", bg: "bg-red-500" };
}
