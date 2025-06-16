// src/unpacker/wxapkgReader.js
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * 读取并解析 .wxapkg 包（兼容典型 wxapkg 二进制格式）
 * @param {string} filePath wxapkg 文件路径
 * @returns {Array<{ filename: string, content: Buffer }>} 解包后的文件列表
 */
function readWxapkg(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  const buf = fs.readFileSync(filePath);
  const len = buf.length;

  // 校验 magic number
  if (len < 14 || buf.readUInt8(0) !== 0xBE || buf.readUInt8(13) !== 0xED) {
    throw new Error('不是有效的 .wxapkg 包（magic number 不匹配）');
  }

  // 读取元信息列表长度（4 bytes，Big Endian）
  const infoLen = buf.readUInt32BE(5);
  const listStart = 14;
  const listEnd = listStart + infoLen;
  if (listEnd > len) {
    throw new Error('包元信息列表超出范围');
  }

  const listBuf = buf.slice(listStart, listEnd);
  const fileCount = listBuf.readUInt32BE(0);
  let offset = 4;
  const entries = [];

  // 解析文件列表
  for (let i = 0; i < fileCount; i++) {
    if (offset + 8 > listBuf.length) {
      logger.warn(`[wxapkgReader] 文件列表截断，已解析 ${i} 条`);
      break;
    }
    const nameLen = listBuf.readUInt32BE(offset);
    offset += 4;
    if (offset + nameLen + 8 > listBuf.length) {
      logger.warn(`[wxapkgReader] 条目 ${i} 文件名或大小信息超出范围`);
      break;
    }
    const name = listBuf.toString('utf8', offset, offset + nameLen);
    offset += nameLen;
    const fileOff = listBuf.readUInt32BE(offset);
    offset += 4;
    const fileSize = listBuf.readUInt32BE(offset);
    offset += 4;
    entries.push({ name, off: fileOff, size: fileSize });
  }

  // 解包数据区
  const dataStart = listEnd;
  const result = [];
  for (const { name, off, size } of entries) {
    const start = dataStart + off;
    const end = start + size;
    if (end > len) {
      logger.warn(`[wxapkgReader] 跳过超出范围文件: ${name}`);
      continue;
    }
    const filename = name.startsWith('/') ? name.slice(1) : name;
    result.push({ filename, content: buf.slice(start, end) });
  }

  logger.debug(`[wxapkgReader] 成功解包 ${result.length}/${entries.length} 个文件`);
  return result;
}

module.exports = readWxapkg;