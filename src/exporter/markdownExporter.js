// src/exporter/markdownExporter.js
const path = require('path');
const fs = require('fs-extra');

/**
 * 导出 Markdown 报告，结构化各类分析结果
 * @param {string} inputFile    - analysis.json 源文件路径
 * @param {object} opts         - 配置项: { outDir, outMdName }
 * @returns {Promise<string>}   - 写入的 Markdown 文件绝对路径
 */
async function exportMarkdown(inputFile, opts = {}) {
  const data = await fs.readJson(path.resolve(inputFile));
  const baseDir = opts.outDir
    ? path.resolve(opts.outDir)
    : path.dirname(path.resolve(inputFile));
  const fileName = opts.outMdName || 'report.md';
  const outFile = path.join(baseDir, fileName);

  let md = `# 分析报告\n\n`;

  // 1. 文件列表
  md += `## 📁 文件列表（共 ${data.files.length} 个）\n`;
  data.files.forEach(f => {
    md += `- \`${f}\`\n`;
  });
  md += `\n`;

  // 2. 加解密 & 哈希 调用（始终渲染）
  md += `## 🔒 加解密 & 哈希 调用 (${data.crypto?.length || 0})\n`;
  md += `| 文件 | 方法 | 行:列 | 参数 | 代码片段 |\n`;
  md += `| ---- | ---- | ----- | ---- | -------- |\n`;
  (data.crypto || []).forEach(c => {
    const loc = c.loc.start;
    const args = c.args.join(', ');
    const snippet = c.snippet ? c.snippet.replace(/\r?\n/g, ' ').slice(0, 80) + '…' : '';
    const file = c.file || path.basename(inputFile);
    md += `| \`${file}\` | \`${c.name}\` | ${loc.line}:${loc.column} | ${args} | \`${snippet}\` |\n`;
  });
  md += `\n`;

  // 3. 敏感常量（始终渲染）
  md += `## 🔑 敏感常量 (${data.secrets?.length || 0})\n`;
  md += `| 文件 | 值片段 | 行:列 |\n`;
  md += `| ---- | ------- | ----- |\n`;
  (data.secrets || []).forEach(s => {
    const loc = s.loc.start;
    const val = s.value.slice(0, 50).replace(/`/g, '\\`') + (s.value.length > 50 ? '…' : '');
    const file = s.file || path.basename(inputFile);
    md += `| \`${file}\` | \`${val}\` | ${loc.line}:${loc.column} |\n`;
  });
  md += `\n`;

  // 4. 正则匹配敏感信息（始终渲染）
  md += `## 🕵️ 正则匹配敏感信息 (${data.regexMatches?.length || 0})\n`;
  md += `| 类型 | 文件 | 匹配值片段 | 偏移 |\n`;
  md += `| ---- | ---- | ---------- | ---- |\n`;
  (data.regexMatches || []).forEach(r => {
    const match = r.match.replace(/\r?\n/g, ' ').slice(0, 80) + (r.match.length > 80 ? '…' : '');
    md += `| \`${r.name}\` | \`${r.file}\` | \`${match}\` | ${r.index} |\n`;
  });
  md += `\n`;

  // 5. API 请求 URL（始终渲染）
  md += `## 🌐 API 请求 URL (${data.apiPaths?.length || 0})\n`;
  (data.apiPaths || []).forEach(url => {
    md += `- ${url}\n`;
  });
  md += `\n`;

  // 写入文件
  await fs.ensureDir(baseDir);
  await fs.writeFile(outFile, md, 'utf8');
  return outFile;
}

module.exports = { export: exportMarkdown };