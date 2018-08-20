import rp from 'request-promise';
import _ from 'lodash';
import { OauthToken } from '../sequelize/model';


/**
 * 授权码服务
 */
class OauthTokenService {

    /**
     * 创建授权码
     */
    static create(oauthToken) {
        return OauthToken.create(oauthToken, {
            fields: [
                "accessToken", "refreshToken", "clientId", "userId", "accessTokenExpiresTime", "refreshTokenExpiresTime"
            ]
        }, {

        });
    }

    /**
     * 查找并创建授权码
     */
    static findOrCreate(oauthToken) {
        return OauthToken.findOrCreate({
            fields: [
                "accessToken", "refreshToken", "clientId", "userId", "accessTokenExpiresTime", "refreshTokenExpiresTime"
            ],
            where: {
                clientId: oauthToken.clientId,
                userId: oauthToken.userId
            },
            defaults: oauthToken
        });
    }


    /**
     * 更新授权码
     */
    static update(oauthToken) {
        return OauthToken.update(oauthToken, {
            where: {
                userId: oauthToken.userId,
                clientId: oauthToken.clientId
            }
        }, {});
    }

    /**
     * revoke授权码
     */
    static revokeByClientIdAndUserId(clientId, userId) {
        let time = Date.now();
        return OauthToken.update({
            accessTokenExpiresTime: time,
            refreshTokenExpiresTime: time
        }, {
            where: {
                clientId: clientId,
                userId: userId,
                accessTokenExpiresTime: {
                    $gt: time
                },
                refreshTokenExpiresTime: {
                    $gt: time
                }
            }
        }, {

        });
    }

    /**
     * 通过 refreshToken 移除 token
     * @param {String} refreshToken 
     */
    static revokeByRefreshToken(refreshToken) {
        let time = Date.now();
        return OauthToken.update({
            accessTokenExpiresTime: time,
            refreshTokenExpiresTime: time
        }, {
            where: {
                refreshToken: refreshToken
            }
        }, {

        });
    }

    /**
     * 获取授权码对象
     */
    static getByClientIdAndUserId(clientId, userId) {
        return OauthToken.findOne({
            where: {
                clientId: clientId,
                userId: userId
            }
        });
    }

    /**
     * 获取token对象
     */
    static getByAccessToken(accessToken) {
        return OauthToken.findOne({
            where: {
                accessToken: accessToken
            }
        });
    }

    /**
     * 获取token对象
     */
    static getByRefreshToken(refreshToken) {
        return OauthToken.findOne({
            where: {
                refreshToken: refreshToken
            }
        });
    }
}

export default OauthTokenService;