import OAuthServer from 'oauth2-server';
import OAuthError from 'oauth2-server/lib/errors/oauth-error';
import InvalidScopeError from 'oauth2-server/lib/errors/invalid-scope-error';
import InvalidArgumentError from 'oauth2-server/lib/errors/invalid-scope-error';
import UnauthorizedRequestError from 'oauth2-server/lib/errors/invalid-scope-error';

import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const Request = OAuthServer.Request,
    Response = OAuthServer.Response;


class KoaOAuthServer {
    constructor(options) {
        this.options = options || {};

        if (!options.model) {
            throw new InvalidArgumentError('Missing parameter: `model`');
        }

        // If no `saveTokenMetadata` method is set via the model, we create
        // a simple passthrough mechanism instead
        this.saveTokenMetadata = options.model.saveTokenMetadata ?
            options.model.saveTokenMetadata :
            (token, data) => { return Promise.resolve(token); };

        // If no `checkScope` method is set via the model, we provide a default
        this.checkScope = options.model.checkScope ?
            options.model.checkScope :
            (scope, token) => { return token.scope.indexOf(scope) !== -1; }

        this.server = new OAuthServer(options);
    }

    // Returns token authentication middleware
    authenticate() {
        log.debug('Creating authentication endpoint middleware');
        return (ctx, next) => {
            log.debug('Running authenticate endpoint middleware');
            const request = new Request(ctx.request),
                response = new Response(ctx.response);

            return this.server
                .authenticate(request, response)
                .then((token) => {
                    ctx.state.oauth = { token: token };
                    return next();
                })
                .catch((err) => { handleError(err, ctx); });
        };
    }

    // Returns authorization endpoint middleware
    // Used by the client to obtain authorization from the resource owner
    authorize(options) {
        log.debug('Creating authorization endpoint middleware');
        return (ctx, next) => {
            log.debug('Running authorize endpoint middleware');
            const request = new Request(ctx.request),
                response = new Response(ctx.response);

            return this.server
                .authorize(request, response, options)
                .then((code) => {
                    ctx.state.oauth = { code: code };
                    return handleResponse(ctx, response);
                    // return next();
                })
                .catch((err) => { handleError(err, ctx); });
        };
    }

    // Returns token endpoint middleware
    // Used by the client to exchange authorization grant for access token
    token() {
        log.debug('Creating token endpoint middleware');
        return (ctx, next) => {
            log.debug('Running token endpoint middleware');
            const request = new Request(ctx.request),
                response = new Response(ctx.response);

            return this.server
                .token(request, response)
                .then((token) => {
                    return this.saveTokenMetadata(token, ctx.request);
                })
                .then((token) => {
                    ctx.state.oauth = { token: token };
                    handleResponse(ctx, response);
                    return next();
                })
                .catch((err) => { handleError(err, ctx); });
        };
    }

    // Returns scope check middleware
    // Used to limit access to a route or router to carriers of a certain scope.
    scope(required) {
        log.debug(`Creating scope check middleware (${required})`);
        return (ctx, next) => {
            const result = this.checkScope(required, ctx.state.oauth.token);
            if (result !== true) {
                const err = result === false ?
                    `Required scope: \`${required}\`` :
                    result;

                handleError(new InvalidScopeError(err), ctx);
                return;
            }

            return next();
        };
    }
}

function handleResponse(ctx, response) {
    log.debug(`Preparing success response (${response.status})`);
    ctx.set(response.headers);
    ctx.status = response.status;
    ctx.body = response.body;
}

// Add custom headers to the context, then propagate error upwards
function handleError(err, ctx) {
    log.debug(`Preparing error response (${err.code || 500})`);

    const response = new Response(ctx.response);
    ctx.set(response.headers);

    ctx.status = err.code || 500;
    throw err;
}

// Expose error classes
KoaOAuthServer.OAuthError = OAuthError;
KoaOAuthServer.InvalidScopeError = InvalidScopeError;
KoaOAuthServer.InvalidArgumentError = InvalidArgumentError;
KoaOAuthServer.UnauthorizedRequestError = UnauthorizedRequestError;

export default KoaOAuthServer;