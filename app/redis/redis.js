import CONFIG from '../config.js';
import Redis from "redis";
import bluebird from 'bluebird';
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
let r = CONFIG.redis;
const redisClient = Redis.createClient(r.port, r.host, {
    password: r.password,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return new Error('connecte beyond 10 times');
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});
// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset("hash key", {}, redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.expire('string key', 30)
redisClient.on("error", function(err) {
    console.log("Error " + err);
});
export default redisClient;