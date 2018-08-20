import CONFIG from '../config.js';
import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';
// import log4js from '../log4js';
// const log = log4js.getLogger("DEBUG");
// 创建事务命名空间
let namespace = cls.createNamespace('my-oauth-sequelize-transaction');
let ds = CONFIG.datasource;
Sequelize.cls = namespace;
var sequelize = new Sequelize(ds.database, ds.username, ds.password, {
    host: ds.host,
    dialect: 'mysql',
    pool: {
        maxConnections: ds.pool.max,
        minConnections: ds.pool.min,
        maxIdleTime: ds.pool.idle,
        max: ds.pool.max,
        min: ds.pool.min,
        idle: ds.pool.idle
    },
    logging: ds.logging ? console.log : false
});
export default sequelize;