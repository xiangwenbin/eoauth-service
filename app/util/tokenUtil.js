import _ from 'lodash';
import UUID from 'node-uuid';
import tokenUtil from "oauth2-server/lib/utils/token-util.js";

class TokenUtil {
    static accessTokenExpiresTime = 3600; //1 hour
    static refreshTokenExpiresTime = 604800 ;// 1 week

    static getAccessTokenExpiresTime = function() {
        let expires = new Date();

        expires.setSeconds(expires.getSeconds() + TokenUtil.accessTokenExpiresTime);

        return expires.getTime();
    }
    static getRefreshTokenExpiresTime = function() {
        let expires = new Date();

        expires.setSeconds(expires.getSeconds() + TokenUtil.refreshTokenExpiresTime);

        return expires.getTime();
    }

    static generateRandomToken() {
        return tokenUtil.generateRandomToken();
    }
    
    

}
export default TokenUtil;