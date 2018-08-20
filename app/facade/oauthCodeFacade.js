import { UserService, UserInfoService, ClientService, OauthCodeService } from '../service';
import sequelize from '../sequelize/sequelize';

class OauthCodeFacade {
    /**
     * 获取完整的授权码信息（含用户，客户端信息）
     */
    static getCompleteOauthCode(code) {
        return OauthCodeService.getOauthCodeByCode(code).then(async(result) => {
            let oauthCode = result == null ? null : result.get({
                plain: true
            });
            if (oauthCode) {
                await Promise.all([
                    UserService.getUserById(oauthCode.userId),
                    ClientService.getClientById(oauthCode.clientId)
                ]).then((results) => {
                    oauthCode.user = results[0] ? results[0].get({
                        plain: true
                    }) : null;
                    oauthCode.client = results[1] ? results[1].get({
                        plain: true
                    }) : null;
                    return oauthCode;
                })
            }
            return oauthCode;
        });
    }
}

export default OauthCodeFacade;