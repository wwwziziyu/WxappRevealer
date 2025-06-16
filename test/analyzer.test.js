// test/analyzer.test.js
const { analyze } = require('../src/analyzer/astAnalyzer');
const path = require('path');

describe('Analyzer Module', () => {
  test('analyze returns expected structure', async () => {
    const dir = path.resolve(__dirname, 'fixtures/sample_unpacked');
    const result = await analyze(dir);

    // 基本结构
    expect(result).toHaveProperty('files');
    expect(Array.isArray(result.files)).toBe(true);

    // 加解密调用检测
    expect(result).toHaveProperty('crypto');
    expect(Array.isArray(result.crypto)).toBe(true);

    // API 路径检测
    expect(result).toHaveProperty('apiPaths');
    expect(Array.isArray(result.apiPaths)).toBe(true);

    // 敏感常量检测
    expect(result).toHaveProperty('secrets');
    expect(Array.isArray(result.secrets)).toBe(true);

    // 正则敏感信息匹配
    expect(result).toHaveProperty('regexMatches');
    expect(Array.isArray(result.regexMatches)).toBe(true);
  });
});