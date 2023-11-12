
import jwt from 'jsonwebtoken';
import { use } from '../customRoutes.js';
import UNAUTHORIZED from '../errors/unauthorized.js';
import bcrypt from 'bcrypt';

use({
    model: 'user',
    accepts: {
        type: "object",
        properties: {
            id: { type: ["integer", "null"] },
            name: { type: ["string", "null"] },
            password: { type: "string" },
        },
        required: ["password"],
    },
    returns: {
        type: "object"
    },
    allow: '$',
    http: {
        path: `/signIn`,
        verb: 'GET'
    },
    signIn: async (ctx, id, name, password) => {
        if (!id && !name) throw UNAUTHORIZED
        const userData = await ctx.exposer.user.findFirst({
            select: {
                id: true,
                name: true,
                password: true
            },
            where: {
                name,
            },
        });
        if (!userData?.id) throw UNAUTHORIZED;

        const valid = await bcrypt.compare(password, '$2b$10$E3hu73uDJQqpFutaog6KQ.lETI8QjYmHCo5FxHqGgOYEgoAk4AJri'); //change by userData.password
        if (!valid) throw UNAUTHORIZED

        const user = {
            id: userData.id,
            name: userData.name,
        }
        const token = jwt.sign(user, global.CONFIG.tokenKey, { algorithm: 'HS256' });

        await ctx.exposer.usertoken.upsert({
            where: {
                userfk: userData.id
            },
            update: {
                token: token,
                created: new Date()
            },
            create: {
                userfk: userData.id,
                token: token
            }
        });

        delete userData.password
        return Object.assign(userData, { token });
    }
});