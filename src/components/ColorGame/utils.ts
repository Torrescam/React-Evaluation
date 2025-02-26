export function getRandomColor() {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

export function rgbString(color) {
  const [r, g, b] = color;
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomColors(n) {
  return [...Array(n)].map(() => getRandomColor());
}

export function getStatus(attempts, target, numOfColors) {
  if (attempts.length === numOfColors - 1) return "lose";
  if (attempts.includes(target)) return "win";
  return "playing";
}

export const statusMessage = {
  playing: "The game is on!",
  win: "You won!",
  lose: "You lose!",
};
