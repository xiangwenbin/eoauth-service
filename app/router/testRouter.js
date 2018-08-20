import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';


const TestRouter = router();
const log = log4js.getLogger('DEBUG');

/**
 * unit 测试路由
 */
TestRouter.get('/getTest', async(ctx, next) => {
    ctx.body = '{"code":"200","data":"test"}';
});

TestRouter.get('/info', (ctx, next) => {
    ctx.body = '{"status":"UP"}';
});

export default TestRouter;