// src/parser/jsParser.js
const acorn = require('acorn');
const logger = require('../utils/logger');

/**
 * 严格解析 JS，遇错抛出
 * @param {string} content 要解析的 JS 源码
 * @returns {import('acorn').Node} AST
 */
function parseJS(content) {
  return acorn.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true
  });
}

/**
 * 安全解析 JS，遇语法错误跳过
 * @param {string} content 要解析的 JS 源码
 * @param {string} filePath 文件路径，用于日志输出
 * @returns {import('acorn').Node|null} AST 或 null
 */
function safeParseJS(content, filePath) {
  try {
    return parseJS(content);
  } catch (e) {
    logger.debug(`[parser] 跳过无法解析的 JS: ${filePath}，错误: ${e.message}`);
    return null;
  }
}

module.exports = { parseJS, safeParseJS };