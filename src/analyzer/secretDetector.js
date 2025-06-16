// src/analyzer/secretDetector.js
const estraverse = require('estraverse');
const path = require('path');
const fs = require('fs');

// AST 检测关键字
const secretPatterns = /(key|secret|token|pwd|pass|AES|HMAC|MD5)/i;

// 加载正则敏感模式配置
let regexPatterns = [];
try {
  const cfgPath = path.resolve(__dirname, '../config/secretPatterns.json');
  const { patterns } = require(cfgPath);
  regexPatterns = patterns;
} catch (err) {
  console.warn(`[secretDetector] 无法加载正则模式文件: ${err.message}`);
}

/**
 * 从 AST 中检测字符串常量中的敏感信息
 */
function detectSecrets(ast, code = '', filePath = '') {
  const hits = [];
  estraverse.traverse(ast, {
    enter(node) {
      if (
        node.type === 'Literal' &&
        typeof node.value === 'string' &&
        secretPatterns.test(node.value)
      ) {
        const snippet = code && node.start != null && node.end != null
          ? code.slice(node.start, node.end)
          : '';
        hits.push({
          type: 'AST_Literal',
          file: filePath,
          value: node.value,
          loc: node.loc,
          snippet
        });
      }
      if (
        node.type === 'TemplateLiteral' &&
        node.quasis.some(q => secretPatterns.test(q.value.raw))
      ) {
        const raw = node.quasis.map(q => q.value.raw).join('${...}');
        const snippet = code && node.start != null && node.end != null
          ? code.slice(node.start, node.end)
          : raw;
        hits.push({
          type: 'AST_TemplateLiteral',
          file: filePath,
          value: raw,
          loc: node.loc,
          snippet
        });
      }
    }
  });
  return hits;
}

/**
 * 使用正则规则检测敏感内容
 */
function detectByRegex(content, filePath = '') {
  const hits = [];
  for (const { name, regex } of regexPatterns) {
    const re = new RegExp(regex, 'g');
    let m;
    while ((m = re.exec(content)) !== null) {
      const matchValue = m[1] || m[0];
      hits.push({
        type: 'REGEX',
        name,
        match: matchValue,
        index: m.index,
        file: filePath
      });
    }
  }
  return hits;
}

module.exports = { detectSecrets, detectByRegex };