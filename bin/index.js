#!/usr/bin/env node
const { Command } = require('commander');
const path        = require('path');
const fs          = require('fs-extra');
const unpacker    = require('../src/unpacker');
const analyzer    = require('../src/analyzer/astAnalyzer');
const mdExporter  = require('../src/exporter/markdownExporter');
const pkg         = require('../package.json');

const program = new Command();
program
  .version(pkg.version)
  .option('-o, --out <outDir>', '指定输出目录')
  .option('-d, --no-clean', '保留解包的临时文件');

program
  .command('run <file>')
  .description('一次性执行 unpack → analyze → export')
  .action(async (file) => {
    const opts   = program.opts();
    const outDir = opts.out;

    // 1. 解包
    const unpackDir = await unpacker.unpack(file, outDir, { verbose: true });
    console.log(`Unpacked to ${unpackDir}`);

    // 2. 分析
    const result       = await analyzer.analyze(unpackDir);
    const analysisFile = path.join(unpackDir, 'analysis.json');
    await fs.writeFile(analysisFile, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Analysis saved to ${analysisFile}`);

    // 3. 导出 Markdown 报告
    const mdFile = await mdExporter.export(analysisFile, { outDir });
    console.log(`Markdown report generated at ${mdFile}`);

    // 4. 清理（如果未指定 --no-clean）
    if (opts.clean !== false) {
      console.log('Cleaning up temporary files...');
      // 例如：fs.removeSync(path.join(unpackDir, 'tmp'));
    }
  });

program
  .command('unpack <file>')
  .description('解包 .wxapkg 文件')
  .action(async (file) => {
    const outDir = program.opts().out;
    const dir    = await unpacker.unpack(file, outDir);
    console.log(`Unpacked to ${dir}`);
  });

program
  .command('analyze <dir>')
  .description('分析解包后的目录，提取加解密参数、敏感信息与路径')
  .action(async (dir) => {
    const result       = await analyzer.analyze(dir);
    const analysisFile = path.join(dir, 'analysis.json');
    await fs.writeFile(analysisFile, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Analysis saved to ${analysisFile}`);
  });

program
  .command('export <analysis.json>')
  .description('将分析结果导出为 Markdown 报告（包含敏感信息、API 路径、加解密调用等）')
  .action(async (file) => {
    const opts   = program.opts();
    const mdFile = await mdExporter.export(file, { outDir: opts.out });
    console.log(`Markdown report generated at ${mdFile}`);
  });

program.parse(process.argv);