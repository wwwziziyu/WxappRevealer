// test/parser.test.js
const { parseJS, safeParseJS } = require('../src/parser/jsParser');

describe('JS Parser Module', () => {
  test('parseJS returns AST Program for valid code', () => {
    const code = 'const a = 42;';
    const ast = parseJS(code);
    expect(ast).toBeDefined();
    expect(ast.type).toBe('Program');
    expect(ast.body).toHaveLength(1);
  });

  test('parseJS throws SyntaxError for invalid code', () => {
    const code = 'const = ;';
    expect(() => parseJS(code)).toThrow(SyntaxError);
  });

  test('safeParseJS returns AST for valid code', () => {
    const code = 'function foo() { return true; }';
    const ast = safeParseJS(code, 'test.js');
    expect(ast).not.toBeNull();
    expect(ast.type).toBe('Program');
  });

  test('safeParseJS returns null and does not throw for invalid code', () => {
    const code = 'function () {';
    const ast = safeParseJS(code, 'test.js');
    expect(ast).toBeNull();
  });
});