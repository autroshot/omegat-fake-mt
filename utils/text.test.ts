import { convertTagToSingleQuotationMarks } from './text';

test('convertTagToSingleQuotationMarks 함수', () => {
  expect(
    convertTagToSingleQuotationMarks(
      `Type <g1>mozilla.org</g1> in your browser's location bar.`
    )
  ).toBe(`Type 'mozilla.org' in your browser's location bar.`);
  expect(
    convertTagToSingleQuotationMarks(
      '<x1/>Explanation of the steps needed to obtain the result to a DNS request<x2/>'
    )
  ).toBe(
    `'Explanation of the steps needed to obtain the result to a DNS request'`
  );
  expect(
    convertTagToSingleQuotationMarks(
      `Lorem Ipsum has been the industry's <g2>standard <g3>dummy</g3></g2> text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
    )
  ).toBe(
    `Lorem Ipsum has been the industry's 'standard 'dummy'' text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`
  );
  expect(
    convertTagToSingleQuotationMarks(
      `It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like <g11>Aldus PageMaker</g11> including versions of Lorem Ipsum.`
    )
  ).toBe(
    `It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like 'Aldus PageMaker' including versions of Lorem Ipsum.`
  );
  expect(
    convertTagToSingleQuotationMarks(`<g1>server</g1> <-> <g2>client</g2>`)
  ).toBe(`'server' <-> 'client'`);
  expect(convertTagToSingleQuotationMarks(`<g1><div></g1> is tag.`)).toBe(
    `'<div>' is tag.`
  );
});
