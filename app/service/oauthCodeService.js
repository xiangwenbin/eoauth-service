import rp from 'request-promise';
import _ from 'lodash';
import { OauthCode } from '../sequelize/model';


/**
 * 授权码服务
 */
class OauthCodeService {

    /**
     * 创建授权码
     */
    static createOauthCode(oauthCode) {
        return OauthCode.create(oauthCode, {
            fields: [
                "code", "clientId", "userId", "expiresTime","scope"
            ]
        },{

        });
    }

    /**
     * 更新授权码
     */
    static updateOauthCode(oauthCode) {
        return OauthCode.update(oauthCode, {
            where: {
                id: oauthCode.id
            },
            fields: [
                "code", "clientId", "userId", "expiresTime","scope"
            ]
        },{
        });
    }

    /**
     * 获取授权码对象
     */
    static getOauthCodeByCode(code) {
        return OauthCode.findOne({
            where: {
                code: code
            }
        });
    }
}

export default OauthCodeService;