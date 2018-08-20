# 用户授权平台

## 简介

* 后端框架:node  koa2(mvc) sequelize(orm) oauth2-server(中间件)
* 缓存: node_redis
* 数据库：mysql
* 前端语言: es6+vue2
* 前端打包工具:webpack
* 开发工具:Visual Studio Code(推荐)

##  Node版本
- ^v6.2.2

## 安装本地环境
- npm install -g node-dev nodedev babel babel-cli

## 项目初始化
- npm install 

## 开发环境启动
- node dev

## 测试机环境
- node test

## 依赖包说明
- transform-strict-mode （由于很多 ES 特性需要 严格模式才能打开， 添加这个插件就会自动在所有文件上添加 'use strict';）
- transform-es2015-modules-commonjs （将 ES6 模块标准 转换成 Node.js 用的 CMD 模块标准）
- transform-es2015-spread （支持 ES6 的 spread 操作符）
- transform-es2015-destructuring （支持 赋值解构）
- transform-es2015-parameters （支持默认参数， 参数解构， 以及其他参数）

## node app服务 目录结构说明 
	app   nodejs  根目录

         -compose 组合服务 组合复杂外观服务
		 
         -const  常量目录

		 -facade 外观服务 对单一service服务 的封装 
		
		 -filter 过滤器 koa中间件存放目录
		
         -koa2-oauth oauth2 koa 中间件
		
		 -router 路由 客户端调用的异步接口目录

         -sequelize  orm框架目录
            -model  orm dto 数据模型
		
		 -service 基础服务 遵循单一原则

		 -template 客户端页面模版文件目录

		 -util 公共类


## 一些命名规范
- 所有js文件首字母小写
- js中导出的对象 即export Object  首字母必须大写
- 使用import 导入包的时候，如果导出包为类 变量名为首字母大写，如果导出的包为函数，则首字母小写
例
<pre>
<code>
import Koa from 'koa';
import convert from 'koa-convert';
</code>
</pre>

## 接口规范
- 接口一律返回 json格式
<pre>
<code>
{
	code:200,//请求状态码
	data:[]||{},//数据 可以是数组，可以是对象
	msg:"",// 提示信息
	ext:null //扩展信息
}
</code>
</pre>

## 容器打包及启动命令
- 使用镜像启动服务，必须指定--env NODE_ENV 环境变量(dev(默认),test,production)
<pre>
<code>
  docker build -t 10.0.101.33:80/library/eoauth-service:1.0.0 .
  docker push 10.0.101.33:80/library/eoauth-service:1.0.0
  docker pull 10.0.101.33:80/library/eoauth-service:1.0.0
  docker run --env NODE_ENV=production --name eoauth-service -d -p 8080:8080 --net br0 -v /home/logs/eoauth-service:/urs/local/www/eoauth-service/logs 10.0.101.33:80/library/eoauth-service:1.0.0
</code>
</pre>
## 资料
- request-promise https://www.npmjs.com/package/request-promise
- Sequelize 中文API文档 https://itbilu.com/nodejs/npm/V1PExztfb.html
- Redis https://github.com/NodeRedis/node_redis
- koa2 https://github.com/guo-yu/koa-guide
- oauth2-server https://github.com/oauthjs/node-oauth2-server/wiki/Migrating-from-2.x-to-3.x
- jscode http://usejsdoc.org/index.html
- nunjucks服务端模版渲染 https://mozilla.github.io/nunjucks/templating.html
- pm2 http://www.boiajs.com/2014/12/30/pm2-begin-nodejs-production
- swagger https://www.gitbook.com/book/huangwenchao/swagger/details http://swagger.io/specification http://editor.swagger.io/#/