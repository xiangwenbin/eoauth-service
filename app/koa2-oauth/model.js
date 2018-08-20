// import log.debug from 'log.debug';
import _ from 'lodash';
import log4js from '../log4js';
// import db from './db';
import { UserService, ClientService, OauthCodeService, OauthTokenService } from '../service';
import { UserFacade, ClientFacade, OauthTokenFacade } from '../facade';
const log = log4js.getLogger('DEBUG');
var model = {};


model.getClient = async(clientId, secret) => {

    log.debug(`Looking up client ${clientId}:${secret}`);
    let client = await ClientFacade.getClientByClientIdAndSecret(clientId, secret).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    return client;
};

// /**
//  * 授权码授权未用到
//  */
// model.getUser = async(username, password) => {

//     log.debug(`Looking up user ${username}:${password}`);
//     let user = await UserService.getUserByUserNameAndPassword(username, password).then((result) => {
//         return result == null ? null : result.get({
//             plain: true
//         });
//     });
//     return user;
//     // return db.users.find((user) => {
//     //     return user.username === username && user.password === password;
//     // });
// };

// In the client credentials grant flow, the client itself needs to be related
// with some form of user representation
// model.getUserFromClient = (client) => {
//     log.debug(`Looking up user for client ${client.name}`);
//     return { name: client.name, isClient: true };
// };

// Performs a lookup on the provided string and returns a token object
model.getAccessToken = async(accessToken) => {
    log.debug(`Get access token ${accessToken}`);

    let oauthToken = await OauthTokenService.getByAccessToken(accessToken).then((result) => {

        return result ? result.get({ plain: true }) : null;
    });



    if (!oauthToken) {
        return false;
    }

    oauthToken.user = {
        id: oauthToken.userId
    }
    oauthToken.client = {
        id: oauthToken.clientId
    }
    return oauthToken;
};

// Performs a lookup on the provided string and returns a token object
model.getRefreshToken = async(refreshToken) => {

    log.debug(`Get refresh token ${refreshToken}`);

    let oauthToken = await OauthTokenService.getByRefreshToken(refreshToken).then((result) => {
        return result ? result.get({ plain: true }) : null;
    });

    if (!oauthToken) {
        return false;
    }

    oauthToken.user = {
        id: oauthToken.userId
    }

    oauthToken.client = {
        id: oauthToken.clientId
    }
    return oauthToken;
};


// Saves the newly generated token object
// token = {
//         accessToken: accessToken,
//         authorizationCode: authorizationCode,
//         accessTokenExpiresAt: accessTokenExpiresAt,
//         refreshToken: refreshToken,
//         refreshTokenExpiresAt: refreshTokenExpiresAt,
//         scope: scope
// };

model.saveToken = async(token, client, user) => {
    log.debug(`Save token ${token.accessToken} ${token.refreshToken}`);


    let oauthToken = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        userId: user.id,
        clientId: client.id,
        accessTokenExpiresTime: token.accessTokenExpiresAt.getTime(),
        refreshTokenExpiresTime: token.refreshTokenExpiresAt.getTime()
    };
    oauthToken = await OauthTokenFacade.revokeAndSave(oauthToken).then((result) => {
        return result;
    });

    token = _.merge(token, oauthToken, {
        user: {
            id: user.id
        },
        client: {
            id: client.id
        }
    });

    return token;
};

/**
 *  refresh token 钩子
 *  @param {OauthToken} token
 */
model.revokeToken = async(token) => {

    log.debug(`Revoke token ${token.refreshToken}`);

    let oauthToken = await OauthTokenService.revokeByRefreshToken(token.refreshToken).then(async(result) => {
        if (result) {
            return await OauthTokenService.getByRefreshToken(token.refreshToken).then((result) => {
                return result ? result.get({ plain: true }) : null;
            });
        } else {
            return null
        }
    });

    return oauthToken;
};

// Retrieves an authorization code  object
model.getAuthorizationCode = async(code) => {
    log.debug(`Retrieving authorization code ${code}`);
    let oauthCode = await OauthCodeService.getOauthCodeByCode(code).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });

    if (oauthCode) {
        oauthCode.user = { id: oauthCode.userId };
        oauthCode.client = { id: oauthCode.clientId };
    }

    return oauthCode;
};

// Saves the newly generated authorization code object
model.saveAuthorizationCode = async(code, client, user) => {
    log.debug(`Saving authorization code ${code.authorizationCode}`);

    let oauthCode = await OauthCodeService.createOauthCode({
        code: code.authorizationCode,
        clientId: client.id,
        userId: user.id,
        scope: code.scope,
        expiresTime: code.expiresAt.getTime()
    }).then((result) => {
        return result ? result.get({ plain: true }) : null;
    });

    code.user = user;
    code.client = client;
    return code;
};

// Revokes the authorization code after use - note ExpiresAt detail!
model.revokeAuthorizationCode = async(oauthCode) => {
    log.debug(`Revoking authorization code ${oauthCode.code}`);

    oauthCode.expiresTime = Date.now();
    let result = await OauthCodeService.updateOauthCode(oauthCode).then((result) => {
        return result;
    });

    if (!result) {
        return false;
    } else
        return oauthCode;
};

// Called in `authenticate()` - basic check for scope existance
// `scope` corresponds to the oauth server configuration option, which
// could either be a string or boolean true.
// Since we utilize router-based scope check middleware, here we simply check
// for scope existance.
model.verifyScope = (token, scope) => {
    log.debug(`Verify scope ${scope} in token ${token.accessToken}`);
    if (scope && !token.scope) { return false; }
    return token;
};

// Can be used to sanitize or purely validate requested scope string
model.validateScope = (user, client, scope) => {
    log.debug(`Validating requested scope: ${scope}`);

    const validScope = (scope || '').split(' ').filter((key) => {
        return client.validScopes.indexOf(key) !== -1;
    });
    if (scope && !validScope.length) {
        return false;
    } else if (validScope.length > 0) {
        return validScope.join(' ');
    } else {
        return true;
    }
};

export default model;