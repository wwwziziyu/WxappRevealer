"use strict";

// src/unpacker/wxapkgReader.js
const fs = require('fs');
function readWxapkg(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer[0] !== 0xbe || buffer[buffer.length - 1] !== 0xed) {
    throw new Error('不是有效的 .wxapkg 包');
  }
  const infoListLen = buffer.readUInt32LE(5);
  const infoBuf = buffer.slice(13, 13 + infoListLen);
  const entries = JSON.parse(infoBuf.toString('utf8'));
  const dataStart = 13 + infoListLen;
  return entries.map(e => {
    const start = dataStart + e.offset;
    return {
      filename: e.filename,
      content: buffer.slice(start, start + e.length)
    };
  });
}
module.exports = readWxapkg;