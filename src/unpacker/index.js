// src/unpacker/index.js
const path = require('path');
const fs = require('fs-extra');
const readWxapkg = require('./wxapkgReader');
const logger = require('../utils/logger');

/**
 * 解包 .wxapkg 文件到指定目录
 * @param {string} inputFile - 源 wxapkg 文件路径
 * @param {string} outDir    - 目标输出目录
 * @param {object} opts      - 全局选项，如 { verbose }
 * @returns {Promise<string>} 输出目录绝对路径
 */
async function unpack(inputFile, outDir, opts = {}) {
  const verbose = opts.verbose || false;
  const targetDir = outDir
    ? path.resolve(outDir)
    : path.resolve(path.basename(inputFile, path.extname(inputFile)));

  logger.info(`📦 解包: ${inputFile} → ${targetDir}`);
  if (verbose) logger.debug(`使用目录: ${targetDir}`);

  // 读取 wxapkg 内容列表
  let files;
  try {
    files = readWxapkg(inputFile);
  } catch (err) {
    logger.error(`解析包失败: ${err.message}`);
    throw err;
  }

  // 确保输出目录存在
  await fs.ensureDir(targetDir);

  // 写出所有文件
  for (const { filename, content } of files) {
    const filePath = path.join(targetDir, filename);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    if (verbose) logger.debug(`✔ 保存: ${filePath}`);
  }

  logger.info(`✅ 解包完成，共 ${files.length} 个文件`);
  return targetDir;
}

module.exports = { unpack };