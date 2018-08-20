/**
 * 服务启动入口
 * convert 包的作用 转换过时的generator中间件到anync中间件，如kao-static,koa-logger 
 */
import CONFIG from './config.js';
import Koa from 'koa';
import convert from 'koa-convert';
import logger from 'koa-logger';
import koaStatic from 'koa-static';
import path from 'path';
import { argv } from 'optimist';

import { TestRouter, LoginRouter, OauthRouter, UserRouter, SignUpRouter, IndexRouter } from './router';
import koaBody from './filter/koa-body';
import bodyParser from 'body-parser';
import Util from './util/util';

import log4js from './log4js';
import co from 'co';
import render from 'koa-ejs';
// import nunjuck from 'koa2-nunjucks/lib/index.js';
import nunjucks from 'nunjucks';
import Eureka from 'eureka-js-client';
import ip from "ip";
import sleep from "sleep";
const app = new Koa();
const log = log4js.getLogger("DEBUG");


//获取启动入参 node index.js --ip 127.0.0.1
// log.debug("argv:", argv);

// if (!argv.ip) {
//     var os = require('os');
//     var ifaces = os.networkInterfaces();
//     for (var dev in ifaces) {
//         ifaces[dev].forEach(function (details) {
//             //获取本地无线的ip
//             if (details.family == 'IPv4' && (dev.toLowerCase() == "wlan")) {
//                 argv.ip = details.address;
//             }
//         });
//     }
//     log.debug("argv.ip", argv.ip);
// }

//NODE_ENV dev ,test,production defualt dev
let _ip = ip.address();
log.debug("local ip:" + _ip);
log.debug("NODE_ENV:" + process.env.NODE_ENV);
log.debug("启动目录:" + __dirname);



/**
 * 设置静态文件目录
 * 
 */
log.debug("设置静态文件目录:/public");
app.use(convert(koaStatic('public', { maxage: 365 * 24 * 60 * 60 })));


/**
 * 异常处理
 * 
 */
app.use(async(ctx, next) => {
    try {
        ctx.set('Cache-Control', 'no-cache');
        ctx.set('Content-Type', 'application/json');
        await next();

    } catch (err) {
        // await sleep.sleep(60000);
        log.error(err);
        err.status = err.statusCode || err.status || 500;
        ctx.status = 200;
        ctx.body = JSON.stringify({ code: err.status, msg: err.message || '服务器异常' });
    }
});

/**
 * 访问日志 
 * 
 */
// app.use(log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO }));
log.debug("设置访问日志");
app.use(convert(logger()));







/**
 * 使用 自定义koabody中间件 提取body信息
 * 
 */
log.debug("设置request body filter");
app.use(koaBody());

/**
 * 请求路由
 * 
 */
// app.use(bodyParser.text({type: 'application/graphql'}));
log.debug("设置请求路由");

app.use(IndexRouter.routes());
app.use(TestRouter.routes());
app.use(LoginRouter.routes());
app.use(OauthRouter.routes());
app.use(UserRouter.routes());
app.use(SignUpRouter.routes());


/**
 * 默认404请求返回值
 * 
 */
app.use((ctx) => {
    ctx.body = JSON.stringify({ code: 404, msg: '404' });
});


app.on('error', (err, ctx) => {
    log.error('服务异常：', err, ctx);
});

app.listen(CONFIG.server.port, () => log.debug(`server started ${CONFIG.server.port}`));


//Eureka 服务注册
global.eurekaClient = new Eureka({
    cwd: __dirname,
    instance: {
        ipAddr: _ip || '127.0.0.1',
        // hostName: _ip || '127.0.0.1',
        statusPageUrl: `http://${_ip}:${CONFIG.server.port}/info`,
        port: {
            '$': CONFIG.server.port,
            '@enabled': 'true'
        }
    }
});
//心跳
// eurekaClient.on("heartbeat", () => {
//   console.log("heartbeat", eurekaClient.cache);
// });
eurekaClient.start();

//进程退出事件
process.on('exit', () => {
    log.error("进程终止");
});