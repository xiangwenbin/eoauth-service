import _ from 'lodash';
import CONFIG from '../config.js';
import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';
import { oauth } from '../koa2-oauth';
import { UserService, ClientService, OauthTokenService } from '../service';
import ERROR from "../const/error.js";
const log = log4js.getLogger('DEBUG');
const OauthRouter = router();

// 授权路由


/**
 * 
 * 通过授权码或者refreshToken 获取访问token
 * Content-type application/x-www-form-urlencoded
 * @param  client_id
 * @param  client_secret
 * @param  grant_type authorization_code||refresh_token
 * @param  code
 * @param  scope all
 */
OauthRouter.post('/oauth/token', oauth.token(), (ctx, next) => {
    return ctx.body = JSON.stringify(Util.getSuccJsonResult(ctx.body));
});

/**
 * 
 * 通过accessToken获取token对象
 */
OauthRouter.get('/oauth/accessToken/:accessToken', async(ctx, next) => {
    let accessToken = ctx.params.accessToken;

    let oauthToken = await OauthTokenService.getByAccessToken(accessToken).then((result) => {

        return result ? result.get({ plain: true }) : null;
    });


    if (!oauthToken) {
        return ctx.throw(ERROR.TOKEN_ACCESSTOKENNOTEXSIT.code, ERROR.TOKEN_ACCESSTOKENNOTEXSIT.msg);
    } else {
        return ctx.body = JSON.stringify(Util.getSuccJsonResult(oauthToken));
    }
});

/**
 * 
 * 通过refreshToken获取token对象
 */
OauthRouter.get('/oauth/refreshToken/:refreshToken', async(ctx, next) => {
    let refreshToken = ctx.params.refreshToken;

    let oauthToken = await OauthTokenService.getByRefreshToken(refreshToken).then((result) => {

        return result ? result.get({ plain: true }) : null;
    });

    if (!oauthToken) {
        return ctx.throw(ERROR.TOKEN_REFRESHTOKENNOTEXSIT.code, ERROR.TOKEN_REFRESHTOKENNOTEXSIT.msg);
    } else {
        return ctx.body = JSON.stringify(Util.getSuccJsonResult(oauthToken));
    }
});


export default OauthRouter;