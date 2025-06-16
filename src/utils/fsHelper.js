// src/utils/fsHelper.js
const fs = require('fs-extra');
const path = require('path');

/**
 * 安全读取文件内容，文件不存在返回 null
 * @param {string} filePath
 * @returns {Promise<string|null>}
 */
async function readFileSafe(filePath) {
  try {
    if (!await fs.pathExists(filePath)) return null;
    return await fs.readFile(filePath, 'utf8');
  } catch (err) {
    throw new Error(`readFileSafe error: ${err.message}`);
  }
}

/**
 * 原子方式写入文件，保证写入完整
 * @param {string} filePath
 * @param {string|Buffer} content
 * @returns {Promise<void>}
 */
async function writeFileSafe(filePath, content) {
  const dir = path.dirname(filePath);
  await fs.ensureDir(dir);
  const tempPath = path.join(dir, `.tmp_${path.basename(filePath)}_${Date.now()}`);
  await fs.writeFile(tempPath, content, 'utf8');
  await fs.move(tempPath, filePath, { overwrite: true });
}

/**
 * 安全读取 JSON 文件，文件不存在返回 null
 * @param {string} filePath
 * @returns {Promise<Object|null>}
 */
async function readJsonSafe(filePath) {
  try {
    const str = await readFileSafe(filePath);
    return str ? JSON.parse(str) : null;
  } catch (err) {
    throw new Error(`readJsonSafe error: ${err.message}`);
  }
}

/**
 * 安全写入 JSON 文件，支持格式化
 * @param {string} filePath
 * @param {Object} obj
 * @param {{ spaces?: number }} opts
 * @returns {Promise<void>}
 */
async function writeJsonSafe(filePath, obj, opts = { spaces: 2 }) {
  const content = JSON.stringify(obj, null, opts.spaces);
  await writeFileSafe(filePath, content);
}

module.exports = { readFileSafe, writeFileSafe, readJsonSafe, writeJsonSafe };