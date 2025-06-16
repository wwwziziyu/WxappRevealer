// src/analyzer/astAnalyzer.js
const { safeParseJS } = require('../parser/jsParser');
const { detectCrypto } = require('./cryptoDetector');
const { detectSecrets } = require('./secretDetector');
const { detectByRegex } = require('./secretDetector');
const fs = require('fs-extra');
const path = require('path');

/**
 * 分析解包目录，提取文件清单、加解密调用、API 路径、敏感常量和按正则匹配的敏感信息
 * @param {string} dir 解包后目录路径
 * @returns {Promise<Object>} 分析结果
 */
async function analyze(dir) {
  const result = {
    files: [],
    crypto: [],
    apiPaths: [],
    secrets: [],
    regexMatches: []
  };

  const entries = await fs.readdir(dir);
  for (const name of entries) {
    const fullPath = path.join(dir, name);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      const sub = await analyze(fullPath);
      result.files.push(...sub.files);
      result.crypto.push(...sub.crypto);
      result.apiPaths.push(...sub.apiPaths);
      result.secrets.push(...sub.secrets);
      result.regexMatches.push(...sub.regexMatches);
    } else {
      const rel = path.relative(dir, fullPath);
      result.files.push(rel);

      // 读取文件内容
      const content = await fs.readFile(fullPath, 'utf8');

      // JS 文件：AST 分析与加密/常量检测
      if (name.endsWith('.js')) {
        const ast = safeParseJS(content, fullPath);
        if (ast) {
          result.crypto.push(...detectCrypto(ast));
          result.secrets.push(...detectSecrets(ast));
        }
        // API 路径提取
        const reUrl = /wx\.request\s*\(\s*\{\s*url\s*:\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = reUrl.exec(content))) {
          result.apiPaths.push(m[1]);
        }
      }

      // 所有文件：按正则匹配敏感内容
      result.regexMatches.push(...detectByRegex(content, rel));
    }
  }
  return result;
}

module.exports = { analyze };