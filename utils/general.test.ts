import { getRandomElement } from './general';

test('getRandomElement 함수', () => {
  const array = [1, 2, 3, 4, 5];

  for (let i = 0; i < 10; i++) {
    expect(array).toContain(getRandomElement(array));
  }
});
