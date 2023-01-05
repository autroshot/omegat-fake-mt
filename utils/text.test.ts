import { convertTagToSingleQuotationMarks } from './text';

test('convertTagToSingleQuotationMarks 함수', () => {
  expect(convertTagToSingleQuotationMarks('안녕하세요.')).toBe('안녕하세요.');
});
