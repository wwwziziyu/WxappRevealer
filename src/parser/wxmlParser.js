// src/parser/wxmlParser.js
const htmlparser2 = require('htmlparser2');
const { DomUtils } = require('htmlparser2');

/**
 * 解析 WXML 文档，返回带位置信息的 DOM 树
 * @param {string} content      - WXML 原始文本
 * @param {object} [opts={}]    - htmlparser2 可选配置
 * @returns {object|null}       - htmlparser2.Document 或 null（解析失败）
 */
function parseWXML(content, opts = {}) {
  try {
    // 开启 xmlMode、保留属性大小写，并收集位置信息
    const dom = htmlparser2.parseDocument(content, {
      xmlMode: true,
      decodeEntities: true,
      lowerCaseAttributeNames: false,
      recognizeSelfClosing: true,
      ...opts
    });

    // 为每个元素节点注入位置信息
    DomUtils.findAll(node => node.startIndex != null && node.endIndex != null, dom)
      .forEach(node => {
        node.loc = {
          start: DomUtils.getStartIndex(node),
          end: DomUtils.getEndIndex(node)
        };
      });

    return dom;
  } catch (err) {
    console.warn(`[wxmlParser] 解析失败：${err.message}`);
    return null;
  }
}

module.exports = { parseWXML };