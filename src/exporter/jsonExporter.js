// src/exporter/jsonExporter.js
const fs = require('fs-extra');
const path = require('path');
const { writeFileSafe } = require('../utils/fsHelper');

/**
 * 导出 JSON 报告
 * @param {string} inputFile    - analysis.json 源文件路径
 * @param {object} opts         - 配置项: { outDir, outJsonName, spaces }
 * @returns {Promise<string>}   - 写入的 JSON 文件绝对路径
 */
async function exportJSON(inputFile, opts = {}) {
  // 读取分析数据
  const data = await fs.readJson(path.resolve(inputFile));

  // 计算输出路径
  const baseDir = opts.outDir
    ? path.resolve(opts.outDir)
    : path.dirname(path.resolve(inputFile));
  const fileName = opts.outJsonName || 'analysis.json';
  const outFile = path.join(baseDir, fileName);

  // 确保目录存在并写入
  const spaces = typeof opts.spaces === 'number' ? opts.spaces : 2;
  const content = JSON.stringify(data, null, spaces);
  await writeFileSafe(outFile, content);

  return outFile;
}

module.exports = { export: exportJSON };