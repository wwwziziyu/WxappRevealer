"use strict";

// src/utils/logger.js
const chalk = require('chalk');
function info(msg) {
  console.log(chalk.blue('[INFO]'), msg);
}
function debug(msg) {
  if (process.env.DEBUG) {
    console.log(chalk.gray('[DEBUG]'), msg);
  }
}
function error(msg) {
  console.error(chalk.red('[ERROR]'), msg);
}
module.exports = {
  info,
  debug,
  error
};