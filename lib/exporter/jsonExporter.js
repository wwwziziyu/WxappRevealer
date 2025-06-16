"use strict";

// src/exporter/jsonExporter.js
const {
  writeFileSafe
} = require('../utils/fsHelper');
const path = require('path');
async function exportJSON(inputFile) {
  const data = require(path.resolve(inputFile));
  await writeFileSafe('analysis.json', JSON.stringify(data, null, 2));
}
module.exports = {
  export: exportJSON
};