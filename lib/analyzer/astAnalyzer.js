"use strict";

// src/analyzer/astAnalyzer.js
const {
  parseJS
} = require('../parser/jsParser');
const {
  detectCrypto
} = require('./cryptoDetector');
const {
  detectSecrets
} = require('./secretDetector');
const fs = require('fs-extra');
const path = require('path');
async function analyze(dir) {
  const result = {
    files: [],
    crypto: [],
    apiPaths: [],
    secrets: []
  };
  const items = await fs.readdir(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = await fs.stat(full);
    if (stat.isDirectory()) {
      const sub = await analyze(full);
      result.files.push(...sub.files);
      result.crypto.push(...sub.crypto);
      result.apiPaths.push(...sub.apiPaths);
      result.secrets.push(...sub.secrets);
    } else {
      const rel = path.relative(dir, full);
      result.files.push(rel);
      if (item.endsWith('.js')) {
        const content = await fs.readFile(full, 'utf8');
        const ast = parseJS(content);
        result.crypto.push(...detectCrypto(ast));
        result.secrets.push(...detectSecrets(ast));
        const re = /wx\.request\s*\(\s*\{\s*url\s*:\s*['"]([^'"]+)['"]/g;
        let m;
        while (m = re.exec(content)) {
          result.apiPaths.push(m[1]);
        }
      }
    }
  }
  return result;
}
module.exports = {
  analyze
};