"use strict";

// src/parser/jsParser.js
const acorn = require('acorn');
function parseJS(content) {
  return acorn.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true
  });
}
module.exports = {
  parseJS
};