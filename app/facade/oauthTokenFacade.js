import { UserService, UserInfoService, ClientService, OauthCodeService, OauthTokenService } from '../service';
import sequelize from '../sequelize/sequelize';
import _ from 'lodash';
class OauthTokenFacade {

    
    /**
     * 移除并更新token
     */
    static revokeAndSave(token) {
        return sequelize.transaction((t) => {
            return OauthTokenService.findOrCreate(token).then(async([result, created]) => {
                let oauthToken = result.get({ plain: true });
                if (!created) {
                    await OauthTokenService.update(token).then((result) => {
                        return result;
                    });
                    return token;
                } else {
                    return result.get({ plain: true });
                }
            });
            //    return  OauthTokenService.revokeByClientIdAndUserId(token.clienId,token.userId).then(async () => {

            //         let oauthToken = await OauthTokenService.create(token).then((result) => {
            //             return result;
            //         });
            //         return oauthToken;
            //     });
        });
    }
}

export default OauthTokenFacade;