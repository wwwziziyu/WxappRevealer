"use strict";

// src/exporter/markdownExporter.js
const path = require('path');
const fs = require('fs-extra');
async function exportMarkdown(inputFile) {
  const data = require(path.resolve(inputFile));
  let md = `# 分析报告\n\n`;
  md += `**文件列表**（共 ${data.files.length} 个）:\n`;
  data.files.forEach(f => md += `- ${f}\n`);
  md += `\n## 加解密调用 (${data.crypto.length})\n`;
  data.crypto.forEach(c => {
    md += `- ${c.name} @ ${c.loc.start.line}:${c.loc.start.column} (args: ${c.args.join(', ')})\n`;
  });
  md += `\n## 敏感常量 (${data.secrets.length})\n`;
  data.secrets.forEach(s => {
    md += `- "${s.value}" @ ${s.loc.start.line}:${s.loc.start.column}\n`;
  });
  md += `\n## API 路径 (${data.apiPaths.length})\n`;
  data.apiPaths.forEach(url => {
    md += `- ${url}\n`;
  });
  return md;
}
module.exports = {
  export: exportMarkdown
};