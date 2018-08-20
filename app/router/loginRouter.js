import router from 'koa-router';
import Util from '../util/util';
import TokenUtil from '../util/tokenUtil';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const LoginRouter = router();
import { UserService } from '../service';
import { UserFacade, ClientFacade, OauthTokenFacade } from '../facade';
import ERROR from "../const/error.js";
// import redisClient from "../redis/redis";
import REGULAR from "../const/regular";


/**
 * 异步登录验证 获取token信息
 * @param{Object} credentials
 * @return{Result} 
 */
LoginRouter.post('/login/token', async(ctx) => {
    const requestBody = ctx.request.body;
    let username = requestBody.username;
    let clientId = requestBody.clientId;
    let clientSecret = requestBody.clientSecret;
    let weekLogin = !!requestBody.weekLogin;
    let credentials = {
        password: requestBody.password
    };
    //用户名校验 
    if (!clientId) {
        return ctx.throw(ERROR.CLIENT_IDNOTNULL.code, ERROR.CLIENT_IDNOTNULL.msg);
    } else if (!clientSecret) {
        return ctx.throw(ERROR.CLIENT_SECRETNOTNULL.code, ERROR.CLIENT_SECRETNOTNULL.msg);
    }
    if (REGULAR.MOBILE.test(username)) {
        credentials.mobile = username;
    } else if (REGULAR.EMAIL.test(username)) {
        credentials.email = username;
    } else if (REGULAR.USERNAME.test(username)) {
        credentials.username = username;
    } else {
        return ctx.throw(400, "用户名不合法");
    }

    let user = await UserFacade.getUserByCredentials(credentials).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    if (!user) {
        let msg = ERROR.USERNAME_PASSWORD.msg;
        user = credentials.mobile != null ? await UserService.getUserByMobile(credentials.mobile).then((result) => {
            if (!result) {
                msg = `该手机号未注册`;
            } else {
                return null;
            }
        }) : null;

        //校验用户名唯一性
        user = credentials.username != null ? await UserService.getUserByUsername(credentials.username).then((result) => {
            if (!result) {
                msg = `该帐号未注册`;
            } else {
                return null;
            }
        }) : null;

        //校验email唯一性
        user = credentials.email != null ? await UserService.getUserByEmail(credentials.email).then((result) => {
            if (!result) {
                msg = `该邮箱未注册`;
            } else {
                return null;
            }
        }) : null;

        return ctx.throw(ERROR.USERNAME_PASSWORD.code, msg);
    }

    // look up client id

    let client = await ClientFacade.getClientByClientIdAndSecret(clientId, clientSecret).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    console.log(client);
    if (!client) {
        return ctx.throw(ERROR.CLIENT_NOTEXSIT.code, ERROR.CLIENT_NOTEXSIT.msg);
    }

    //generate token
    let oauthToken = {
        accessToken: await TokenUtil.generateRandomToken(),
        refreshToken: await TokenUtil.generateRandomToken(),
        userId: user.id,
        clientId: client.id,
        accessTokenExpiresTime: weekLogin ? TokenUtil.getRefreshTokenExpiresTime() : TokenUtil.getAccessTokenExpiresTime(),
        refreshTokenExpiresTime: TokenUtil.getRefreshTokenExpiresTime()
    };


    oauthToken = await OauthTokenFacade.revokeAndSave(oauthToken).then((result) => {
        return result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult({
        user: user,
        token: oauthToken
    }));

});

/**
 * 通过手机号获取用户及token
 */
LoginRouter.get('/login/mobile/token/:clientId/:mobile', async(ctx) => {
    const requestBody = ctx.request.body;
    let clientId = ctx.params.clientId;
    let mobile = ctx.params.mobile;

    // look up client id

    let client = await ClientFacade.getClientByClientIdAndSecret(clientId).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });


    if (!client) {
        return ctx.throw(ERROR.CLIENT_NOTEXSIT.code, ERROR.CLIENT_NOTEXSIT.msg);
    }

    let user = await UserService.getUserByMobile(mobile).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    if (!user) {
        return ctx.throw(ERROR.MOBILE_NOTEXIST.code, ERROR.MOBILE_NOTEXIST.msg);
    }


    //generate token
    let oauthToken = {
        accessToken: await TokenUtil.generateRandomToken(),
        refreshToken: await TokenUtil.generateRandomToken(),
        userId: user.id,
        clientId: client.id,
        accessTokenExpiresTime: TokenUtil.getAccessTokenExpiresTime(),
        refreshTokenExpiresTime: TokenUtil.getRefreshTokenExpiresTime()
    };

    oauthToken = await OauthTokenFacade.revokeAndSave(oauthToken).then((result) => {
        return result;
    });

    delete oauthToken.accessTokenExpiresAt;
    delete oauthToken.refreshTokenExpiresAt;

    return ctx.body = JSON.stringify(Util.getSuccJsonResult({
        user: user,
        token: oauthToken
    }));

});


export default LoginRouter;