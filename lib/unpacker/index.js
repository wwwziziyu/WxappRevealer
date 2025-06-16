"use strict";

// src/unpacker/index.js
const path = require('path');
const fs = require('fs-extra');
const readWxapkg = require('./wxapkgReader');
const logger = require('../utils/logger');
async function unpack(inputFile) {
  logger.info(`解包 ${inputFile}`);
  const files = readWxapkg(inputFile);
  const outDir = path.resolve(path.basename(inputFile, '.wxapkg'));
  await fs.ensureDir(outDir);
  for (const {
    filename,
    content
  } of files) {
    const target = path.join(outDir, filename);
    await fs.ensureDir(path.dirname(target));
    await fs.writeFile(target, content);
    logger.debug(`Saved ${target}`);
  }
  logger.info(`解包完成：${outDir}`);
  return outDir;
}
module.exports = {
  unpack
};