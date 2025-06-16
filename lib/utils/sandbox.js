"use strict";

// src/utils/sandbox.js
const vm = require('vm');

/**
 * 简易沙箱执行：对离线脚本做超时保护
 * @param {string} code 
 * @param {number} timeout ms 
 */
function runInSandbox(code, timeout = 1000) {
  const script = new vm.Script(code, {
    timeout
  });
  const context = vm.createContext({}); // 空上下文
  return script.runInContext(context, {
    timeout
  });
}
module.exports = {
  runInSandbox
};