export function getRandomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(array.length * Math.random());

  return array[randomIndex];
}
