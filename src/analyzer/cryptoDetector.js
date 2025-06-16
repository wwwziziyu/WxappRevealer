// src/analyzer/cryptoDetector.js
const estraverse = require('estraverse');

// 常见加解密与哈希方法关键词匹配
const cryptoMethods = /(encrypt|decrypt|AES|Hmac|SHA|md5|createCipher|createDecipher|PBKDF2|sign|verify)/i;

/**
 * 从 AST 中检测加解密及哈希函数调用
 * @param {Object} ast    - 由 acorn 生成的抽象语法树
 * @param {string} code   - 对应原始源码，用于提取代码片段
 * @param {string} file   - 文件路径，用于报告
 * @returns {Array<Object>} 调用列表，包含方法名、位置、参数类型、代码片段、文件名
 */
function detectCrypto(ast, code = '', file = '') {
  const hits = [];
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === 'CallExpression') {
        // 组装完整调用链
        let calleeName = '';
        if (node.callee.type === 'Identifier') {
          calleeName = node.callee.name;
        } else if (node.callee.type === 'MemberExpression') {
          const obj = node.callee.object;
          const prop = node.callee.property;
          const objName = obj.type === 'Identifier' ? obj.name : (obj.property && obj.property.name) || '';
          const propName = prop.name;
          calleeName = `${objName}.${propName}`;
        }
        if (cryptoMethods.test(calleeName)) {
          const args = node.arguments.map(arg => {
            if (arg.type === 'Literal') return `${arg.type}(${arg.value})`;
            if (arg.type === 'TemplateLiteral') return 'TemplateLiteral';
            return arg.type;
          });
          // 提取源码片段
          const snippet = code && node.start != null && node.end != null
            ? code.slice(node.start, node.end)
            : '';
          hits.push({
            file,
            name: calleeName,
            loc: node.loc,
            args,
            snippet
          });
        }
      }
    }
  });
  return hits;
}

module.exports = { detectCrypto };