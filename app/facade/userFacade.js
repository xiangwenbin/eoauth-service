import { UserService, UserInfoService } from '../service';
import OauthTokenFacade from './oauthTokenFacade';
import sequelize from '../sequelize/sequelize';
import TokenUtil from '../util/tokenUtil';
class UserFacade {
    /**
     * 创建用户的同时创建用户信息表
     */
    static createUser(user) {
        return sequelize.transaction((t) => {
            return UserService.createUser(user).then(async(u) => {
                let _u = u.get({
                    plain: true
                });
                delete _u.password;
                let _ui = user.userInfo || {};
                _ui.userId = _u.id;
                _ui = await UserInfoService.createUserInfo(_ui).then((ui) => {
                    return ui.get({
                        plain: true
                    });
                });
                _u.userInfo = _ui;
                return _u;
            });
        });
    }

    /**
     * 注册用户同时登录
     */
    static createUserAndLogin(user, client) {
        if (user.mobile) {
            user.areaCode = "+86";
        }
        return sequelize.transaction((t) => {
            return UserService.createUser(user).then(async(u) => {
                let _u = u.get({
                    plain: true
                });
                delete _u.password;
                let _ui = user.userInfo || {};
                _ui.userId = _u.id;
                _ui = await UserInfoService.createUserInfo(_ui).then((ui) => {
                    return ui.get({
                        plain: true
                    });
                });

                _u.userInfo = _ui;
                //generate token
                let oauthToken = {
                    accessToken: await TokenUtil.generateRandomToken(),
                    refreshToken: await TokenUtil.generateRandomToken(),
                    userId: _u.id,
                    clientId: client.id,
                    accessTokenExpiresTime: TokenUtil.getAccessTokenExpiresTime(),
                    refreshTokenExpiresTime: TokenUtil.getRefreshTokenExpiresTime()
                };


                oauthToken = await OauthTokenFacade.revokeAndSave(oauthToken).then((result) => {
                    return result;
                });
                delete oauthToken.accessTokenExpiresAt;
                delete oauthToken.refreshTokenExpiresAt;
                return { user: _u, token: oauthToken };
            });
        });
    }

    /**
     * 通过 用户认证信息查询用户
     * @param {User} user 
     */
    static getUserByCredentials(user) {
        if (user.username) {
            return UserService.getUserByUserNameAndPassword(user);
        } else if (user.mobile) {
            return UserService.getUserByMobileAndPassword(user);
        } else if (user.email) {
            return UserService.getUserByEmailAndPassword(user);
        }
    }

    /**
     * 通过 用户认证信息查询用户
     * @param {User} user 
     */
    static getUserByUsernames(user) {
        if (user.username) {
            return UserService.getUserByUsername(user.username);
        } else if (user.mobile) {
            return UserService.getUserByMobile(user.mobile);
        } else if (user.email) {
            return UserService.getUserByEmail(user.email);
        }
    }
}

export default UserFacade;