global.NODE_ENV=process.env.NODE_ENV = !process.env.NODE_ENV ? "production" : process.env.NODE_ENV;
// var ora = require('ora')
// var spinner = ora('starting service ...')
// spinner.start()
console.log("starting service ...");
/**
 * 使用babel支持es6语法
 */
require("babel-register");
/**
 * async await 的支持
 */
require("babel-polyfill");
require("./app/app.js");
// spinner.stop()