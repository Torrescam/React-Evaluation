export function getRandomColor(): [number, number, number] {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

export function rgbString(color: [number, number, number]): string {
  const [r, g, b] = color;
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomColors(n: number): [number, number, number][] {
  return [...Array(n)].map(() => getRandomColor());
}

export function getStatus(
  attempts: number[],
  target: number,
  numOfColors: number
): "win" | "lose" | "playing" {
  if (attempts.length === numOfColors - 1) return "lose";
  if (attempts.includes(target)) return "win";
  return "playing";
}

export const statusMessage: Record<"playing" | "win" | "lose", string> = {
  playing: "The game is on!",
  win: "You won!",
  lose: "You lose!",
};
