"use strict";

// src/analyzer/secretDetector.js
const estraverse = require('estraverse');
function detectSecrets(ast) {
  const hits = [];
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === 'Literal' && typeof node.value === 'string' && /(key|secret|token|pwd|pass|AES|HMAC|MD5)/i.test(node.value)) {
        hits.push({
          value: node.value,
          loc: node.loc
        });
      }
    }
  });
  return hits;
}
module.exports = {
  detectSecrets
};