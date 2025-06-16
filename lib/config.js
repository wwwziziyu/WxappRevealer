"use strict";

// src/config.js
module.exports = {
  version: '1.0.0',
  sandbox: {
    timeout: 1000,
    memoryLimit: 64
  },
  output: {
    json: 'analysis.json',
    markdown: 'report.md'
  }
};