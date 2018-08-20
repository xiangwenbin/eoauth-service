global.NODE_ENV=process.env.NODE_ENV = !process.env.NODE_ENV ? "dev" : process.env.NODE_ENV;

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