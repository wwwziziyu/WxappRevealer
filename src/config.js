// src/config.js
const path = require('path');
const pkg = require('../package.json');

module.exports = {
  // 工具版本，从 package.json 自动读取
  version: pkg.version,

  // 沙箱执行配置
  sandbox: {
    timeout: Number(process.env.SANDBOX_TIMEOUT) || 1000,        // 脚本超时（ms）
    memoryLimit: Number(process.env.SANDBOX_MEMORY_LIMIT) || 64 // 内存限制（MB）
  },

  // 输出文件配置
  output: {
    dir: process.env.OUT_DIR || '.',                            // 输出目录
    json: process.env.OUT_JSON_FILE || 'analysis.json',         // JSON 报表文件名
    markdown: process.env.OUT_MD_FILE || 'report.md'            // Markdown 报告文件名
  },

  // 敏感模式配置文件路径
  patterns: {
    secret: path.resolve(__dirname, './config/secretPatterns.json')
  },

  // 日志配置
  logger: {
    level: process.env.LOG_LEVEL || 'info'                      // info|warn|error|debug
  },

  // 各解析器默认配置
  parser: {
    js: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    wxml: {
      xmlMode: true,
      decodeEntities: true
    },
    wxss: {
      source: 'inline',
      silent: false
    }
  }
};