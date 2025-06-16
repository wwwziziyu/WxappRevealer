// src/utils/sandbox.js
const vm = require('vm');
const logger = require('./logger');

/**
 * 在隔离上下文中运行代码，支持超时与沙箱注入
 * @param {string} code - 脚本内容
 * @param {object} [options]
 * @param {number} [options.timeout=1000] - 执行超时（毫秒)
 * @param {object} [options.sandbox={}] - 注入到上下文的全局变量
 * @param {string} [options.filename='sandbox.js'] - 用于调试和错误堆栈的脚本名
 * @returns {*} 执行结果或 null
 */
function runInSandbox(code, options = {}) {
  const { timeout = 1000, sandbox = {}, filename = 'sandbox.js' } = options;
  // 创建纯净上下文
  const context = vm.createContext(Object.assign(Object.create(null), sandbox));
  let script;
  try {
    script = new vm.Script(code, { filename, displayErrors: true });
  } catch (err) {
    logger.error(`编译沙箱脚本失败 [${filename}]: ${err.message}`);
    return null;
  }
  try {
    return script.runInContext(context, { timeout, displayErrors: true });
  } catch (err) {
    logger.error(`运行沙箱脚本失败 [${filename}]: ${err.message}`);
    return null;
  }
}

module.exports = { runInSandbox };