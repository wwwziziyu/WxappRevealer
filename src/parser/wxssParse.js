// src/parser/wxssParser.js
const css = require('css');

/**
 * 解析 WXSS 内容，返回带位置信息的 AST
 * @param {string} content      - WXSS 原始文本
 * @param {object} [opts={}]    - css.parse 可选配置
 * @returns {object|null}       - CSS AST 或 null（解析失败）
 */
function parseWXSS(content, opts = {}) {
  try {
    // 开启位置跟踪
    return css.parse(content, {
      source: opts.source || 'inline',
      silent: opts.silent || false,
      ...opts
    });
  } catch (err) {
    console.warn(`[wxssParser] 解析失败：${err.message}`);
    return null;
  }
}

module.exports = { parseWXSS };