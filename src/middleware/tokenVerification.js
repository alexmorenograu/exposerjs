import jwt from 'jsonwebtoken';
import { use, list, exposer } from '../customRoutes.js';
import UNAUTHORIZED from '../errors/unauthorized.js';

export default async (req, res, next) => {
    if (!global.CONFIG.tokenVerify) return next();
    if (typeof global.CONFIG.tokenVerify == 'function') {
        global.CONFIG.tokenVerify(req, res, next, exposer)
        return next();
    }

    const token = req.header('Authorization')
    try {
        await tokenVerify({ exposer }, token)
    }
    catch (e) {
        return res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED);
    }
    next();
}

use({
    model: 'user',
    tokenData,
});

use({
    model: 'user',
    tokenVerify
});

function tokenData(ctx, token) {
    return jwt.verify(token, global.CONFIG.tokenKey, { algorithm: 'HS256' })
}

async function tokenVerify(ctx, token) {
    if (!token) throw UNAUTHORIZED
    const tokenData = jwt.verify(token, global.CONFIG.tokenKey, { algorithm: 'HS256' })
    if (!tokenData.id) throw UNAUTHORIZED

    const userData = await ctx.exposer.user.findUnique({
        where: {
            id: tokenData.id
        }
    });
    if (!userData.id) throw UNAUTHORIZED

    const userToken = await ctx.exposer.usertoken.findUnique({
        where: {
            userfk: tokenData.id
        }
    });
    if (userToken.token != auth.token) throw UNAUTHORIZED

}

