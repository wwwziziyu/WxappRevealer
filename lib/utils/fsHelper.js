"use strict";

// src/utils/fsHelper.js
const fs = require('fs-extra');
const path = require('path');
async function readFileSafe(filePath) {
  return fs.readFile(filePath, 'utf8');
}
async function writeFileSafe(filePath, content) {
  await fs.ensureDir(path.dirname(filePath));
  return fs.writeFile(filePath, content, 'utf8');
}
module.exports = {
  readFileSafe,
  writeFileSafe
};