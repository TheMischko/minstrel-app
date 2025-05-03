export function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  let i = arrayCopy.length;
  let j, temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arrayCopy[j];
    arrayCopy[j] = arrayCopy[i];
    arrayCopy[i] = temp;
  }
  return arrayCopy;
}
