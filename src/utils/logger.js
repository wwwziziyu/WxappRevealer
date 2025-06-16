// src/utils/logger.js
const chalk = require('chalk');

// 日志级别与颜色映射
const LEVELS = {
  info:    { label: 'INFO',    color: chalk.blue },
  success: { label: 'SUCCESS', color: chalk.green },
  warn:    { label: 'WARN',    color: chalk.yellow },
  error:   { label: 'ERROR',   color: chalk.red },
  debug:   { label: 'DEBUG',   color: chalk.gray }
};

// 是否启用调试日志
let verbose = false;

/**
 * 设置调试模式
 * @param {boolean} v
 */
function setVerbose(v) {
  verbose = Boolean(v);
}

/**
 * 通用日志输出
 * @param {'info'|'success'|'warn'|'error'|'debug'} level
 * @param {string} msg
 */
function log(level, msg) {
  const lvl = LEVELS[level] || LEVELS.info;
  if (level === 'debug' && !verbose) return;
  const time = new Date().toISOString();
  console.log(`${lvl.color(`[${lvl.label}]`)} ${time} - ${msg}`);
}

function info(msg)    { log('info', msg); }
function success(msg) { log('success', msg); }
function warn(msg)    { log('warn', msg); }
function error(msg)   { log('error', msg); }
function debug(msg)   { log('debug', msg); }

module.exports = { info, success, warn, error, debug, setVerbose };