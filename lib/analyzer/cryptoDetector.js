"use strict";

// src/analyzer/cryptoDetector.js
const estraverse = require('estraverse');
function detectCrypto(ast) {
  const hits = [];
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === 'CallExpression' && (node.callee.type === 'Identifier' && /(encrypt|decrypt|AES|hmac|md5)/i.test(node.callee.name) || node.callee.type === 'MemberExpression' && /CryptoJS|crypto/i.test(node.callee.object.name))) {
        hits.push({
          name: node.callee.property ? node.callee.property.name : node.callee.name,
          loc: node.loc,
          args: node.arguments.map(arg => arg.type)
        });
      }
    }
  });
  return hits;
}
module.exports = {
  detectCrypto
};