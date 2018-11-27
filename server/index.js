//服务端 es6 支持 (安装 es-checker插件检测 当前nodejs对es6的支持性)

let fs = require('fs');

//读文件操作是相对于项目根路径
let babelConfig = JSON.parse(fs.readFileSync('./.babelrc'));

require("babel-register")(babelConfig);

let server;
//使用 require可以让 app.js 支持 es6的语法
server = require("./app.js");

module.exports = server;














