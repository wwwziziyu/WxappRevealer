// plugins/samplePlugin.js
module.exports = (program) => {
  const fs = require('fs-extra');
  const path = require('path');

  program
    .command('paths [dir]')
    .alias('p')
    .description('导出 WXML、WXSS 和 JS 文件路径列表')
    .option('-o, --out <file>', '输出文件名（默认为 filePaths.json）', 'filePaths.json')
    .action(async (dir = '.', opts) => {
      try {
        const baseDir = path.resolve(dir);
        const analysisFile = path.join(baseDir, 'analysis.json');
        if (!await fs.pathExists(analysisFile)) {
          throw new Error(`未找到分析文件: ${analysisFile}`);
        }
        const data = await fs.readJson(analysisFile);
        const groups = { wxml: [], wxss: [], js: [] };
        data.files.forEach(f => {
          if (f.endsWith('.wxml')) groups.wxml.push(f);
          else if (f.endsWith('.wxss')) groups.wxss.push(f);
          else if (f.endsWith('.js')) groups.js.push(f);
        });
        const outPath = path.resolve(baseDir, opts.out);
        await fs.outputJson(outPath, groups, { spaces: 2 });
        console.log(`✅ 已生成文件路径列表: ${outPath}`);
      } catch (err) {
        console.error(`❌ paths 插件出错: ${err.message}`);
        process.exit(1);
      }
    });
};