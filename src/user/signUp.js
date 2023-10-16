
import jwt from 'jsonwebtoken';
import { use } from '../customRoutes.js';
import UNAUTHORIZED from '../errors/unauthorized.js';
import bcrypt from 'bcrypt';

use({
    model: 'user',
    accepts: {
        type: "object",
        properties: {
            name: { type: "string" },
            password: { type: "string" },
        },
        required: ["name", "password"],
    },
    returns: {
        type: "object"
    },
    http: {
        path: `/signUp`,
        verb: 'POST'
    },
    signUp: async (ctx, name, password) => {
        if (!id && !name) throw UNAUTHORIZED
        const userData = await ctx.exposer.user.findUnique({
            where: {
                name,
            },
        });
        if (userData?.id) throw UNAUTHORIZED;

        let user;
        await ctx.exposer.$transaction(async (tx) => {
            const userData = await tx.user.create({
                data: {
                    name,
                    password: await bcrypt.hash(password, 10),
                }
            });

            user = {
                id: userData.id,
                name,
            }

            const token = jwt.sign(user, global.CONFIG.tokenKey, { algorithm: 'HS256' });
            user.token = token;

            await tx.usertoken.create({
                data: {
                    userfk: userData.id,
                    token: token
                }
            });
        });

        return user;
    }
});