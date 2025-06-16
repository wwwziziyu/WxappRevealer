"use strict";

// src/parser/wxssParser.js
const css = require('css');
function parseWXSS(content) {
  try {
    return css.parse(content);
  } catch {
    return null;
  }
}
module.exports = {
  parseWXSS
};