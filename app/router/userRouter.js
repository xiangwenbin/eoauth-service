import _ from 'lodash';
import CONFIG from '../config.js';
import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';
import { oauth } from '../koa2-oauth';
import { UserService, ClientService } from '../service';
import REGULAR from "../const/regular";
import { UserFacade, ClientFacade } from '../facade';
const log = log4js.getLogger('DEBUG');
const UserRouter = router();

UserRouter.get('/user/:userId', async(ctx, next) => {
    let userId = ctx.params.userId;
    let user = await UserService.getUserById(userId).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));
});
UserRouter.post('/user/:userId/bind/mobile/:mobile', async(ctx, next) => {
    let userId = ctx.params.userId;
    let mobile = ctx.params.mobile;
    if (!REGULAR.MOBILE.test(mobile)) {
        return ctx.throw(400, "该手机号非法");
    }
    let user = await UserService.getUserById(userId).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    let result = null;
    if (user == null) {
        return ctx.throw(400, "该用户不存在");
    } else if (user.mobile != null && user.mobile != "") {
        console.log("dddddddddddddddddddddddddd:" + user.mobile);
        return ctx.throw(400, "该用户已绑定手机号");
    } else {

        let userTemp = await UserService.getUserByMobile(mobile).then((result) => {
            return result == null ? null : result.get({
                plain: true
            });
        });
        if (userTemp) {
            return ctx.throw(400, "该手机号已经被绑定");
        }
        user.mobile = mobile;
        result = await UserService.updateUserById(user).then((result) => {
            return result;
        });
    }
    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));
});

/**
 * 通过用户名 手机号 邮箱获取用户
 */
UserRouter.get('/user/username/:username', async(ctx, next) => {
    let username = ctx.params.username;

    let credentials = {};
    if (REGULAR.MOBILE.test(username)) {
        credentials.mobile = username;
    } else if (REGULAR.EMAIL.test(username)) {
        credentials.email = username;
    } else if (REGULAR.USERNAME.test(username)) {
        credentials.username = username;
    } else {
        return ctx.throw(400, "用户名不合法");
    }
    //校验用户名唯一性
    let user = await UserFacade.getUserByUsernames(credentials).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));
});


export default UserRouter;