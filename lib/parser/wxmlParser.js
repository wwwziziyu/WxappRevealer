"use strict";

// src/parser/wxmlParser.js
const htmlparser2 = require('htmlparser2');
function parseWXML(content) {
  return htmlparser2.parseDocument(content, {
    xmlMode: true
  });
}
module.exports = {
  parseWXML
};