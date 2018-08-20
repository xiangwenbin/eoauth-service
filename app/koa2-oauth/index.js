import KoaOAuthServer from './koaOAuthServer';
import model from './model';
const oauth = new KoaOAuthServer({
    // scope: true, // Alternatively string with required scopes (see verifyScope)
    scope:false,
    model: model,
    allowExtendedTokenAttributes:true,
    allowBearerTokensInQueryString: true,
    authorizationCodeLifetime:300, //5 min
    accessTokenLifetime: 3600,   // 1 hour
    refreshTokenLifetime: 604800 // 1 week
});
export {oauth};