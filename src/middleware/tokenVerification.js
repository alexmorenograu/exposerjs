import jwt from 'jsonwebtoken';
import { use, list, exposer } from '../core/methods.js';
import UNAUTHORIZED from '../errors/unauthorized.js';

export default async (req, res, next) => {
    if (!global.CONFIG.tokenVerify) return next();
    if (typeof global.CONFIG.tokenVerify == 'function') {
        global.CONFIG.tokenVerify(req, res, next, exposer)
        return next();
    }
    if (['/api/users/signIn', '/api/users/signUp'].includes(req.originalUrl.split('?')[0])) return next()
    const token = req?.query?.token ?? req.header('Authorization')

    try {
        req.accessUser = await exposer.user.tokenVerify({ exposer }, token)
    }
    catch (e) {
        console.log(e, UNAUTHORIZED)
        return res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED);
    }

    next();
}

use({
    model: 'user',
    tokenData: (ctx, token) => {
        return jwt.verify(token, global.CONFIG.tokenKey, { algorithm: 'HS256' })
    }
});



