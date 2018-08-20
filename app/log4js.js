/**
 * http://qianduan.guru/2016/08/21/nodejs-lesson-1-log4js/
 * 日志配置
 */
import log4js from 'log4js';
import CONFIG from './config.js';
log4js.configure({
    appenders: [
        {
            //默认输出路径
            type: 'console',
            level: 'DEBUG'
        },
        {
            type: 'dateFile',
            filename: `${CONFIG.logdir}/access`,
            maxLogSize: 20480,
            backups: 3,
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            level: 'INFO',
            category: "ACESS"
        },
        {
            type: 'dateFile',
            filename: `${CONFIG.logdir}/errors`,
            maxLogSize: 20480,
            backups: 3,
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            level: 'ERROR',
            category: "ERROR"
        },
        {
           
            type: 'dateFile',
            filename: `${CONFIG.logdir}/debugs`,
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            maxLogSize: 20480,
            backups: 3,
            level: 'DEBUG',
            category: "DEBUG"
        }
        // ,
        // {
        //     type: 'file',
        //     filename: 'logs/errors',
        //     maxLogSize: 20480,
        //     backups: 3,
        //     level: 'ERROR'
        // }
    ]
});
export default log4js