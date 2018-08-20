import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const SignUpRouter = router();
import { UserService } from '../service';
import { UserFacade, ClientFacade } from '../facade';
import TokenUtil from '../util/tokenUtil';
import ERROR from "../const/error.js";
import REGULAR from "../const/regular";

/**
 * 通過手机号 ，用户名，邮箱 注册
 * 
 */
SignUpRouter.post('/signup/', async(ctx, next) => {
    let { username = null, mobile = null, email = null, password } = ctx.request.body;
    // console.log(body);
    if (!username && !mobile && !email) {
        ctx.throw(400, "注册信息不能为空");
    } else if (!password) {
        ctx.throw(400, "密码不能为空");
    }
    username = username == "" ? null : username;
    email = email == "" ? null : email;
    mobile = mobile == "" ? null : mobile;
    //校验手机号唯一性
    let user = null;

    user = mobile != null ? await UserService.getUserByMobile(mobile).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, `${mobile}已经被注册`);
        }
    }) : null;

    //校验用户名唯一性
    user = username != null ? await UserService.getUserByUsername(username).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, `${username}已经被注册`);
        }
    }) : null;

    //校验email唯一性
    user = email != null ? await UserService.getUserByEmail(email).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, `${email}已经被注册`);
        }
    }) : null;

    user = {
        mobile: mobile,
        username: username,
        email: email,
        password: password,
        userInfo: {

        }
    };


    user = await UserFacade.createUser(user).then((result) => {
        return result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));

});
/**
 * 通过用名，手机号，邮箱重置密码(有oldPassword ，先去校验oldPassword)
 */
SignUpRouter.post('/signup/resetPassword', async(ctx, next) => {
    let { username, password, oldPassword } = ctx.request.body;
    // console.log(body);
    let credentials = {
        password: oldPassword
    };
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
        if (!result) {
            ctx.throw(400, "该用户未注册");
        } else {
            return result.set("password", password, { plain: true });
        }
    });
    if (credentials.password)
        user = await UserFacade.getUserByCredentials(credentials).then((result) => {
            if (!result) {
                ctx.throw(400, "密码错误");
            } else {
                return result.set("password", password, { plain: true });
            }
        });
    // let user = await UserService.getUserByMobile(username).then((result) => {
    //     if (!result) {
    //         ctx.throw(400, "该手机号未注册");
    //     } else {

    //         return result.set("password", password, { plain: true });
    //     }
    // });


    let result = await UserService.updatePassword(user.get({ plain: true })).then((result) => {
        return result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult("succ"));

});


/**
 * 手机号注册请求
 */
SignUpRouter.post('/signup/mobile', async(ctx, next) => {
    let { mobile, password } = ctx.request.body;
    // console.log(body);

    console.log(mobile, password);
    //校验手机号唯一性
    let user = await UserService.getUserByMobile(mobile).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, `${mobile}已经被注册`);
        }
    });

    user = {
        mobile: mobile,
        password: password,
        userInfo: {

        }
    };


    user = await UserFacade.createUser(user).then((result) => {
        return result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));
});

/**
 * 手机号注册并返回user及token
 */
SignUpRouter.post('/signup/mobile/:clientId', async(ctx, next) => {
    let { mobile, password } = ctx.request.body;
    // console.log(body);
    let clientId = ctx.params.clientId;
    console.log(mobile, password);
    //校验手机号唯一性
    let user = await UserService.getUserByMobile(mobile).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, "该手机号已经被注册");
        }
    });

    user = {
        mobile: mobile,
        password: password,
        userInfo: {

        }
    };

    let client = await ClientFacade.getClientByClientIdAndSecret(clientId).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    if (client == null) {
        return ctx.throw(ERROR.CLIENT_NOTEXSIT.code, ERROR.CLIENT_NOTEXSIT.msg);
    }


    if (!REGULAR.MOBILE.test(mobile)) {
        return ctx.throw(400, "手机号不合法");
    }

    let result = await UserFacade.createUserAndLogin(user, client).then((result) => {
        return result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult(result));
});

/**
 * 用户名注册请求
 */
SignUpRouter.post('/signup/username', async(ctx, next) => {
    let { username, password } = ctx.request.body;

    //校验用户名唯一性
    let user = await UserService.getUserByUsername(username).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, `${username}已经被注册`);
        }
    });

    user = {
        username: username,
        password: password,
        userInfo: {

        }
    };

    user = await UserFacade.createUser(user).then((result) => {
        return result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));
});

/**
 * 手机号是否已经注册
 */
SignUpRouter.get('/signup/mobile/unique/:mobile', async(ctx, next) => {
    let mobile = ctx.params.mobile;
    //校验手机号唯一性
    let siguped = await UserService.getUserByMobile(mobile).then((result) => {
        return !!result;
    });

    return ctx.body = JSON.stringify(Util.getSuccJsonResult(siguped));

});


export default SignUpRouter;